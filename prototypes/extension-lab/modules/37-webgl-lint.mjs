/** Standalone extension prototype. No Vel state, registry or main-file imports. */
let loading;
export async function enable() {
  if (typeof window === "undefined") throw new Error("Browser required");
  loading ??= import("webgl-lint");
  await loading;
}
export function configure(gl, enabled = true) {
  const helper = gl.getExtension("GMAN_debug_helper");
  if (!helper) throw new Error("Enable lint before creating the WebGL context");
  if (!enabled) helper.disable();
  else helper.setConfiguration({ failUnsetUniforms: true, maxDrawCalls: 0 });
  return helper;
}
export const requirements =
  "Developer build only; enable before renderer/context creation, reload page to fully remove instrumentation";
