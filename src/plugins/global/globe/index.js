
import createEarth from './create-earth'
import createHotPots from './create-hot-pots'
import createFlyCurves from './create-fly-curves'
import createSatellite from './create-satellite'

// import createAtmosphere from './create-atmosphere'

import createParticleAtmosPhere from './create-particle-atmosphere'
// import createParticleGlobeOuter from './create-particle-globe-outer'


var Globe = function (container, dataset) {
    // 防止容器中出现多个图层
    if (container.hasChildNodes()) {
      container.firstElementChild.remove()
    }
    // 视窗大小
    var w = container.offsetWidth || 500;
    var h = container.offsetHeight || 500;

    var windowHalfX = w / 2;
    var windowHalfY = h / 2;

    var camera, scene, renderer;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var rotationGroup = new THREE.Object3D()

    function _init() {
      camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 500;
      camera.updateProjectionMatrix();
      scene = new THREE.Scene();
      /**************************/

      var satellite  =  createSatellite()
      scene.add(satellite)

      var earth = createEarth()
      rotationGroup.add(earth)

      _createHotPots(dataset)
      _createFlyCurves(dataset)


      // 粒子效果
      var particleAtmosPhere = createParticleAtmosPhere()
      scene.add(particleAtmosPhere)

      // 添加后，会有性能问题
      // var globeOuter = createParticleGlobeOuter()
      // scene.add(globeOuter)

      // 贴图大气层
      // var atmosphere = createAtmosphere(scene)
      // scene.add(atmosphere)

      // 保证中国在地球上的主视角q
      rotationGroup.rotation.x = Math.PI / 6

      // 将分组添加到场景中
      scene.add(rotationGroup)

      renderer = new THREE.WebGLRenderer({
        antialias: true, // 消锯齿，但是会耗性能
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(w, h);
      container.appendChild(renderer.domElement);

      document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }
    /**
    * 添加热点
    */
    function _createHotPots(d) {
      const g_name = 'hotPotsGroup'
      // 简易的垃圾回收
      _recovery(g_name)
      var hotPots = createHotPots(d)
      hotPots.name = g_name
      rotationGroup.add(hotPots)
    }
    /**
    * 添加飞线
    */
    function _createFlyCurves(d) {
      const g_name = 'flyCurvesGroup'
      // 简易的垃圾回收
      _recovery(g_name)
      var flyCurves = createFlyCurves(d)
      flyCurves.name = g_name
      rotationGroup.add(flyCurves)
    }
    /**
    * 垃圾回收
    */
    function  _recovery (objName) {
      var old = rotationGroup.getObjectByName(objName)
      if (old) {
          rotationGroup.remove(old);
      }
    }
    /**
    * 绑定事件
    */
    function onDocumentMouseDown( event ) {
      event.preventDefault();
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      document.addEventListener( 'mouseup', onDocumentMouseUp, false );
      document.addEventListener( 'mouseout', onDocumentMouseOut, false );
      mouseXOnMouseDown = event.clientX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }
    function onDocumentMouseMove( event ) {
      mouseX = event.clientX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    }
    function onDocumentMouseUp( event ) {
      document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    function onDocumentMouseOut( event ) {
      document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
      document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
      document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }
    /**
    * 执行动效
    */
    function _animate() {
      requestAnimationFrame( _animate );
      render();
    }

    function render() {
      // targetRotation -= 0.005
      // rotationGroup.rotation.y += ( targetRotation - rotationGroup.rotation.y ) * 0.05;
      if (rotationGroup.rotation.y > 360) {
        rotationGroup.rotation.y = 0
      }
      rotationGroup.rotation.y -= 0.015;
      renderer.render( scene, camera );
    }

    this.init = _init
    this.animate = _animate
    this.createHotPots = _createHotPots 
    this.createFlyCurves = _createFlyCurves

    return this
}

export default Globe
