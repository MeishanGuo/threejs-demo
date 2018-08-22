/**
* 背景星空效果
**/

export default function starrySkyGenerator  (cfg = {}) {
    var defaults = {
      container: document.body,
      starColor: '#64b5f6',
      mount: 100,
      maxRadius: 1,
      minRadius: 1,
      alphaStep: 40 // 越大, 闪烁越慢
    }

    var _cfg = Object.assign({}, defaults, cfg)
    var container = _cfg.container
    var width = container.offsetWidth,
        height = container.offsetHeight
    var canvasEl = document.createElement('canvas')
    canvasEl.width = width
    canvasEl.height = height
    container.appendChild(canvasEl)

    var ctx = canvasEl.getContext('2d');
    var nodes = [];
    function constructNodes() {
      for (var i = 0; i < _cfg.mount; i++) {
        var node = {
          x: Math.random() * canvasEl.width,
          y: Math.random() * canvasEl.height,
          vx: (Math.random() - 0.5) / 4, // (-0.5 ~ 0.5)
          vy: (Math.random() - 0.5) / 4, // (-0.5 ~ 0.5)
          radius: Math.random() * _cfg.maxRadius,
          alpha: Math.floor(Math.random() * 9 + 1) / 10,
          alphaStep: Math.random() / _cfg.alphaStep
        };
        nodes.push(node);
      }
    }
    constructNodes()

    function update() {
      nodes.forEach(function (e) {
        e.x += e.vx / 2;
        e.y += e.vy / 2;
        function clamp(min, max, value) {
          if (value > max) {
            return max;
          } else if (value < min) {
            return min;
          } else {
            return value;
          }
        }

        if (e.x <= 0 || e.x >= canvasEl.width) {
          e.vx *= -1;
          e.x = clamp(0, canvasEl.width, e.x)
        }

        if (e.y <= 0 || e.y >= canvasEl.height) {
          e.vy *= -1;
          e.y = clamp(0, canvasEl.height, e.y)
        }
      });
      render();
      window.requestAnimationFrame(update);
    }

    // 获得并更新节点透明度
    function getAndSetAlpha (node) {
      node.alpha += node.alphaStep
      if (node.alpha >= 1) {
        if (node.alphaStep > 0) {
          node.alphaStep = -node.alphaStep
        }
      }
      if (node.alpha <= 0) {
        if (node.alphaStep < 0) {
          node.alphaStep = -node.alphaStep
        }
      }
      return node.alpha
    }

    function render() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      nodes.forEach(function (e) {
        ctx.globalAlpha = getAndSetAlpha(e)
        ctx.fillStyle = _cfg.starColor;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.globalAlpha = 1
    }

  update()
}