import { existsSync } from 'node:fs';
import { join } from 'node:path';

const publicCandidates = [
  join(process.cwd(), 'public'),
  join(__dirname, '..', 'public'),
  join(__dirname, '..', '..', 'public'),
];

export const publicRoot =
  publicCandidates.find((candidate) =>
    existsSync(join(candidate, 'index.html')),
  ) ?? publicCandidates[0];
