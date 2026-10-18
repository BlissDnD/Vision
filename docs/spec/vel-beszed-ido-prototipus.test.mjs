import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleVisemes } from './vel-beszed-ido-prototipus.mjs';

const cues = [{ id: 'A', at: 1, duration: 0.25 }, { id: 'O', at: 1.2, duration: 0.3 }];

test('ugyanazt a szájformát adja ugrás és időbeli előrehaladás után', () => {
  const direct = sampleVisemes(cues, 1.23);
  sampleVisemes(cues, 3);
  sampleVisemes(cues, 0);
  assert.deepEqual(sampleVisemes(cues, 1.23), direct);
});

test('csendben nincs aktív szájforma, átfedéskor az összeg legfeljebb egy', () => {
  assert.deepEqual(sampleVisemes(cues, 0), {});
  assert.deepEqual(sampleVisemes(cues, 2), {});
  assert.ok(Object.values(sampleVisemes(cues, 1.23)).reduce((a, b) => a + b, 0) <= 1);
});

test('az időzítési hiba és a nulla hosszúságú jelzés elutasított', () => {
  assert.throws(() => sampleVisemes(cues, Number.NaN));
  assert.throws(() => sampleVisemes([{ id: 'A', at: 0, duration: 0 }], 0));
});
