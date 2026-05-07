## Development

### Environment

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env
```

### MinIO (local)

Start MinIO with Docker:

```bash
docker compose up -d
```

- S3 endpoint: `http://localhost:9000`
- Console UI: `http://localhost:9001`

Notes:
- `docker-compose.yml` requires `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`, and `MINIO_BUCKET` to be set via `.env` (no insecure defaults are baked in).

### App

Run the dev server:

```bash
npm run dev
```
