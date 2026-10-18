/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import Split from "split.js";
export function mount(
  elements,
  { sizes = [25, 50, 25], onChange = () => {}, direction = "horizontal" } = {},
) {
  if (elements.length !== sizes.length)
    throw new Error("One size per panel required");
  const split = Split(elements, {
    sizes,
    minSize: 120,
    gutterSize: 8,
    direction,
    onDragEnd: onChange,
  });
  return {
    sizes: () => split.getSizes(),
    reset: () => split.setSizes(sizes),
    dispose: () => split.destroy(),
  };
}
