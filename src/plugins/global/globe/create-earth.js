/**
* 创建地球
*/
import staticPath from '@utils/static-path'

export default () => {
  // 显卡识别的脚本
  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: 0, texture: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 10.5 );',
          'gl_FragColor = vec4( diffuse + atmosphere,  0.9 );',
        '}'
      ].join('\n')
    }
  }
  var geometry = new THREE.SphereGeometry(200, 40, 30)

  var shader = Shaders['earth']
  var uniforms = THREE.UniformsUtils.clone(shader.uniforms)

  var loader = new THREE.TextureLoader()
  uniforms['texture'].value = loader.load(staticPath.worldShader)

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true
  })

  var earthMesh = new THREE.Mesh(geometry, material)
  earthMesh.rotation.y = Math.PI

  return earthMesh
}

