const fs = require('fs');
const path = require('path');

const glbPath = path.resolve('apps/storefront/public/models/luminaria-macrame-ninho.glb');
console.log('Inspecting:', glbPath);

const buf = fs.readFileSync(glbPath);
const magic = buf.toString('ascii', 0, 4);
const version = buf.readUInt32LE(4);
const length = buf.readUInt32LE(8);
const jsonLen = buf.readUInt32LE(12);
const jsonType = buf.toString('ascii', 16, 20);

console.log('Magic:', magic);
console.log('Version:', version);
console.log('Length in bytes:', length, `(${(length / (1024 * 1024)).toFixed(2)} MB)`);
console.log('JSON Chunk length:', jsonLen);
console.log('JSON Chunk type:', jsonType);

const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);

console.log('--- GLTF Asset ---');
console.log('Generator:', gltf.asset?.generator);
console.log('GLTF Version:', gltf.asset?.version);

console.log('--- Scenes & Nodes ---');
console.log('Scene count:', gltf.scenes?.length);
console.log('Default scene:', gltf.scene);
console.log('Node count:', gltf.nodes?.length);
if (gltf.nodes) {
  gltf.nodes.forEach((n, idx) => {
    console.log(` Node [${idx}]: name="${n.name || ''}", mesh=${n.mesh}, children=${JSON.stringify(n.children)}, translation=${JSON.stringify(n.translation)}, rotation=${JSON.stringify(n.rotation)}, scale=${JSON.stringify(n.scale)}`);
  });
}

console.log('--- Meshes & Primitives ---');
console.log('Mesh count:', gltf.meshes?.length);
if (gltf.meshes) {
  gltf.meshes.forEach((m, idx) => {
    console.log(` Mesh [${idx}]: name="${m.name || ''}", primitives=${m.primitives?.length}`);
    m.primitives?.forEach((p, pIdx) => {
      console.log(`   Primitive [${pIdx}]: mode=${p.mode}, material=${p.material}, attributes=${JSON.stringify(Object.keys(p.attributes || {}))}`);
    });
  });
}

console.log('--- Materials ---');
console.log('Material count:', gltf.materials?.length);
if (gltf.materials) {
  gltf.materials.forEach((mat, idx) => {
    console.log(` Material [${idx}]: name="${mat.name || ''}", pbrMetallicRoughness=${JSON.stringify(mat.pbrMetallicRoughness)}`);
  });
}

console.log('--- Textures & Images ---');
console.log('Texture count:', gltf.textures?.length || 0);
console.log('Image count:', gltf.images?.length || 0);
if (gltf.images) {
  gltf.images.forEach((img, idx) => {
    console.log(` Image [${idx}]: name="${img.name || ''}", mimeType=${img.mimeType}, bufferView=${img.bufferView}`);
  });
}

console.log('--- Accessors & BufferViews ---');
console.log('Accessors:', JSON.stringify(gltf.accessors, null, 2));
console.log('BufferViews:', JSON.stringify(gltf.bufferViews, null, 2));

// Image size and dimensions
if (gltf.images && gltf.bufferViews) {
  const imgBv = gltf.bufferViews[gltf.images[0].bufferView];
  const binOffset = 20 + jsonLen;
  const imgOffset = binOffset + 8 + imgBv.byteOffset;
  const imgBuf = buf.subarray(imgOffset, imgOffset + imgBv.byteLength);
  console.log('PNG size bytes:', imgBuf.length, `(${(imgBuf.length / (1024 * 1024)).toFixed(2)} MB)`);
  if (imgBuf.length > 24) {
    const w = imgBuf.readUInt32BE(16);
    const h = imgBuf.readUInt32BE(20);
    console.log('PNG Dimensions:', w, 'x', h);
  }
}


// Check bounding box from position accessors
if (gltf.accessors && gltf.meshes) {
  let minBox = [Infinity, Infinity, Infinity];
  let maxBox = [-Infinity, -Infinity, -Infinity];
  gltf.meshes.forEach(m => {
    m.primitives?.forEach(p => {
      const posAccIdx = p.attributes?.POSITION;
      if (posAccIdx !== undefined) {
        const acc = gltf.accessors[posAccIdx];
        if (acc && acc.min && acc.max) {
          for (let i = 0; i < 3; i++) {
            minBox[i] = Math.min(minBox[i], acc.min[i]);
            maxBox[i] = Math.max(maxBox[i], acc.max[i]);
          }
        }
      }
    });
  });
  console.log('--- Model Bounding Box (AABB) ---');
  console.log('Min:', minBox);
  console.log('Max:', maxBox);
  console.log('Size (X, Y, Z):', [
    (maxBox[0] - minBox[0]).toFixed(3),
    (maxBox[1] - minBox[1]).toFixed(3),
    (maxBox[2] - minBox[2]).toFixed(3)
  ]);
  console.log('Center (X, Y, Z):', [
    ((maxBox[0] + minBox[0]) / 2).toFixed(3),
    ((maxBox[1] + minBox[1]) / 2).toFixed(3),
    ((maxBox[2] + minBox[2]) / 2).toFixed(3)
  ]);
}
