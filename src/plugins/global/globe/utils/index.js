
/**
* 创建径向渐变
*/
export function createRadialGradient(config = {}) {
  var defaultConfig = {
    size: 50,
    colors: [
      [0, 'red'],
      [1, 'yellow']
    ]
  }
  const _config = Object.assign({}, defaultConfig, config)
  var canvas = document.createElement('canvas')
  canvas.width = _config.size
  canvas.height = _config.size

  const r = _config.size / 2

  var ctx = canvas.getContext('2d');

  var gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  _config.colors.forEach(color => {
    gradient.addColorStop(color[0], color[1]);
  })
  
  ctx.arc(r, r, r, 0, 2 * Math.PI);

  ctx.fillStyle = gradient;
  ctx.fill();
  return canvas
}
/**
* 通过经纬度，获得该点在笛卡尔坐标系中的坐标
*/
export function getDescartesPosition (r, lat, log) {
  var phi = (90 - lat) * Math.PI / 180;
  var theta = (180 - log) * Math.PI / 180;
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta)
  }
}
