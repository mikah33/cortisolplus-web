#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = ["google-api-python-client", "google-auth-httplib2"]
# ///
"""Read-only, reproducible 28-day GSC comparison using the existing local account.

Writes an explicit dated error on failure. Never publishes data or sends messages.
Usage: uv run scripts/gsc-report.py --output /absolute/private/report.json
"""
import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

PROPERTY = "https://cortisolplus.com/"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output", type=Path, required=True)
parser.add_argument("--end", help="Last day, YYYY-MM-DD; defaults to three days ago")
args = parser.parse_args()
now = datetime.now(timezone.utc)
payload = {"gsc_property": PROPERTY, "pulled_at": now.isoformat(), "status": "error"}
try:
    end = datetime.strptime(args.end, "%Y-%m-%d").date() if args.end else now.date() - timedelta(days=3)
    if end > now.date() - timedelta(days=3):
        raise ValueError("Choose an end date at least three days ago for the final-data report")
    creds = Credentials.from_authorized_user_file(str(Path.home() / ".config/seo-weekly/token.json"))
    if not creds.valid:
        creds.refresh(Request())
    service = build("webmasters", "v3", credentials=creds, cache_discovery=False)

    def window(last):
        first = last - timedelta(days=27)
        base = {"startDate": first.isoformat(), "endDate": last.isoformat(), "type": "web", "dataState": "final"}
        result = {"start": first.isoformat(), "end": last.isoformat()}
        for label, dimensions in [("totals", []), ("queries", ["query"]), ("pages", ["page"])]:
            rows = service.searchanalytics().query(siteUrl=PROPERTY, body={**base, "dimensions": dimensions, "rowLimit": 25000}).execute().get("rows", [])
            result[label] = rows
        return result

    current = window(end)
    previous = window(end - timedelta(days=28))
    curr = (current["totals"] or [{}])[0]
    prev = (previous["totals"] or [{}])[0]
    delta = {metric: curr.get(metric, 0) - prev.get(metric, 0) for metric in ["clicks", "impressions", "ctr", "position"]}
    payload.update(status="ok", data_state="final", fresh_until=(now.date() + timedelta(days=8)).isoformat(), current=current, previous=previous, absolute_delta=delta,
                   notes=["CTR values and delta use fractions, not percentage points.", "Query tables omit anonymized queries; their sums can differ from totals.", "Web includes Google AI features; this report does not isolate AI referrals."])
except Exception as exc:
    # Do not serialize token objects or HTTP response bodies into reports.
    payload["error"] = f"{type(exc).__name__}: Google reporting failed; inspect account/property access and date range."
    print(payload["error"], file=sys.stderr)
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(payload, indent=2) + "\n")
print(f"GSC report {payload['status']}: {args.output}")
sys.exit(0 if payload["status"] == "ok" else 1)
