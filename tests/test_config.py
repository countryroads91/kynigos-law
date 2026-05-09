from pathlib import Path

from dental_claim_ledger.config import load_search_config


def test_loads_all_configured_search_queries():
    config = load_search_config(Path("config/search_queries.yml"))
    assert len(config["search"]["queries"]) == 9
    assert config["fetch"]["respect_robots_txt"] is True
    assert config["fetch"]["allowed_schemes"] == ["http", "https"]
