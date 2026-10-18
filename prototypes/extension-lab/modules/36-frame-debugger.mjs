/** Standalone extension prototype. No Vel state, registry or main-file imports. */
export async function mount(canvas) {
  const mod = await import("spectorjs");
  const Spector = mod.Spector || mod.default?.Spector;
  if (!Spector) throw new Error("Spector constructor unavailable");
  const inspector = new Spector();
  return {
    capture: () => inspector.captureCanvas(canvas),
    show: () => inspector.displayUI(),
    dispose() {
      inspector.stopCapture?.();
    },
  };
}
export const requirements =
  "Developer browser only. Capture commands, not a production performance measurement.";
