/** Browser-only file inputs. Caller owns the lifetime of the containing element. */
export function filePicker(
  container,
  { accept = "", multiple = false, onFiles },
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = multiple;
  input.addEventListener("change", () =>
    Promise.resolve(onFiles(Array.from(input.files || []))).catch((error) => {
      const pre = document.createElement("pre");
      pre.textContent = error.message;
      container.append(pre);
    }),
  );
  container.append(input);
  return input;
}
export function button(container, label, fn) {
  const b = document.createElement("button");
  b.textContent = label;
  b.addEventListener("click", () =>
    Promise.resolve(fn()).catch((e) => {
      const pre = document.createElement("pre");
      pre.textContent = e.message;
      container.append(pre);
    }),
  );
  container.append(b);
  return b;
}
export function show(container, data) {
  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(data, null, 2);
  container.append(pre);
  return pre;
}
