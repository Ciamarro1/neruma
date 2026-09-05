'use client';

import React, { Suspense, useRef, useState, useEffect, useCallback, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Error Boundary para isolar falhas de WebGL                         */
/* ------------------------------------------------------------------ */
class CanvasErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('[3D Viewer] Erro no renderizador WebGL, alternando para fallback:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Modelo GLB com auto-computação de normais e materiais              */
/* ------------------------------------------------------------------ */
interface ModelProps {
  url: string;
  autoRotate: boolean;
}

function Model({ url, autoRotate }: ModelProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null!);

  // Auto-rotação contínua e elegante
  useFrame((_state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  // Otimização e correção de normais para shading correto
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          // Garante normais para superfícies que não possuam atributo normal
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }
        }
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.roughness = 0.85;
            mat.metalness = 0.05;
            mat.envMapIntensity = 0.8;
            mat.needsUpdate = true;
          }
        }
      }
    });
  }, [scene]);

  return (
    <Center top>
      <group ref={groupRef} dispose={null}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

// Pré-carrega o modelo para evitar atrasos
useGLTF.preload('/models/luminaria-macrame-ninho.glb');

/* ------------------------------------------------------------------ */
/* Scene (Iluminação autônoma de estúdio sem dependência externa)      */
/* ------------------------------------------------------------------ */
interface SceneProps {
  modelUrl: string;
  autoRotate: boolean;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

function Scene({ modelUrl, autoRotate, onInteractionStart, onInteractionEnd }: SceneProps) {
  return (
    <>
      {/* Fundo escuro do canvas alinhado com a paleta Zenin */}
      <color attach="background" args={['#141210']} />

      {/* Iluminação de estúdio multi-ponto focada na textura artesanal */}
      <ambientLight intensity={1.1} color="#FFF6EE" />
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.2}
        color="#FFF2DD"
      />
      <directionalLight
        position={[-4, 4, -3]}
        intensity={1.0}
        color="#EAD5C0"
      />
      <pointLight position={[0, -2, 3]} intensity={0.7} color="#DE9674" />
      <pointLight position={[0, 4, 0]} intensity={1.2} color="#FFFFFF" />

      <Suspense fallback={null}>
        <Model url={modelUrl} autoRotate={autoRotate} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.8}
        maxDistance={6.0}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 1.6}
        onStart={onInteractionStart}
        onEnd={onInteractionEnd}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Detector de WebGL seguro                                            */
/* ------------------------------------------------------------------ */
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('webgl2'))
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Componente Público                                                  */
/* ------------------------------------------------------------------ */
export interface ProductViewer3DProps {
  modelUrl: string;
  fallbackImageUrl?: string;
  productTitle: string;
  className?: string;
}

export function ProductViewer3D({
  modelUrl,
  fallbackImageUrl,
  productTitle,
  className = '',
}: ProductViewer3DProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  const handleInteractionStart = useCallback(() => {
    setAutoRotate(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAutoRotate(true), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Fallback visual caso WebGL não esteja disponível
  const fallbackView = (
    <div className={`relative w-full h-full bg-[#141210] rounded-organic overflow-hidden flex items-center justify-center ${className}`}>
      {fallbackImageUrl ? (
        <img
          src={fallbackImageUrl}
          alt={productTitle}
          className="w-full h-full object-cover object-center opacity-85"
        />
      ) : (
        <div className="text-xs text-neruma-sand-400/60 uppercase tracking-widest">
          Visualização 3D indisponível
        </div>
      )}
    </div>
  );

  if (!hasWebGL) {
    return fallbackView;
  }

  return (
    <CanvasErrorBoundary fallback={fallbackView}>
      <div className={`relative w-full h-full bg-[#141210] rounded-organic overflow-hidden border border-white/10 ${className}`}>
        {/* Placeholder / Loading com fundo escuro */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#141210]">
            {fallbackImageUrl && (
              <img
                src={fallbackImageUrl}
                alt={productTitle}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
            )}
            <div className="relative z-20 flex flex-col items-center justify-center">
              <div className="w-9 h-9 border-2 border-neruma-terracotta-light border-t-transparent rounded-full animate-spin" />
              <span className="mt-4 text-xs font-medium text-neruma-sand-300 uppercase tracking-widest">
                Renderizando Modelo 3D
              </span>
            </div>
          </div>
        )}

        <Canvas
          camera={{ position: [0, 0.4, 3.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          onCreated={() => setIsLoaded(true)}
          style={{ width: '100%', height: '100%', background: '#141210', touchAction: 'none' }}
        >
          <Scene
            modelUrl={modelUrl}
            autoRotate={autoRotate}
            onInteractionStart={handleInteractionStart}
            onInteractionEnd={handleInteractionEnd}
          />
        </Canvas>

        {/* Hint de interação visual */}
        {isLoaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              <p className="text-[11px] text-neruma-sand-200/80 tracking-wider flex items-center gap-2 font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neruma-terracotta-light">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 12l4-4 4 4M8 12l4 4 4-4" />
                </svg>
                Gire com o mouse · Scroll para zoom
              </p>
            </div>
          </div>
        )}
      </div>
    </CanvasErrorBoundary>
  );
}
