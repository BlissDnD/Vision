/** Standalone extension prototype. No Vel state, registry or main-file imports. */
import { MeshStandardMaterial, Mesh, SphereGeometry } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
export function create() {
  const material = new CustomShaderMaterial({
    baseMaterial: MeshStandardMaterial,
    color: 0x88bbff,
    roughness: 0.3,
    uniforms: { uTime: { value: 0 } },
    vertexShader:
      "uniform float uTime; void main(){ csm_Position = position + normal * sin(position.y*6.0+uTime)*0.08; }",
  });
  const mesh = new Mesh(new SphereGeometry(1, 48, 32), material);
  mesh.userData.seek = (t) => {
    material.uniforms.uTime.value = t;
  };
  return mesh;
}
