import grid from './utils/grid.js'

const SINGLEANGLE = Math.PI / 180

export default function createPatticleGlobeOuter () { var group = new THREE.Object3D()

  // 大气层上面粒子几何体、材质基本定义
  var sphereGeometry = new THREE.SphereGeometry(1, 30, 30)
  var sphereMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    color: 0xffffff,
    bumpScale: 0.002,
    metalness: 0.2
  })
  var pointsGroup = new THREE.Object3D()
  group.add(pointsGroup)
  // 按照经纬度，添加
  var points = []
  grid.forEach((point, i) => {
    var position = getDescartesPosition(210, point.lat, point.lon)
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.set(position.x, position.y, position.z)
    points[i] = sphere
    pointsGroup.add(sphere)
  })

  pointsGroup.rotation.x = SINGLEANGLE * 30
  pointsGroup.rotation.y = -SINGLEANGLE * 70
  pointsGroup.rotation.z = 0

  // 添加环境光
  var hemiLight = new THREE.HemisphereLight(0xff0000, 0xff0000, 1 );
  group.add( hemiLight );

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