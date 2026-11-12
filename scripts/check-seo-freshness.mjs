import { readFile } from 'node:fs/promises';

try {
  const report = JSON.parse(await readFile(process.argv[2] || 'seo-data/weekly-gsc.json', 'utf8'));
  if (report.status !== 'ok') throw new Error('Latest Google report failed or has no success status');
  if (report.gsc_property !== 'https://cortisolplus.com/') throw new Error('Incorrect Google property');
  const expiry = Date.parse(`${report.fresh_until}T23:59:59Z`);
  if (!Number.isFinite(expiry) || Date.now() > expiry) throw new Error(`Stale Google data: last pull ${report.pulled_at || 'unknown'}`);
  console.log(`Google report current: ${report.date_range.start} to ${report.date_range.end}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
