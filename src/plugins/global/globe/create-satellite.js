/**
* 创建卫星
*/

import getSatelliteImageData from './utils/get-satellite-image-data.js'
const AngleUnit = Math.PI / 180

export default function createSatellite() {
  let group = new THREE.Object3D()
  /*************************/
  // 创建卫星
  var satellite = _createSatellite()
  group.add(satellite);
  // 创建轨道
  var track = createTrack()
  group.add(track.mesh)

  updateposition(satellite, track.referanceCurve)

  //
  var curve = new THREE.EllipseCurve(
    0,  0,
    290, 280,
    0,  2 * Math.PI,
    false,
    0
  );
  var path = new THREE.Path(curve.getPoints(100));
  var geometrycirc = path.createPointsGeometry(100);
  var materialcirc = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0x5756c8,
    side: THREE.FrontSide
  });
  var track = new THREE.Line( geometrycirc, materialcirc );
  track.position.set(-45, 30, -10);
  track.rotation.set( 5 * AngleUnit, -35 * AngleUnit, 0)
  group.add(track)

  ///
  // 形成卫星偏转角  
  group.position.set(15, 30, -10);
  group.rotation.set( -45 * AngleUnit, 15 * AngleUnit, 0)
  return group
}

function createTrack () {
  var curve = new THREE.EllipseCurve(
    0,  0,
    290, 280,
    0,  2 * Math.PI,
    false,
    0
  );
  var path = new THREE.Path(curve.getPoints(100));
  var geometrycirc = path.createPointsGeometry(100);
  var materialcirc = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0x5756c8,
    side: THREE.FrontSide
  });
  var track = new THREE.Line( geometrycirc, materialcirc );
  return {
    mesh: track,
    referanceCurve: path
  }
}

function _createSatellite () {
  var load = new THREE.TextureLoader()
  load.crossOrigin = '' // 允许跨域
  var planeGeometry = new THREE.PlaneGeometry(30, 20, 1, 1)
  var planeMaterial = new THREE.MeshBasicMaterial({
      opacity: 1,
      transparent: true,
      map: load.load(getSatelliteImageData()),
      side: THREE.DoubleSide
    })
  var plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.scale.set(0.8,0.8,0.8)
  plane.rotation.set( 45 * AngleUnit, -15 * AngleUnit, 0)

  return plane
}
 
function updateposition (mesh, line) {
  var start = 0
  var step = 0.0005
  setInterval(() => {
    start += step
    if (start > 1) {
      start -= 1
    }
    var point = line.getPointAt(start)
    mesh.position.set(point.x, point.y, 1)
  }, 15) 
}

