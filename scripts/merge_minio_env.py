#!/usr/bin/env python3
"""Write MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_BUCKET into .env from the process environment.

Used on the VPS after git pull so `docker compose` does not need ${MINIO_*} interpolation
(special characters like & in passwords are quoted for dotenv).
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

KEYS = ("MINIO_ROOT_USER", "MINIO_ROOT_PASSWORD", "MINIO_BUCKET")


def escape_dotenv_value(value: str) -> str:
    if value == "":
        return '""'
    if any(c in value for c in ' \t"#\'&$\n\\`'):
        esc = value.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{esc}"'
    return value


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: merge_minio_env.py path/to/.env", file=sys.stderr)
        return 2
    user = os.environ.get("MINIO_ROOT_USER", "")
    pwd = os.environ.get("MINIO_ROOT_PASSWORD", "")
    if not user or not pwd:
        print("error: MINIO_ROOT_USER and MINIO_ROOT_PASSWORD must be set in the environment", file=sys.stderr)
        return 1
    bucket = os.environ.get("MINIO_BUCKET") or "uploads"

    path = Path(sys.argv[1])
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.is_file():
        print(
            "error: .env must already exist on the server (DATABASE_URL, NEXTAUTH_SECRET, …); "
            "this script only updates MinIO keys.",
            file=sys.stderr,
        )
        return 1
    lines: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        key = line.split("=", 1)[0].strip() if "=" in line else ""
        if key in KEYS:
            continue
        lines.append(line)
    lines.append(f"MINIO_ROOT_USER={escape_dotenv_value(user)}")
    lines.append(f"MINIO_ROOT_PASSWORD={escape_dotenv_value(pwd)}")
    lines.append(f"MINIO_BUCKET={escape_dotenv_value(bucket)}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
