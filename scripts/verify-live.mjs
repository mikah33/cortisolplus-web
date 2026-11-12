import { readFile } from 'node:fs/promises';
import { verifyRelease, SITE } from './release.mjs';

try {
  const expected = JSON.parse(await readFile(process.argv[2] || 'dist/release.json', 'utf8'));
  console.log(await verifyRelease(expected, process.env.VERIFY_BASE_URL || SITE));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
