#!/usr/bin/env bash
set -euo pipefail

SERVER_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SERVER_ROOT"

source .venv/bin/activate
exec uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
