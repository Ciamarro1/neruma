from app.domain.product import ProductSnapshot
from app.domain.enrichment import ProductEnrichment, QualityGateResult

VALID_MATERIALS = {
    'madeira_macica_freijo', 'freijo',
    'madeira_macica_cumaru', 'cumaru',
    'madeira_macica_jequitiba', 'jequitiba',
    'bambu_natural', 'bambu',
    'fibra_sisal', 'sisal',
    'corda_algodao', 'algodao',
    'ceramica_artesanal', 'ceramica',
    'linho_puro', 'linho',
    'aco_carbono_fosco', 'metal'
}

def evaluate_quality_gate(
    product: ProductSnapshot,
    enrichment: ProductEnrichment
) -> QualityGateResult:
    failed_rules = []
    warnings = []
    confidence = enrichment.confidence

    # 1. Validação de Tamanho de Título e SEO
    if len(enrichment.title_commercial) < 5 or len(enrichment.title_commercial) > 90:
        failed_rules.append(f"Título comercial inválido ({len(enrichment.title_commercial)} chars)")
        confidence -= 0.15

    if len(enrichment.seo.meta_title) < 30 or len(enrichment.seo.meta_title) > 70:
        warnings.append(f"Meta title fora do intervalo ideal de 30-70 ({len(enrichment.seo.meta_title)} chars)")
        confidence -= 0.05

    if len(enrichment.seo.meta_description) < 80 or len(enrichment.seo.meta_description) > 170:
        warnings.append(f"Meta description fora do intervalo de 80-170 ({len(enrichment.seo.meta_description)} chars)")
        confidence -= 0.05

    # 2. Validação Anti-Alucinação de Materiais
    declared = set(m.lower() for m in product.declared_materials)
    generated = set(m.lower() for m in enrichment.design.materials)

    # Se a IA inventou materiais além dos declarados pelo artesão/admin
    invented_materials = generated - declared
    if declared and invented_materials:
        # Se os materiais inventados não forem termos genéricos
        unmatched = [m for m in invented_materials if not any(d in m or m in d for d in declared)]
        if unmatched:
            failed_rules.append(f"Materiais inventados pela IA não declarados: {unmatched}")
            confidence -= 0.25

    # 3. Roteamento por Confidence Score
    confidence = max(0.0, min(1.0, confidence))
    if confidence >= 0.90 and not failed_rules:
        routing = 'auto_publish'
    elif confidence >= 0.70 or warnings:
        routing = 'human_review'
    else:
        routing = 'rejected'

    passed = len(failed_rules) == 0

    return QualityGateResult(
        passed=passed,
        confidence_score=round(confidence, 2),
        routing=routing,
        failed_rules=failed_rules,
        warnings=warnings
    )
