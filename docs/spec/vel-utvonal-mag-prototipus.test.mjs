import assert from 'node:assert/strict';
import test from 'node:test';
import { createArcPath, distributeOnPath, cameraOnPath } from './vel-utvonal-mag-prototipus.mjs';

test('open path endpoints, uniform distance and finite tangent', () => {
  const path = createArcPath([[0,0,0],[10,0,0],[20,0,0]]);
  assert.deepEqual(path.sample(0), [0,0,0]);
  assert.deepEqual(path.sample(1), [20,0,0]);
  assert.ok(Math.abs(path.sample(0.5)[0] - 10) < 0.02);
  assert.ok(path.tangent(0.5)[0] > 0.99);
  assert.deepEqual(path.sample(-10), path.sample(0));
});

test('closed path wraps and excludes duplicate first card', () => {
  const path = createArcPath([[0,0,0],[1,0,0],[1,1,0],[0,1,0]], { closed: true });
  assert.deepEqual(path.sample(0), path.sample(1));
  const cards = distributeOnPath(path, 4);
  assert.equal(cards.length, 4);
  assert.ok(cards[3].u < 1);
  assert.notDeepEqual(cards[0].position, cards[3].position);
});

test('camera pose is independent of playback order', () => {
  const path = createArcPath([[0,0,0],[1,0,0],[1,1,0],[0,1,0]], { closed: true });
  const before = cameraOnPath(path, 2.75, { duration: 5 });
  cameraOnPath(path, 4.5, { duration: 5 });
  cameraOnPath(path, 0.1, { duration: 5 });
  assert.deepEqual(cameraOnPath(path, 2.75, { duration: 5 }), before);
});

test('invalid and degenerate paths fail explicitly', () => {
  assert.throws(() => createArcPath([[0,0,0]]));
  assert.throws(() => createArcPath([[0,0,0],[0,0,0]]));
});
