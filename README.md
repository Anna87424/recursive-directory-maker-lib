# recursive-directory-maker-lib

Create nested directory paths with a configurable mode, treating an existing directory as success.

```js
import { makeDirectory, makeDirectorySync } from './src/index.js';

await makeDirectory('build/assets/images', { mode: 0o755 });
makeDirectorySync('build/assets/images');
```

## Why this exists

`fs.mkdir(path, { recursive: true })` already does most of the work, but callers often
need a small library that makes the intended contract explicit: creating a path that
already exists is not an error, and the mode should apply to the directories that are
actually created. This package wraps the standard library with that contract and returns
the path so it can be chained.

The trade-off is deliberate: the asynchronous function uses `node:fs/promises` and the
synchronous function uses `node:fs`, so both are available without pulling in anything
else. Existing directories are never chmodded, matching the behaviour of `mkdir -p`.

## Edge case

If a component of the path already exists as a regular file, both functions fail. The
asynchronous version rejects, and the synchronous version throws. This is intentional:
silently replacing a file with a directory would be worse than surfacing the conflict.
