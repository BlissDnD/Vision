/* Spine-swept ribbon (the spine is the crest line): a wide, thin sheet with rounded edges built along an editable 3D curve.
 *
 * Cross-section (local frame per spine sample):  w = width axis, b = thickness axis (sheet normal), T = tangent.
 *   top face (v = +h) ── right cap (half circle) ── bottom face (v = -h) ── left cap.
 * The ring is closed by index wrap, so normals stay smooth across the caps (the bright rim highlight).
 * Floor blend: vertices below `fillet` height are pushed up with y' = r·exp(y/r − 1), which is C1 at y = r and
 * tends to the floor, so the sheet flares out and runs tangent into the floor instead of cutting it.
 */
import * as THREE from 'three';

const tmp = new THREE.Vector3();

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function makeCurve(P) {
  const pts = P.pts.map(p => new THREE.Vector3(p[0], p[1] * P.arch, p[2]));
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
}

/** Width at spine parameter s ∈ [0,1]; taper > 0 = wider at the start (left), narrower at the end. */
export const widthAt = (P, s) => P.width * Math.max(0.04, 1 + P.taper * (1 - 2 * s));

export function frameAt(curve, P, s, prevW) {
  const T = curve.getTangentAt(s).normalize();
  // the spine is the crest; the sheet hangs down from it, leaning toward the camera (lean > 0) or back (lean < 0)
  const lean = P.lean + (P.leanEnd - P.lean) * smooth(0.15, 0.85, s), DEPTH = new THREE.Vector3(0, -1, lean).normalize();
  const w = DEPTH.clone().addScaledVector(T, -T.dot(DEPTH));
  if (w.lengthSq() < 1e-6) w.copy(prevW || new THREE.Vector3(1, 0, 0)); else w.normalize();
  const th = P.twist * smooth(0.3, 1, s); // twist builds up along the second half (the arch), the wave start stays put
  const tw = tmp.crossVectors(T, w);
  const wr = w.clone().multiplyScalar(Math.cos(th)).addScaledVector(tw, Math.sin(th)).normalize();
  const b = new THREE.Vector3().crossVectors(T, wr).normalize();
  return { p: curve.getPointAt(s), T, w: wr, b };
}

function ringProfile(NF, NC) {
  // returns [{u: 0..1 along width (null on caps), cap: -1|1|0, a: cap angle, side: 0..1 (1 = top)}]
  const R = [];
  for (let i = 0; i < NF; i++) R.push({ u: i / (NF - 1), cap: 0, v: 1, side: 1 });
  for (let i = 1; i < NC; i++) { const a = Math.PI / 2 - (i / NC) * Math.PI; R.push({ cap: 1, a, side: (Math.sin(a) + 1) / 2 }); }
  for (let i = 0; i < NF; i++) R.push({ u: 1 - i / (NF - 1), cap: 0, v: -1, side: 0 });
  for (let i = 1; i < NC; i++) { const a = -Math.PI / 2 - (i / NC) * Math.PI; R.push({ cap: -1, a, side: (Math.sin(a) + 1) / 2 }); }
  return R;
}

/** (Re)build the ribbon into `geo`. Returns contact samples for the floor shader (xyz + local radius). */
export function buildRibbon(geo, P, silver) {
  const curve = makeCurve(P);
  const NA = P.along || 320, NF = 28, NC = 8, ring = ringProfile(NF, NC), R = ring.length;
  const h = P.thick / 2, r = P.fillet;
  const pos = new Float32Array(NA * R * 3), col = new Float32Array(NA * R * 3), uv = new Float32Array(NA * R * 2);
  const muv = new Float32Array(NA * R * 2), mpat = new Float32Array(NA * R), LEN = curve.getLength(); // pattern space in metres + where it shows
  const red = new THREE.Color(P.red), sil = new THREE.Color(0.86, 0.86, 0.9);
  const contacts = [];
  let prevW = null;
  for (let i = 0; i < NA; i++) {
    const s = i / (NA - 1), F = frameAt(curve, P, s, prevW); prevW = F.w;
    const W = widthAt(P, s), x0 = -P.center * W, x1 = x0 + W, hh = Math.min(h, W / 2);
    for (let j = 0; j < R; j++) {
      const q = ring[j];
      let du, dv;
      if (q.cap === 0) { du = x0 + hh + q.u * (W - 2 * hh); dv = q.v * hh; }
      else { const cx = q.cap > 0 ? x1 - hh : x0 + hh; du = cx + Math.cos(q.a) * hh; dv = Math.sin(q.a) * hh; }
      const k = (i * R + j) * 3;
      { const f = (du - x0) / W; dv += P.bend * W * f * f; }      // cross curvature: the sheet curls as it hangs
      let x = F.p.x + F.w.x * du + F.b.x * dv, y = F.p.y + F.w.y * du + F.b.y * dv, z = F.p.z + F.w.z * du + F.b.z * dv;
      if (r > 0 && y < r) y = Math.max(0.012, r * Math.exp(y / r - 1));
      pos[k] = x; pos[k + 1] = y; pos[k + 2] = z;
      const uu = q.cap === 0 ? (du - x0) / W : q.cap > 0 ? 1 : 0;
      const up = F.b.y >= 0 ? q.side : 1 - q.side;                 // the sky-facing face of the sheet
      const m = up * silver * (1 - smooth(0.0, 0.09, uu));          // silver crest, red body // only the top side near the front edge turns silver
      col[k] = red.r + (sil.r - red.r) * m; col[k + 1] = red.g + (sil.g - red.g) * m; col[k + 2] = red.b + (sil.b - red.b) * m;
      muv[(i * R + j) * 2] = s * LEN; muv[(i * R + j) * 2 + 1] = du - x0;
      mpat[i * R + j] = smooth(0.12, 0.35, uu) * (1 - smooth(P.dotEnd - 0.1, P.dotEnd + 0.1, s)); // red faces of the wave, not the crest
      uv[(i * R + j) * 2] = s * 8; uv[(i * R + j) * 2 + 1] = q.cap === 0 ? (du - x0) / W : q.cap > 0 ? 1 : 0;
    }
    if (i % Math.ceil(NA / 21) === 0) for (const f of [0.08, 0.5, 0.92]) { // contact samples on the underside
      const du = x0 + f * W, dv = P.bend * W * f * f, y = F.p.y + F.w.y * du + F.b.y * dv;
      contacts.push(F.p.x + F.w.x * du + F.b.x * dv, r > 0 && y < r ? Math.max(0.012, r * Math.exp(y / r - 1)) : y, F.p.z + F.w.z * du + F.b.z * dv, Math.max(0.15, W * 0.18));
    }
  }
  const idx = new Uint32Array((NA - 1) * R * 6);
  let n = 0;
  for (let i = 0; i < NA - 1; i++) for (let j = 0; j < R; j++) {
    const a = i * R + j, b = i * R + (j + 1) % R, c = a + R, d = b + R;
    idx[n++] = a; idx[n++] = c; idx[n++] = b; idx[n++] = b; idx[n++] = c; idx[n++] = d;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setAttribute('muv', new THREE.BufferAttribute(muv, 2)); geo.setAttribute('mpat', new THREE.BufferAttribute(mpat, 1));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  while (contacts.length < 64 * 4) contacts.push(0, 99, 0, 0.01);
  return { curve, contacts: contacts.slice(0, 64 * 4), tris: idx.length / 3 };
}
