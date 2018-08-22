import grid from './utils/grid.js'

const SINGLEANGLE = Math.PI / 180

export default function createParticleAtmosPhere () {
  var group = new THREE.Object3D()

  // 大气层上面粒子几何体、材质基本定义
  var sphereGeometry = new THREE.SphereGeometry(0.7, 5, 5)
  var sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    transparent: true,
    opacity: 0.75
  })
  var pointsGroup = new THREE.Object3D()
  group.add(pointsGroup)

  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

  // 按照经纬度，添加
  grid.forEach((point, i) => {
    var position = getDescartesPosition(240, point.lat, point.lon)
    var _sphere = sphere.clone()
    // 设置粒子在空间中的位置
    _sphere.position.set(position.x, position.y, position.z)
    pointsGroup.add(_sphere)
  })
  
  // 光几何体
  // var LightSphere = new THREE.SphereGeometry( 2, 16, 16 );

  var lightLeft = new THREE.PointLight( 0x4a02d0, 30, 150);
  lightLeft.position.x = -260
  lightLeft.position.y = -100
  lightLeft.position.z = 200
  group.add(lightLeft);

  // 右侧光
  var lightRight = new THREE.PointLight( 0x9d00ff, 3, 250);
  lightRight.position.x = 200
  lightRight.position.y = -150
  lightRight.position.z = 200
  group.add(lightRight);

  // 顶部光
  var lightTop = new THREE.PointLight( 0x9d00ff, 5, 200);
  lightTop.position.x = 0
  lightTop.position.y = 260
  lightTop.position.z = 200
  group.add(lightTop);

  // 添加环境光
  var hemiLight = new THREE.HemisphereLight(0x2257ee, 0x2257ee, 1 );
  group.add( hemiLight );
  
  animate()

  function animate () {
    var direction = new THREE.Vector3( 1, 2, 0 );
    var speed = 6;
    var vector = direction.multiplyScalar( speed, speed, speed );

    lightLeft.position.x += vector.x;
    lightLeft.position.y += vector.y;
    if(lightLeft.position.x > 260) {
      lightLeft.position.x = -260;
      lightLeft.position.y = -100
    }
    requestAnimationFrame(animate);
  }
  return group
}

function getDescartesPosition (r, lat, log) {
  var phi = (90 + lat) * Math.PI / 180;
  var theta = (180 - log) * Math.PI / 180;

  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta)
  }
}