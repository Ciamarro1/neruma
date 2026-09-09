import { CinematicArtworkConfig } from '@neruma/types';

/**
 * Presets de histórias cinematográficas validadas para quadros e arte autoral 1:1.
 * O ativo visual original é estritamente imutável e renderizado no Canvas.
 */
export const CINEMATIC_ARTWORK_PRESETS: Record<string, CinematicArtworkConfig> = {
  'quadro-escultura-raizes-sisal': {
    product_id: 'prod_quadro_sisal_01',
    product_handle: 'quadro-escultura-raizes-sisal',
    artwork_asset_url: '/images/products/quadro-raizes-sisal.jpg',
    aspect_ratio: 0.75, // 600mm x 800mm
    palette: {
      primary: '#1A1816',
      background_dark: '#12100E',
      background_light: '#FAF8F5',
      accent: '#C26D4D',
    },
    waypoints: [
      {
        id: 'wp_full_overview',
        x_percent: 50.0,
        y_percent: 50.0,
        zoom_scale: 1.0,
        lighting_mood: 'gallery_spot',
        label: 'Visão Geral Autoral',
        description: 'Enquadramento completo 60 × 80 cm com suspensão museológica e sombra de contato.',
      },
      {
        id: 'wp_sisal_relief',
        x_percent: 48.0,
        y_percent: 46.0,
        zoom_scale: 3.2,
        lighting_mood: 'raking_light',
        label: 'Relevo Escultórico em Sisal',
        description: 'Trama viva esculpida manualmente em nós torcidos de sisal baiano agroecológico.',
      },
      {
        id: 'wp_frame_freijo',
        x_percent: 86.0,
        y_percent: 84.0,
        zoom_scale: 2.6,
        lighting_mood: 'museum_ambient',
        label: 'Moldura Caixa em Freijó',
        description: 'Marcenaria de precisão em madeira maciça Freijó com 50mm de profundidade e cera natural.',
      },
      {
        id: 'wp_canvas_texture',
        x_percent: 32.0,
        y_percent: 62.0,
        zoom_scale: 3.6,
        lighting_mood: 'dramatic_contrast',
        label: 'Base em Algodão Cru Texturizado',
        description: 'Superfície orgânica encorpada que cria o substrato para a emersão botânica das raízes.',
      },
    ],
    acts: [
      {
        act_number: 1,
        title: 'O Silêncio da Galeria',
        subtitle: 'Prólogo & Atmosfera',
        prose: 'No silêncio da arquitetura biofílica, a matéria viva assume o centro. Uma celebração da textura, da pausa e da quietude estética.',
        waypoint_id: 'wp_full_overview',
        bg_theme: 'dark',
      },
      {
        act_number: 2,
        title: 'A Forma no Espaço',
        subtitle: 'Presença & Proporção',
        prose: 'Com proporções de 60 × 80 cm e 50 mm de profundidade de caixa, a obra ancora o ambiente sem disputar a atenção, irradiando calor natural.',
        waypoint_id: 'wp_full_overview',
        bg_theme: 'dark',
      },
      {
        act_number: 3,
        title: 'O Relevo Botânico',
        subtitle: 'Macro Detalhe Tátil',
        prose: 'Aproxime-se da matéria. Cada curva da raiz foi moldada com tensões graduadas, capturando a luz rasante do sol ao longo das horas.',
        waypoint_id: 'wp_sisal_relief',
        bg_theme: 'charcoal',
      },
      {
        act_number: 4,
        title: 'Origem & Sustentabilidade',
        subtitle: 'BOM Factual Neruma',
        prose: 'Fibra de sisal nativa colhida responsavelmente, algodão agroecológico brasileiro e estrutura de madeira certificada de manejo consciente.',
        waypoint_id: 'wp_canvas_texture',
        highlight_facts: [
          { label: 'Matéria Principal', value: 'Sisal Natural Torcido' },
          { label: 'Moldura', value: 'Freijó Maciço Certificado' },
          { label: 'Acabamento', value: 'Cera Natural de Abelha' },
        ],
        bg_theme: 'charcoal',
      },
      {
        act_number: 5,
        title: 'Marcenaria Nobre',
        subtitle: 'A Moldura Freijó',
        prose: 'O Freijó possui tonalidade dourada aconchegante e veios discretos. A caixa afasta a obra do fundo, criando um efeito de flutuação que valoriza qualquer parede.',
        waypoint_id: 'wp_frame_freijo',
        bg_theme: 'warm_stone',
      },
      {
        act_number: 6,
        title: 'A Voz do Ateliê',
        subtitle: 'Trabalho Manual Paciente',
        prose: 'Mais de 11 horas de dedicação minuciosa no ateliê. Uma criação que recusa a pressa industrial para entregar alma aos ambientes contemporâneos.',
        quote: {
          text: 'Esculpir o sisal é dialogar com a paciência das raízes que sustentam as matas.',
          author: 'Ateliê Raízes Neruma',
          role: 'Artesãos Criadores',
        },
        waypoint_id: 'wp_sisal_relief',
        bg_theme: 'sand',
      },
      {
        act_number: 7,
        title: 'A Obra no Ambiente',
        subtitle: 'Curadoria Biofílica',
        prose: 'Harmoniza perfeitamente com iluminação indireta quente (2700K), paredes de linho ou cal, e superfícies de madeira natural em salas de estar, quartos e recepções executivas.',
        waypoint_id: 'wp_full_overview',
        bg_theme: 'sand',
      },
      {
        act_number: 8,
        title: 'Aquisição & Exclusividade',
        subtitle: 'Obra Única para o seu Espaço',
        prose: 'Peça numerada, acompanhada de certificado assinado pelo ateliê. Embalagem reforçada sob medida para transporte em todo o Brasil.',
        waypoint_id: 'wp_full_overview',
        bg_theme: 'dark',
      },
    ],
    curator_note: 'Curadoria Neruma 2026 — Coleção Raízes. Asset 1:1 rigorosamente preservado.',
  },
};
