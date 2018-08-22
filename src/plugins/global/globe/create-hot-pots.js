import  { getDescartesPosition }  from './utils/index.js'
import { getWorldMapStepInfo } from '@utils/theme'

export default (data) => {
    const earthRadius = 200

    var group = new THREE.Object3D()

    var flyCircleGroup = new THREE.Object3D()
    var hotPotsGroup = new THREE.Object3D()

    data.forEach((p) => {
      // 获得热点在3维空间中的坐标
      const _position = getDescartesPosition(earthRadius, p['lat'], p['lng'])
      // 创建热点分组，便于统一设定热点的位置和旋转角

      var colors = getWorldMapStepInfo(p.count || 0).color
      // 创建热点
      var starPot = createStarPot(colors)
      starPot.position.set(_position.x, _position.y, _position.z)    
      hotPotsGroup.add(starPot)
      // 创建圆环
      var flyCircles = createFlyCircle(colors, _position)
      flyCircleGroup.add(flyCircles)
    })
    group.add(hotPotsGroup)
    group.add(flyCircleGroup)

    registerAnimateThread(flyCircleGroup)
    return group
}
/**
* 创建热点
*/

function createStarPot (c) {
  var sphereGeometry = new THREE.SphereGeometry(2, 4, 4)
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: c
  })
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  return sphere
}

function createFlyCircle (colors, position) {
  var group = new THREE.Object3D()
  var curve = new THREE.EllipseCurve(
    0,0,
    5, 5,
    0, 2 * Math.PI,
    false,
    0)
  var path = new THREE.Path(curve.getPoints(50))
  var geometry = path.createPointsGeometry(50)
  var material = new THREE.LineBasicMaterial({
    color: colors
  })
  for (var i = 1; i <= 4; i++) {
    var ellipse = new THREE.Line(geometry, material)
    group.add(ellipse)
  }
  group.position.set(position.x, position.y, position.z)
  group.lookAt({x: 0, y: 0, z: 0})
  return group
}

function registerAnimateThread (group) {
  // 热点个数为零
  if (!group.children.length) {
    return
  }
  var circleLen = group.children[0].children.length

  for (var i = 0; i <= 3; i++) {
    setTimeDelayAni(i)
  }

  function setTimeDelayAni (i) {
    setTimeout(() => {
      var cirlceLevle = group.children.map(item => {
        return item.children[i]
      })
      goAnimate(cirlceLevle)
    }, 1000 * i)
  }

  function goAnimate (cirlceLevle) {
    function update () {
      cirlceLevle.forEach((circle) => {
         if (circle.position.z < -20) {
          circle.scale.x = 0
          circle.scale.y = 0
          circle.position.z = 0
        }
        circle.scale.x += 0.02
        circle.scale.y += 0.02
        circle.position.z -= 0.25
      })      
    }
    animate()
    function animate () {
      update()
      requestAnimationFrame(animate)
    }
  }
}
