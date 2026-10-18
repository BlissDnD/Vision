/** Small standalone Three.js host; no shared context or state with Vel. */
import * as T from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { disposeObject } from "../core.mjs";
import { button, filePicker, show } from "./browser-input.mjs";
export function createHost(canvas, panel, { setTime = () => {} } = {}) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(720, 480, false);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0x111925);
  const scene = new T.Scene(),
    camera = new T.PerspectiveCamera(45, 1.5, 0.01, 100);
  camera.position.set(0, 1, 5);
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight(0xcceeff, 0x333344, 2));
  const key = new T.DirectionalLight(0xffffff, 3);
  key.position.set(3, 4, 4);
  scene.add(key);
  const reference = new T.Mesh(
    new T.SphereGeometry(0.7, 24, 16),
    new T.MeshStandardMaterial({ color: 0x77aaff, roughness: 0.3 }),
  );
  scene.add(reference);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const image = new Uint8Array(64 * 32 * 4);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 64; x++) {
      const i = (y * 64 + x) * 4;
      image.set([80 + y * 4, 110 + y * 3, 160, 255], i);
    }
  const environment = new T.DataTexture(image, 64, 32, T.RGBAFormat);
  environment.mapping = T.EquirectangularReflectionMapping;
  environment.colorSpace = T.SRGBColorSpace;
  environment.needsUpdate = true;
  let asset = null,
    imported = null,
    backgroundTarget = null,
    exporting = false,
    disposed = false;
  const host = {
    canvas,
    panel,
    scene,
    camera,
    renderer,
    reference,
    composer,
    environment,
    setTime,
    button: (label, fn) => button(panel, label, fn),
    filePicker: (options) => filePicker(panel, options),
    show: (data) => show(panel, data),
    disposeObject,
    mesh: (geometry) =>
      new T.Mesh(geometry, new T.MeshStandardMaterial({ color: 0x88ffaa })),
    sphereGeometry: () => new T.SphereGeometry(1, 32, 24),
    ball: () =>
      new T.Mesh(
        new T.SphereGeometry(0.25, 16, 12),
        new T.MeshStandardMaterial({ color: 0xffbb88 }),
      ),
    pointCloud(positions) {
      const geo = new T.BufferGeometry();
      geo.setAttribute(
        "position",
        new T.Float32BufferAttribute(positions.flat(), 3),
      );
      return new T.Points(
        geo,
        new T.PointsMaterial({ color: 0xaaffcc, size: 0.04 }),
      );
    },
    texturePlane(texture) {
      return new T.Mesh(
        new T.PlaneGeometry(3, 3),
        new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide }),
      );
    },
    shaderPlane(noise) {
      return new T.Mesh(
        new T.PlaneGeometry(3, 3),
        new T.ShaderMaterial({
          vertexShader:
            "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
          fragmentShader: `precision highp float;varying vec2 vUv;${noise}\nvoid main(){float n=labFbm(vUv*7.);gl_FragColor=vec4(vec3(n*.4,n*.7,n),1.);}`,
        }),
      );
    },
    async exampleGLB() {
      const mesh = host.mesh(new T.BoxGeometry(1, 1, 1));
      try {
        const buffer = await new GLTFExporter().parseAsync(mesh, {
          binary: true,
        });
        return new Uint8Array(buffer);
      } finally {
        disposeObject(mesh);
      }
    },
    replaceAsset(next) {
      if (disposed) {
        next.dispose();
        return;
      }
      asset?.dispose();
      asset = next;
    },
    replaceObject(next) {
      if (disposed) {
        disposeObject(next);
        return;
      }
      if (imported) disposeObject(imported);
      imported = next;
      reference.visible = false;
      scene.add(next);
    },
    glassBuffer() {
      backgroundTarget = new T.WebGLRenderTarget(720, 480, {
        type: T.HalfFloatType,
      });
      host.backgroundTarget = backgroundTarget;
      reference.position.set(0.4, 0, -1);
      return backgroundTarget;
    },
    renderGlass(glass) {
      const previous = renderer.getRenderTarget(),
        visible = glass.visible;
      try {
        glass.visible = false;
        renderer.setRenderTarget(backgroundTarget);
        renderer.render(scene, camera);
      } finally {
        glass.visible = visible;
        renderer.setRenderTarget(previous);
      }
      renderer.render(scene, camera);
    },
    setExporting(value) {
      exporting = value;
    },
    get exporting() {
      return exporting;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      asset?.dispose();
      if (imported) disposeObject(imported);
      disposeObject(reference);
      backgroundTarget?.dispose();
      environment.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  return host;
}
