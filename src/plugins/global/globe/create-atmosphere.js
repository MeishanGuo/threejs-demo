
const getAtmosphereImageData = './Images/atmosphere-bg-v2.png'

export default function createAtmosphere (container) {
  var lightLeft, lightRight;

  var group = new THREE.Object3D()

  // 创建球体
  var sphereGeometry = new THREE.SphereGeometry(240, 30, 30)
  // 创建图片加载器
  var load = new THREE.TextureLoader()
  load.crossOrigin = '' // 允许跨域
  var sphereMaterial = new THREE.MeshPhongMaterial({
    transparent: true,
    opacity: 0.4,
    map: load.load(getAtmosphereImageData)
  })
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.rotation.y = Math.PI / 1.4
  group.add(sphere)
  // 创建光源

  // 左侧光
  var sphere = new THREE.SphereGeometry( 5, 16, 8 );
  lightLeft = new THREE.PointLight( 0x9d00ff, 2, 300, 2);
  // lightLeft.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x9d00ff})));
  lightLeft.position.x = -220
  lightLeft.position.y = 0
  lightLeft.position.z = 200
  group.add(lightLeft);

  // 顶部侧光
  var sphere = new THREE.SphereGeometry( 5, 16, 8 );
  var top = new THREE.PointLight( 0x9d00ff, 2, 300, 2);
  // top.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: 0x9d00ff})));
  top.position.x = 0
  top.position.y = 270
  top.position.z = 200
  group.add(top);

  // 环境光
  var hemiLight = new THREE.HemisphereLight(0x1f9ded, 0x1f9ded, 1 );
  group.add( hemiLight );

  animate()
 
  function animate() {
    requestAnimationFrame(animate);
    leftLightFly();
  }
  function leftLightFly () {
    var direction = new THREE.Vector3( 1, 1.5, 0 );
    var speed = 6;
    var vector = direction.multiplyScalar( speed, speed, speed );

    lightLeft.position.x += vector.x;
    lightLeft.position.y += vector.y;
    if(lightLeft.position.x > 1000) {
      lightLeft.position.x = -280;
      lightLeft.position.y = 0
    }
  }

 return group
}
