import { mkdir } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';

const DEFAULT_MODE = 0o777;

/**
 * Recursively create a directory path. If the path already exists and is a
 * directory, it is treated as success. If any intermediate path component
 * exists but is not a directory, an error is thrown.
 *
 * The mode is applied to newly created directories. Existing directories are
 * not chmodded, matching `mkdir -p` semantics.
 *
 * @param {string} dirPath - The directory path to create.
 * @param {{mode?: number}} [options] - Optional settings.
 * @returns {Promise<string>} The path that was created (or already existed).
 */
export async function makeDirectory(dirPath, options = {}) {
  const mode = options.mode ?? DEFAULT_MODE;
  await mkdir(dirPath, { recursive: true, mode });
  return dirPath;
}

/**
 * Synchronous version of {@link makeDirectory}.
 *
 * @param {string} dirPath - The directory path to create.
 * @param {{mode?: number}} [options] - Optional settings.
 * @returns {string} The path that was created (or already existed).
 */
export function makeDirectorySync(dirPath, options = {}) {
  const mode = options.mode ?? DEFAULT_MODE;
  mkdirSync(dirPath, { recursive: true, mode });
  return dirPath;
}
