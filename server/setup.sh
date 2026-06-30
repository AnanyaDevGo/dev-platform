#!/usr/bin/env bash
set -euo pipefail

SERVER_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SERVER_ROOT"

if ! command -v uv >/dev/null 2>&1; then
  echo "==> Installing uv (Python toolchain manager)..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

echo "==> Starting PostgreSQL and Redis (Docker)..."
docker-compose up -d

echo "==> Waiting for database..."
for i in {1..30}; do
  if docker-compose exec -T postgres pg_isready -U devportal -d dev_portal >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

cat > .env <<'EOF'
DATABASE_URL=postgresql+psycopg://devportal:password@localhost:5432/dev_portal
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-me-for-prod
SESSION_SECRET=change-me-for-prod
CORS_ORIGIN=http://localhost:5173
PORT=4000
EOF

echo "==> Installing Python 3.12 and creating virtual environment..."
export PATH="$HOME/.local/bin:$PATH"
uv python install 3.12
rm -rf .venv
uv venv --python 3.12 .venv
source .venv/bin/activate
uv pip install -r requirements.txt

echo "==> Running migrations..."
alembic upgrade head

echo "==> Seeding data..."
python scripts/seed.py

echo ""
echo "Setup complete."
echo ""
echo "Start the API:"
echo "  source .venv/bin/activate"
echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 4000"
echo ""
echo "Or: ./start.sh"
echo ""
echo "Admin login: admin@example.com / Admin1234"
