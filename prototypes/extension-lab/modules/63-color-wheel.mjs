/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import iro from "@jaames/iro";
export function mount(
  container,
  { color = "#ffaa77", onChange = () => {} } = {},
) {
  const child = document.createElement("div");
  container.append(child);
  const picker = new iro.ColorPicker(child, { width: 180, color });
  const changed = (c) => onChange(c.hexString);
  picker.on("color:change", changed);
  return {
    picker,
    dispose() {
      picker.off("color:change", changed);
      child.remove();
    },
  };
}
export const requirements =
  "Alternative to Coloris; MPL-2.0 source availability requirements apply when distributing";
