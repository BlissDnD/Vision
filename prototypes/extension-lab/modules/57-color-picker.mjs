/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import Coloris from "@melloware/coloris";
export function mount(
  container,
  { value = "#88aaff", onInput = () => {}, onCommit = () => {} } = {},
) {
  const input = document.createElement("input");
  input.value = value;
  input.setAttribute("data-coloris", "");
  container.append(input);
  Coloris.init();
  Coloris({
    el: "[data-coloris]",
    themeMode: "dark",
    format: "hex",
    alpha: true,
  });
  const live = () => onInput(input.value),
    commit = () => onCommit(input.value);
  input.addEventListener("input", live);
  input.addEventListener("change", commit);
  return {
    input,
    dispose() {
      input.removeEventListener("input", live);
      input.removeEventListener("change", commit);
      input.remove();
    },
  };
}
export const requirements =
  "Include @melloware/coloris/dist/coloris.css. Global singleton picker; host owns shared popup lifetime.";
