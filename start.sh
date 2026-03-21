#!/bin/bash
set -e

echo "============================================"
echo "  Zava - Lancement local"
echo "============================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Vérifier les prérequis
command -v dotnet >/dev/null 2>&1 || { echo "[ERREUR] dotnet n'est pas installé."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "[ERREUR] Node.js n'est pas installé."; exit 1; }

# Installer les dépendances frontend si nécessaire
if [ ! -d "src/Zava.Web/node_modules" ]; then
    echo "[1/4] Installation des dépendances frontend..."
    (cd src/Zava.Web && npm install)
else
    echo "[1/4] Dépendances frontend OK"
fi

# Build backend
echo "[2/4] Build du backend..."
dotnet build src/Zava.Api/Zava.Api.csproj --nologo -q
echo "      Backend OK"

# Fonction de nettoyage pour arrêter les processus au Ctrl+C
cleanup() {
    echo ""
    echo "Arrêt des services..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM

# Lancer le backend en arrière-plan
echo "[3/4] Démarrage du backend (http://localhost:5014)..."
dotnet run --project src/Zava.Api/Zava.Api.csproj --no-build &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Lancer le frontend
echo "[4/4] Démarrage du frontend (http://localhost:5173)..."
echo ""
echo "============================================"
echo "  Backend  : http://localhost:5014"
echo "  Frontend : http://localhost:5173"
echo "  API docs : http://localhost:5014/openapi/v1.json"
echo "============================================"
echo ""
echo "Ctrl+C pour arrêter les deux services."
echo ""

cd src/Zava.Web
npm run dev
