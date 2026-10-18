import * as THREE from "three";
import { enable, configure } from "./modules/37-webgl-lint.mjs";
await enable();
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
});
const helper = configure(renderer.getContext());
const scene = new THREE.Scene(),
  camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10);
camera.position.z = 3;
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x88aaff }),
);
scene.add(mesh);
renderer.render(scene, camera);
document.querySelector("#status").textContent =
  "A képkocka elkészült; a részletes diagnosztika a böngésző konzoljában látható.";
window.addEventListener("pagehide", () => {
  helper.disable();
  mesh.geometry.dispose();
  mesh.material.dispose();
  renderer.dispose();
});
