import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVectorLottie, sampleLottieFrame, parseImgurMediaUrl, createTimedFrameIndex, sampleTimedFrames } from './vel-media-import-core-prototipus.mjs';

const minimal = { v: '5.12.0', w: 512, h: 512, fr: 30, ip: 10, op: 70, layers: [{ ty: 4, nm: 'Shape', shapes: [] }] };

test('accepts bounded vector data and exposes a two-second interval', () => {
  const { meta } = parseVectorLottie(JSON.stringify(minimal));
  assert.equal(meta.duration, 2);
  assert.equal(sampleLottieFrame(meta, 1.5, { layerStart: 1 }), 25);
  assert.equal(sampleLottieFrame(meta, 3, { layerStart: 1, loop: true }), 10);
  assert.equal(sampleLottieFrame(meta, 0.5, { layerStart: 1 }), null);
});

test('sampling is independent of playback order and clamps at the last frame', () => {
  const { meta } = parseVectorLottie(JSON.stringify(minimal));
  const direct = sampleLottieFrame(meta, 1.25);
  sampleLottieFrame(meta, 12);
  sampleLottieFrame(meta, 0);
  assert.equal(sampleLottieFrame(meta, 1.25), direct);
  assert.ok(sampleLottieFrame(meta, 12) < meta.op);
});

test('rejects oversized or malformed Lottie data and active/external content', () => {
  assert.throws(() => parseVectorLottie('x'.repeat(2_000_001)));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, w: 99999 })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, layers: [{ ty: 5 }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, layers: [{ ty: 2 }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, assets: [{ id: 'pre', layers: [{ ty: 5 }] }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, assets: [{ id: 'pre', layers: [{ ty: 2 }] }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, assets: [{ p: 'https://example.com/a.png' }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, layers: [{ ty: 4, x: 'alert(1)' }] })));
  assert.throws(() => parseVectorLottie(JSON.stringify({ ...minimal, __proto__: null, layers: [{ ty: 4, constructor: 'bad' }] })));
});

test('recognizes strict Imgur post/media links without fetching them', () => {
  assert.deepEqual(parseImgurMediaUrl('https://imgur.com/gallery/AbC123'), { id: 'AbC123', format: 'post', postUrl: 'https://imgur.com/AbC123' });
  assert.equal(parseImgurMediaUrl('https://i.imgur.com/AbC123.mp4').format, 'mp4');
  for (const url of ['http://imgur.com/AbC123', 'https://imgur.com.evil.test/AbC123', 'https://imgur.com/a/AbC123',
    'https://imgur.com/AbC123?token=private', 'https://user:pass@imgur.com/AbC123', 'https://i.imgur.com/AbC123.png']) {
    assert.throws(() => parseImgurMediaUrl(url));
  }
});

test('variable GIF frame delays remain deterministic across seek and loop', () => {
  const index = createTimedFrameIndex([100, 250, 50]);
  assert.equal(sampleTimedFrames(index, 0.05), 0);
  assert.equal(sampleTimedFrames(index, 0.2), 1);
  assert.equal(sampleTimedFrames(index, 0.38), 2);
  assert.equal(sampleTimedFrames(index, 0.4), 0);
  const direct = sampleTimedFrames(index, 0.22);
  sampleTimedFrames(index, 3);
  assert.equal(sampleTimedFrames(index, 0.22), direct);
  assert.equal(sampleTimedFrames(index, 3, { loop: false }), 2);
  assert.equal(sampleTimedFrames(index, 0, { layerStart: 1 }), null);
  assert.throws(() => createTimedFrameIndex([100, -1]));
});
