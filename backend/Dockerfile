FROM python:3.14-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential make gcc && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock .env ./ 

RUN uv sync --frozen --no-dev

COPY app/ ./app

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]