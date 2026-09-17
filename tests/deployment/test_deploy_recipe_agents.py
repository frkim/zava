import importlib.util
import json
from pathlib import Path
import unittest
from types import SimpleNamespace
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("recipe_deployment", ROOT / "scripts" / "deploy-recipe-agents.py")
deployment = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deployment)


class DeploymentChecks(unittest.TestCase):
    def test_strict_output_contract_is_on_agent_definitions(self):
        agents = deployment.definitions("recipe-model")
        for name, schema_name, required in (
            ("recipe-planner", "recipe_ingredients", ["ingredients"]),
            ("recipe-shopper", "recipe_selection", ["selections", "missingIngredientIndexes"]),
        ):
            agent = agents[name]
            self.assertEqual(agent["reasoning"], {"effort": "low"})
            output = agent["text"]["format"]
            self.assertEqual(output["type"], "json_schema")
            self.assertEqual(output["name"], schema_name)
            self.assertTrue(output["strict"])
            self.assertFalse(output["schema"]["additionalProperties"])
            self.assertEqual(output["schema"]["required"], required)

    def test_npm_tarballs_use_protected_feed(self):
        lock = json.loads((ROOT / "src" / "Zava.Web" / "package-lock.json").read_text(encoding="utf-8"))
        resolved = [package["resolved"] for package in lock["packages"].values() if "resolved" in package]
        self.assertTrue(resolved)
        self.assertTrue(all(url.startswith("https://packagefeedproxy.microsoft.io/npm/") for url in resolved))
        npmrc = (ROOT / "src" / "Zava.Web" / ".npmrc").read_text(encoding="utf-8")
        self.assertNotIn("replace-registry-host=always", npmrc)

    def test_token_uses_explicit_subscription_and_provider(self):
        with patch.dict(deployment.os.environ, {
            "RECIPE_TOKEN_PROVIDER": "az", "AZURE_SUBSCRIPTION_ID": "test-subscription",
        }), patch.object(deployment.shutil, "which", return_value="az.cmd"), \
                patch.object(deployment, "cli_json", return_value={"accessToken": "test-token"}) as cli:
            self.assertEqual(deployment.access_token(), "test-token")
            command = cli.call_args.args[0]
            self.assertEqual(command[0], "az")
            self.assertEqual(command[-2:], ["--subscription", "test-subscription"])

    def test_unknown_provider_fails_explicitly(self):
        with patch.dict(deployment.os.environ, {"RECIPE_TOKEN_PROVIDER": "invalid"}):
            with self.assertRaises(deployment.DeploymentError):
                deployment.access_token()

    def test_preserves_both_live_images(self):
        apps = {"value": [
            {"tags": {"azd-service-name": service}, "properties": {
                "template": {"containers": [{"image": f"registry/{service}:current"}]}}}
            for service in ("api", "web")
        ]}
        values = {"AZURE_SUBSCRIPTION_ID": "11111111-1111-1111-1111-111111111111", "AZURE_ENV_NAME": "test"}
        with patch.object(deployment, "access_token", return_value="test-token"), \
                patch.object(deployment, "request_json", return_value=apps), \
                patch.object(deployment.shutil, "which", return_value="azd"), \
                patch.object(deployment.subprocess, "run", return_value=SimpleNamespace(returncode=0)) as run:
            deployment.preserve_images(values)
            self.assertEqual([call.args[0][3:] for call in run.call_args_list], [
                ["SERVICE_API_IMAGE_NAME", "registry/api:current"],
                ["SERVICE_WEB_IMAGE_NAME", "registry/web:current"],
            ])

    def test_duplicate_service_tags_fail(self):
        app = {"tags": {"azd-service-name": "api"}}
        values = {"AZURE_SUBSCRIPTION_ID": "11111111-1111-1111-1111-111111111111", "AZURE_ENV_NAME": "test"}
        with patch.object(deployment, "access_token", return_value="test-token"), \
                patch.object(deployment, "request_json", return_value={"value": [app, app]}):
            with self.assertRaises(deployment.DeploymentError):
                deployment.preserve_images(values)

    def test_missing_resource_group_is_allowed_but_forbidden_is_not(self):
        values = {"AZURE_SUBSCRIPTION_ID": "11111111-1111-1111-1111-111111111111", "AZURE_ENV_NAME": "test"}
        with patch.object(deployment, "access_token", return_value="test-token"), \
                patch.object(deployment, "request_json", side_effect=deployment.RequestError(404)):
            deployment.preserve_images(values)
        with patch.object(deployment, "access_token", return_value="test-token"), \
                patch.object(deployment, "request_json", side_effect=deployment.RequestError(403)):
            with self.assertRaises(deployment.RequestError):
                deployment.preserve_images(values)


if __name__ == "__main__":
    unittest.main()
