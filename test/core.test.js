import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeDirectory, makeDirectorySync } from '../src/index.js';

async function tempDir() {
  return mkdtemp(join(tmpdir(), 'rdm-'));
}

describe('recursive-directory-maker-lib', () => {
  const dirs = [];

  afterEach(async () => {
    for (const d of dirs) {
      await rm(d, { recursive: true, force: true });
    }
    dirs.length = 0;
  });

  test('makeDirectory creates a nested path', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'a', 'b', 'c');
    const result = await makeDirectory(target);
    assert.equal(result, target);
    const s = await stat(target);
    assert.ok(s.isDirectory());
  });

  test('makeDirectory resolves when the directory already exists', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'a', 'b');
    await makeDirectory(target);
    const result = await makeDirectory(target);
    assert.equal(result, target);
  });

  test('makeDirectory applies the requested mode to new directories', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'mode-test');
    await makeDirectory(target, { mode: 0o700 });
    const s = await stat(target);
    assert.equal(s.mode & 0o777, 0o700);
  });

  test('makeDirectory rejects when a path component is a file', async () => {
    const base = await tempDir();
    dirs.push(base);
    const file = join(base, 'file.txt');
    await writeFile(file, '');
    await assert.rejects(makeDirectory(join(file, 'child')));
  });

  test('makeDirectorySync creates a nested path', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'x', 'y', 'z');
    const result = makeDirectorySync(target);
    assert.equal(result, target);
    const s = await stat(target);
    assert.ok(s.isDirectory());
  });

  test('makeDirectorySync resolves when the directory already exists', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'sync-existing');
    makeDirectorySync(target);
    const result = makeDirectorySync(target);
    assert.equal(result, target);
  });

  test('makeDirectorySync applies the requested mode to new directories', async () => {
    const base = await tempDir();
    dirs.push(base);
    const target = join(base, 'sync-mode');
    makeDirectorySync(target, { mode: 0o755 });
    const s = await stat(target);
    assert.equal(s.mode & 0o777, 0o755);
  });

  test('makeDirectorySync throws when a path component is a file', async () => {
    const base = await tempDir();
    dirs.push(base);
    const file = join(base, 'sync-file.txt');
    await writeFile(file, '');
    assert.throws(() => makeDirectorySync(join(file, 'child')));
  });
});
