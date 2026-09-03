import pytest
from app.domain.product import ProductSnapshot
from app.domain.enrichment import ProductEnrichment, DesignAttributes, SEOPackage
from app.pipelines.quality_gate import evaluate_quality_gate

def test_quality_gate_passes_for_valid_facts():
    product = ProductSnapshot(
        id="prod_01",
        title="Painel Orgânico Freijó & Sisal",
        handle="painel-organico-freijo-sisal",
        metadata={
            "design": {"materials": ["madeira_macica_freijo", "fibra_sisal"]}
        }
    )

    enrichment = ProductEnrichment(
        title_commercial="Painel Orgânico Freijó & Sisal Autoral",
        subtitle="Conceito biofílico artesanal para salas elegantes",
        description_commercial="Uma peça exclusiva tecida com sisal genuíno e madeira Freijó de manejo sustentável.",
        storytelling="Inspirado nas curvas da natureza brasileira.",
        design=DesignAttributes(
            materials=["madeira_macica_freijo", "fibra_sisal"],
            styles=["japandi", "organico"],
            rooms=["sala_de_estar"],
            finishes=["oleo_mineral"]
        ),
        seo=SEOPackage(
            meta_title="Painel Freijó e Sisal Orgânico | Neruma Design",
            meta_description="Descubra o Painel Freijó e Sisal Neruma, feito à mão com madeiras nobres e fibras naturais.",
            focus_keywords=["painel freijo", "decoracao organica"],
            suggested_slug="painel-organico-freijo-sisal"
        ),
        confidence=0.95
    )

    result = evaluate_quality_gate(product, enrichment)

    assert result.passed is True
    assert result.confidence_score >= 0.90
    assert result.routing == "auto_publish"
    assert len(result.failed_rules) == 0

def test_quality_gate_catches_hallucinated_materials():
    product = ProductSnapshot(
        id="prod_02",
        title="Quadro Minimalista Freijó",
        handle="quadro-minimalista-freijo",
        metadata={
            "design": {"materials": ["madeira_macica_freijo"]}
        }
    )

    # IA inventou 'madeira de demolição' e 'metal'
    enrichment = ProductEnrichment(
        title_commercial="Quadro Minimalista Freijó e Demolição com Metal",
        subtitle="Peça rústica pesada",
        description_commercial="Feito com ferro fundido e madeira de demolição antiga.",
        storytelling="História inventada.",
        design=DesignAttributes(
            materials=["madeira_macica_freijo", "ferro_fundido", "madeira_demolicao"],
            styles=["rustico"],
            rooms=["sala_de_estar"],
            finishes=["verniz"]
        ),
        seo=SEOPackage(
            meta_title="Quadro Freijó Demolição | Neruma",
            meta_description="Quadro em ferro fundido e demolição rústica artesanal.",
            focus_keywords=["quadro demolicao"],
            suggested_slug="quadro-freijo-demolicao"
        ),
        confidence=0.90
    )

    result = evaluate_quality_gate(product, enrichment)

    assert result.passed is False
    assert any("Materiais inventados" in rule for rule in result.failed_rules)
    assert result.routing != "auto_publish"
