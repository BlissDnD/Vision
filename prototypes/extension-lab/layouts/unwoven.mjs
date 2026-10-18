/** Faithful Unwoven renderer with explicit scene time and owned GPU resources. */
import * as THREE from "three";
import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  buildRibbonGeometry,
} from "./vendor/unwoven-original.mjs";
import { normalize, frame, wrap } from "./state.mjs";
export const sampleImages = Array.from(
  { length: 6 },
  (_, i) =>
    new URL(`./assets/motion_blur_portrait_0${i + 1}.jpg`, import.meta.url)
      .href,
);
export async function createUnwoven(host, options = {}, images = sampleImages) {
  let o = normalize(options),
    time = 0,
    disposed = false,
    geometry,
    cards = [],
    slots = [],
    width = 1,
    height = 1,
    pitch = 1,
    span = 1;
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  host.append(renderer.domElement);
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  const shared = {
    uTime: { value: 0 },
    uHalfWidth: { value: 1 },
    uZone: { value: 1 },
    uStrength: { value: 0 },
    uWobble: { value: 1 },
    uCardSize: { value: new THREE.Vector2() },
    uRadius: { value: 20 },
  };
  async function load(urls) {
    const loaded = [];
    try {
      for (const url of urls.slice(0, 24)) {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        await image.decode();
        const texture = new THREE.Texture(image);
        texture.minFilter = texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          uniforms: {
            ...shared,
            uMap: { value: texture },
            uSeed: { value: (loaded.length + 1) * 0.731 + o.seed },
            uImageAspect: { value: image.naturalWidth / image.naturalHeight },
          },
        });
        loaded.push({ texture, material });
      }
      if (!loaded.length) throw Error("Legalább egy kép szükséges");
      return loaded;
    } catch (e) {
      loaded.forEach((s) => {
        s.texture.dispose();
        s.material.dispose();
      });
      throw e;
    }
  }
  try {
    slots = await load(images);
  } catch (e) {
    renderer.dispose();
    renderer.domElement.remove();
    throw e;
  }
  function rebuild() {
    cards.forEach((m) => scene.remove(m));
    geometry?.dispose();
    const ch = Math.min(o.height, height * 0.62),
      cw = ch * o.aspect;
    pitch = cw + Math.max(24, cw * o.gap);
    const count = Math.max(8, Math.ceil((width + pitch * 3) / pitch));
    span = count * pitch;
    geometry = buildRibbonGeometry(cw, ch, o.threads, o.segments);
    cards = Array.from({ length: count }, (_, i) => {
      const m = new THREE.Mesh(geometry, slots[i % slots.length].material);
      m.frustumCulled = false;
      scene.add(m);
      return m;
    });
    shared.uCardSize.value.set(cw, ch);
    shared.uHalfWidth.value = width / 2;
    shared.uZone.value = Math.min(width * o.zone, o.zoneMax);
    shared.uRadius.value = Math.min(o.radius, ch / 2, cw / 2);
    shared.uWobble.value = o.wobble;
    slots.forEach(
      (s, i) => (s.material.uniforms.uSeed.value = (i + 1) * 0.731 + o.seed),
    );
  }
  function seek(t) {
    if (disposed) return;
    time = Math.max(0, Number.isFinite(t) ? t : 0);
    const f = frame(time, o);
    shared.uTime.value = time;
    shared.uStrength.value = f.strength;
    cards.forEach(
      (m, i) => (m.position.x = wrap(i * pitch - f.offset, span) - span / 2),
    );
    renderer.setClearColor(o.background, 1);
    renderer.render(scene, camera);
  }
  function resize() {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    rebuild();
    seek(time);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    seek,
    resize,
    setOptions(input) {
      o = normalize({ ...o, ...input });
      rebuild();
      seek(time);
    },
    serialize: () => ({ ...o }),
    async setImages(urls) {
      const next = await load(urls);
      if (disposed) {
        next.forEach((s) => {
          s.texture.dispose();
          s.material.dispose();
        });
        return;
      }
      slots.forEach((s) => {
        s.texture.dispose();
        s.material.dispose();
      });
      slots = next;
      rebuild();
      seek(time);
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      geometry?.dispose();
      slots.forEach((s) => {
        s.texture.dispose();
        s.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
