#!/bin/bash
set -e

# Validamos variable de entorno
if [ -z "$PROJECT_NAME" ]; then
  echo "❌ ERROR: Debes definir la variable de entorno PROJECT_NAME"
  exit 1
fi

PROJECT_DIR="/app/$PROJECT_NAME"

# Crear proyecto si no existe
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo "📦 Creando nuevo proyecto Vue: $PROJECT_NAME ..."
  npx create-vite "$PROJECT_NAME" --template vue
  cd "$PROJECT_DIR"
  npm install
else
  echo "✅ Proyecto $PROJECT_NAME ya existe, iniciando servidor..."
  cd "$PROJECT_DIR"
fi

# Iniciar servidor de desarrollo
npm run dev -- --host
