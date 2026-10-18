/** Original standalone 2D stable-fluid prototype. No third-party solver code copied. */
import {
  WebGLRenderTarget,
  HalfFloatType,
  LinearFilter,
  NearestFilter,
  ShaderMaterial,
  Mesh,
  PlaneGeometry,
  Scene,
  OrthographicCamera,
  Vector2,
  Vector3,
  Color,
} from "three";
import { bounded } from "../core.mjs";
const vertexShader =
  "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}";
const prefix =
  "precision highp float; varying vec2 vUv; uniform sampler2D field; uniform sampler2D velocity; uniform sampler2D auxiliary; uniform vec2 texel; uniform float dt;";
export const shaders = {
  advect:
    prefix +
    "void main(){vec2 back=clamp(vUv-dt*texture2D(velocity,vUv).xy,texel,1.-texel);gl_FragColor=texture2D(field,back)*.997;}",
  splat:
    prefix +
    "uniform vec2 point; uniform vec3 impulse; uniform float radius; void main(){vec2 d=vUv-point;float w=exp(-dot(d,d)/radius);gl_FragColor=texture2D(field,vUv)+vec4(impulse*w,0.);}",
  divergence:
    prefix +
    "void main(){float l=texture2D(field,vUv-vec2(texel.x,0.)).x,r=texture2D(field,vUv+vec2(texel.x,0.)).x,b=texture2D(field,vUv-vec2(0.,texel.y)).y,t=texture2D(field,vUv+vec2(0.,texel.y)).y;gl_FragColor=vec4(.5*(r-l+t-b),0.,0.,1.);}",
  pressure:
    prefix +
    "void main(){float l=texture2D(field,vUv-vec2(texel.x,0.)).x,r=texture2D(field,vUv+vec2(texel.x,0.)).x,b=texture2D(field,vUv-vec2(0.,texel.y)).x,t=texture2D(field,vUv+vec2(0.,texel.y)).x;float d=texture2D(auxiliary,vUv).x;gl_FragColor=vec4((l+r+b+t-d)*.25,0.,0.,1.);}",
  project:
    prefix +
    "void main(){float l=texture2D(auxiliary,vUv-vec2(texel.x,0.)).x,r=texture2D(auxiliary,vUv+vec2(texel.x,0.)).x,b=texture2D(auxiliary,vUv-vec2(0.,texel.y)).x,t=texture2D(auxiliary,vUv+vec2(0.,texel.y)).x;vec2 v=texture2D(field,vUv).xy-.5*vec2(r-l,t-b);gl_FragColor=vec4(v,0.,1.);}",
};
export function create(
  renderer,
  {
    size = 128,
    hz = 60,
    iterations = 12,
    events = [
      { t: 0, point: [0.4, 0.5], force: [0.3, 0.15], color: [0.3, 0.6, 1] },
    ],
  } = {},
) {
  bounded(size, 16, 256, "size");
  bounded(hz, 10, 120, "hz");
  bounded(iterations, 2, 40, "iterations");
  if (!renderer.extensions.has("EXT_color_buffer_float"))
    throw new Error("Floating-point color targets required");
  const ordered = events
    .map((e) => {
      bounded(e.t, 0, 60, "event time");
      if (
        e.point?.length !== 2 ||
        e.force?.length !== 2 ||
        e.color?.length !== 3 ||
        ![...e.point, ...e.force, ...e.color].every(Number.isFinite)
      )
        throw new Error("Invalid splat event");
      return structuredClone(e);
    })
    .sort((a, b) => a.t - b.t);
  const target = () =>
    new WebGLRenderTarget(size, size, {
      type: HalfFloatType,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
  const pair = () => ({
    read: target(),
    write: target(),
    swap() {
      [this.read, this.write] = [this.write, this.read];
    },
  });
  const flow = pair(),
    dye = pair(),
    pressure = pair(),
    divergence = target(),
    all = [
      flow.read,
      flow.write,
      dye.read,
      dye.write,
      pressure.read,
      pressure.write,
      divergence,
    ];
  const materials = Object.fromEntries(
    Object.entries(shaders).map(([name, fragmentShader]) => [
      name,
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          field: { value: null },
          velocity: { value: null },
          auxiliary: { value: null },
          texel: { value: new Vector2(1 / size, 1 / size) },
          dt: { value: 1 / hz },
          point: { value: new Vector2() },
          impulse: { value: new Vector3() },
          radius: { value: 0.002 },
        },
      }),
    ]),
  );
  const scene = new Scene(),
    geometry = new PlaneGeometry(2, 2),
    quad = new Mesh(geometry, materials.advect),
    camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(quad);
  let tick = 0,
    eventIndex = 0,
    disposed = false;
  function preserve(fn) {
    const previous = renderer.getRenderTarget(),
      color = renderer.getClearColor(new Color()),
      alpha = renderer.getClearAlpha();
    try {
      return fn();
    } finally {
      renderer.setRenderTarget(previous);
      renderer.setClearColor(color, alpha);
    }
  }
  function reset() {
    renderer.setClearColor(0, 0);
    for (const t of all) {
      renderer.setRenderTarget(t);
      renderer.clear();
    }
    tick = 0;
    eventIndex = 0;
  }
  function pass(
    name,
    input,
    output,
    {
      velocity = flow.read.texture,
      auxiliary = null,
      event = null,
      impulse = null,
    } = {},
  ) {
    const m = materials[name];
    m.uniforms.field.value = input;
    m.uniforms.velocity.value = velocity;
    m.uniforms.auxiliary.value = auxiliary;
    if (event) {
      m.uniforms.point.value.fromArray(event.point);
      m.uniforms.impulse.value.fromArray(impulse);
    }
    quad.material = m;
    renderer.setRenderTarget(output);
    renderer.render(scene, camera);
  }
  function step() {
    while (
      eventIndex < ordered.length &&
      ordered[eventIndex].t <= tick / hz + 1e-8
    ) {
      const e = ordered[eventIndex++];
      pass("splat", flow.read.texture, flow.write, {
        event: e,
        impulse: [...e.force, 0],
      });
      flow.swap();
      pass("splat", dye.read.texture, dye.write, {
        event: e,
        impulse: e.color,
      });
      dye.swap();
    }
    pass("advect", flow.read.texture, flow.write);
    flow.swap();
    pass("divergence", flow.read.texture, divergence);
    for (let i = 0; i < iterations; i++) {
      pass("pressure", pressure.read.texture, pressure.write, {
        auxiliary: divergence.texture,
      });
      pressure.swap();
    }
    pass("project", flow.read.texture, flow.write, {
      auxiliary: pressure.read.texture,
    });
    flow.swap();
    pass("advect", dye.read.texture, dye.write);
    dye.swap();
    tick++;
  }
  preserve(reset);
  return {
    seek(seconds) {
      if (disposed) throw new Error("Fluid disposed");
      bounded(seconds, 0, 60, "time");
      preserve(() => {
        const targetTick = Math.floor(seconds * hz + 1e-7);
        if (targetTick < tick) reset();
        while (tick < targetTick) step();
      });
      return dye.read.texture;
    },
    get texture() {
      return dye.read.texture;
    },
    get velocity() {
      return flow.read.texture;
    },
    toRecord: () => ({
      v: 1,
      kind: "fluid",
      size,
      hz,
      iterations,
      events: structuredClone(ordered),
    }),
    dispose() {
      if (disposed) return;
      disposed = true;
      all.forEach((t) => t.dispose());
      Object.values(materials).forEach((m) => m.dispose());
      geometry.dispose();
    },
  };
}
export const requirements =
  "Experimental 2D dye/velocity solver, not 3D liquid; GPU compilation and visual validation pending";
