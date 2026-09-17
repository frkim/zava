#!/usr/bin/env python3
"""Exercise real recipe generation and optionally commit it to an approved demo basket."""

import argparse
from collections import Counter
from decimal import Decimal
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


class CheckError(Exception):
    pass


def request(origin, path, body=None):
    payload = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(origin + path, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=100) as response:
            return json.load(response, parse_float=Decimal)
    except urllib.error.HTTPError as error:
        detail = error.read(4096).decode("utf-8", errors="replace")
        raise CheckError(f"{path}: HTTP {error.code}: {detail}") from None
    except (urllib.error.URLError, TimeoutError) as error:
        raise CheckError(f"{path}: {error}") from None


def quantities(items):
    return Counter({(item["productId"], item.get("variantId")): item["quantity"] for item in items})


def require(condition, message):
    if not condition:
        raise CheckError(message)


def verify(origin, recipe, servings, brand, commit):
    require(request(origin, "/api/config")["currentSiteType"] == "Grocery",
            "Select Grocery in the approved demo first. This script never resets shared state.")
    require(request(origin, "/api/recipe-basket/options")["available"], "Recipe service is not configured.")
    before = request(origin, "/api/cart")
    catalog = {product["id"]: product for product in request(origin, "/api/products")}
    started = time.monotonic()
    plan = request(origin, "/api/recipe-basket/plan", {
        "recipe": recipe, "servings": servings, "brandPreference": brand,
    })
    duration = round(time.monotonic() - started, 1)
    require(request(origin, "/api/cart") == before, "Generating a preview changed the cart.")
    require(plan["items"], "No products matched the requested recipe.")
    require(plan["recipe"] == recipe and plan["servings"] == servings and plan["brandPreference"] == brand,
            "Preview does not match the requested recipe.")
    tags = {"National": "brand:national", "PrivateLabel": "brand:private-label", "Economy": "brand:economy"}
    for item in plan["items"]:
        product = catalog.get(item["productId"])
        require(product is not None, "Preview contains an unknown product.")
        require(type(item["quantity"]) is int and 1 <= item["quantity"] <= 100, "Invalid whole-pack quantity.")
        if brand in tags:
            require(tags[brand] in product["tags"], "Product does not match the requested brand tier.")
        price = product["promoPrice"] if product.get("promoPrice") is not None else product["price"]
        if item["variantId"] is not None:
            variant = next((v for v in product["variants"] if v["id"] == item["variantId"]), None)
            require(variant is not None, "Preview contains an unknown variant.")
            price += variant["priceAdjustment"]
        require(item["unitPrice"] == price, "Preview price differs from the catalogue.")
        require(item["subtotal"] == price * item["quantity"], "Incorrect line subtotal.")
    require(plan["total"] == sum(item["subtotal"] for item in plan["items"]), "Incorrect preview total.")
    result = {
        "recipe": recipe, "servings": servings, "brandPreference": brand,
        "generationSeconds": duration, "lines": len(plan["items"]),
        "total": str(plan["total"]), "missingIngredients": plan["missingIngredients"],
        "previewDidNotChangeCart": True, "cataloguePricesVerified": True,
        "committed": False,
    }
    if commit:
        added = request(origin, "/api/recipe-basket/commit", {"planId": plan["planId"]})
        expected = quantities(before["items"]) + quantities(plan["items"])
        require(quantities(added["items"]) == expected, "Commit did not add the exact expected quantities.")
        require(added["total"] == sum(item["unitPrice"] * item["quantity"] for item in added["items"]),
                "Incorrect committed cart total.")
        repeated = request(origin, "/api/recipe-basket/commit", {"planId": plan["planId"]})
        require(repeated == added, "Repeating the same confirmation duplicated or changed the basket.")
        require(request(origin, "/api/cart") == added, "Committed basket differs on a subsequent read.")
        result.update(committed=True, repeatedCommitIsIdempotent=True, cartItemCount=added["itemCount"])
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--api-uri", required=True, help="Deployed HTTPS origin, either the API or the web proxy.")
    parser.add_argument("--recipe", default="Lasagnes")
    parser.add_argument("--servings", type=int, choices=range(1, 21), default=4)
    parser.add_argument("--brand", choices=["Mix", "National", "PrivateLabel", "Economy"], default="Mix")
    parser.add_argument("--commit", action="store_true", help="Add products to the shared demo cart; obtain owner approval first.")
    args = parser.parse_args()
    parsed = urllib.parse.urlsplit(args.api_uri)
    require(parsed.scheme == "https" and parsed.hostname and not parsed.username
            and not parsed.password and parsed.path in ("", "/") and not parsed.query and not parsed.fragment,
            "--api-uri must be an HTTPS origin.")
    print(json.dumps(verify(args.api_uri.rstrip("/"), args.recipe, args.servings, args.brand, args.commit),
                     ensure_ascii=True, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (CheckError, KeyError, TypeError, ValueError) as error:
        print(f"Recipe verification failed: {error}", file=sys.stderr)
        sys.exit(1)
