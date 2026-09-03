/**
 * Formatadores utilitários para BRL e dimensões brasileiras
 */

export function formatBRL(amountInCentsOrReal: number, isCents = false): string {
  const value = isCents ? amountInCentsOrReal / 100 : amountInCentsOrReal;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDimensions(width_mm?: number, height_mm?: number, depth_mm?: number): string {
  if (!width_mm || !height_mm) return '';
  const w = Math.round(width_mm / 10);
  const h = Math.round(height_mm / 10);
  if (depth_mm) {
    const d = Math.round(depth_mm / 10);
    return `${w} × ${h} × ${d} cm`;
  }
  return `${w} × ${h} cm`;
}

export function formatWeight(weight_g?: number): string {
  if (!weight_g) return '';
  if (weight_g >= 1000) {
    return `${(weight_g / 1000).toFixed(1)} kg`;
  }
  return `${weight_g} g`;
}

export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return cep;
}
