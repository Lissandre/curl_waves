import { DoubleSide, Mesh, MeshLambertMaterial, Object3D, PlaneBufferGeometry } from 'three'
import vertex from '@shaders/vertex.vert'
import curl from '@shaders/Noise/curl.vert'
// import fragment from '@shaders/fragment.glsl'

export default class Plane {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'Plane'

    this.createPlane()
    this.setMovement()
  }
  createPlane() {
    const geometry = new PlaneBufferGeometry(800, 600, 100, 100)
    const material = new MeshLambertMaterial({
      side: DoubleSide,
      transparent: true,
      // wireframe: true,
      opacity: 0.7,
      shadowSide: DoubleSide,
      color: 0x00000
    })
    this.plane = new Mesh(geometry, material)
    this.plane.receiveShadow = true
    this.plane.castShadow = true

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.vertexShader = curl + '\nuniform float uTime;\nvarying vec3 vPos;\n' + shader.vertexShader
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        '#include <project_vertex>\n' + vertex
      )

      shader.fragmentShader = `
        varying vec3 vPos;
        ${shader.fragmentShader}
      `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
          vec3 col = diffuse * smoothstep(4., 11., vPos.z);
          col += vec3(smoothstep(10., 80., vPos.z)) * 8.;
          vec4 diffuseColor = vec4( col, opacity );
        `
      )

      this.time.on('tick', () => {
        shader.uniforms.uTime.value = this.time.clock.getElapsedTime()
      })
    }

    this.plane.rotateX(-Math.PI / 2)
    this.container.add(this.plane)
  }
  setMovement() {
    // this.time.on('tick', () => {
    //   this.plane.material.uniforms.uTime.value = this.time.clock.getElapsedTime()
    // })
  }
}
