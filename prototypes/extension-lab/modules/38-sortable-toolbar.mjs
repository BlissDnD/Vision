/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import Sortable from "sortablejs";
export function mount(element, { onChange = () => {} } = {}) {
  const sortable = Sortable.create(element, {
    animation: 100,
    dataIdAttr: "data-id",
    onEnd: () => onChange(sortable.toArray()),
  });
  return {
    order: () => sortable.toArray(),
    restore: (ids) => sortable.sort(ids),
    dispose: () => sortable.destroy(),
  };
}
export const requirements =
  "Children need stable data-id; host must implement keyboard reordering and one undo transaction";
