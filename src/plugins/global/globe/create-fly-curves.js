import { getWorldMapStepInfo } from '@utils/theme'
import { getDescartesPosition } from './utils/index.js'
 
const earchRadius = 200
const refereLineLength = 150
const flyCurveConfig = {
  duration: 1000 * 10,
  loop: 1000 * 20
}
export default function createFlyCurve (data) {
  var curvesGroup = new THREE.Object3D()
  data.forEach((p) => {
    var realLine = {} // 真实的线
    var refereLine = {} // 参照线
    var drawCount = 2
    if (p['lat'] === 40 && p['lng'] === 116) {
      // 排除掉北京自己画点
    } else {
      // 关键点
      const finalPosition =  getDescartesPosition(earchRadius, 40, 116)
      const startPosition= getDescartesPosition(earchRadius, p['lat'], p['lng'])
      // // 起点向量和终点向量的夹角
      var startVector = new THREE.Vector3(startPosition.x, startPosition.y, startPosition.z) // 原点到起点向量
      var finalVector = new THREE.Vector3(finalPosition.x, finalPosition.y, finalPosition.z) // 原点到终点向量
      var stepInfo = getWorldMapStepInfo(p['count'])
      var refereLine = _curveGenerater(startVector, finalVector, stepInfo.color)
      curvesGroup.add(refereLine.line)

      //
      var geometry = new THREE.BufferGeometry();
      var positions = new Float32Array( refereLineLength * 3 ); // 3 vertices per point
      geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
      var drawCount = 20;
      geometry.setDrawRange( 0, drawCount);
      var material = new THREE.LineBasicMaterial({
        color: stepInfo.color
      });
      
      realLine = new THREE.Line(geometry, material);
      curvesGroup.add(realLine);

      _updatePositions(refereLine.spline);
      _curveFly()

      // update positions
      function _updatePositions() {
        var positions = realLine.geometry.attributes.position.array;
        var index = 0;
        for ( var i = 0, l = refereLineLength; i < l; i ++ ) {
          positions[ index ++ ] = refereLine.spline.getPointAt(i / refereLineLength).x;
          positions[ index ++ ] = refereLine.spline.getPointAt(i / refereLineLength).y;
          positions[ index ++ ] = refereLine.spline.getPointAt(i / refereLineLength).z;
        }
      }

      function _curveFly() {
        drawCount = ( drawCount + 1 ) % refereLineLength;
        realLine.geometry.setDrawRange( 0, drawCount );
        requestAnimationFrame(_curveFly);
      }
    }
  })
  return curvesGroup
}

function _curveGenerater(startPoint, endPoint, color) {
  // var vec3_origin = new THREE.Vector3(0, 0, 0);
  // 起始点之间的距离
  var distanceFromStartToEnd = startPoint.distanceTo(endPoint);
  // 中点距离起点、始点的距离
  var distanceHalf = distanceFromStartToEnd * 0.5;
  //  midpoint for the curve
  var mid = startPoint.clone().lerp(endPoint, 0.5);
  var midLength = mid.length()
  mid.normalize();
  // 曲线凸起高度为220
  mid.multiplyScalar(220);
  //  the normal from start to end
  var normal = (new THREE.Vector3()).subVectors(startPoint, endPoint);
  normal.normalize();

  var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceHalf * 0.8));
  var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceHalf * 0.8));

  //  now make a bezier curve out of the above like so in the diagram
  var splineCurveA = new THREE.CubicBezierCurve3(startPoint, startPoint, midStartAnchor, mid);
  // splineCurveA.updateArcLengths();

  var splineCurveB = new THREE.CubicBezierCurve3(mid, midEndAnchor, endPoint, endPoint);
  // splineCurveB.updateArcLengths();

  //  how many vertices do we want on this guy? this is for *each* side
  var vertexCountDesired = Math.floor(distanceFromStartToEnd * 0.02 + 6) * 2;

  //  collect the vertices
  var points = splineCurveA.getPoints(vertexCountDesired);

  //  remove the very last point since it will be duplicated on the next half of the curve
  points = points.splice(0, points.length - 1);

  points = points.concat(splineCurveB.getPoints(vertexCountDesired));
  //  add one final point to the center of the earth
  //  we need this for drawing multiple arcs, but piled into one geometry buffer
  // points.push(vec3_origin);

  // add addd
  var material = new THREE.LineBasicMaterial({
    color: color || '#0000ff',
    transparent: true,
    opacity: 0.3
  });
  var geometry = new THREE.Geometry();
  points.forEach(p => {
    geometry.vertices.push(p);
  })
  var spline = new THREE.CatmullRomCurve3(points);
  var line = new THREE.Line(geometry, material);
  return {
    line: line,
    spline: spline 
  };
}
