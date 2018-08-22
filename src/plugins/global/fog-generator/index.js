/**
* 雾气效果模块
*/
export default function fogGenerator(options){
  var defaults = {
    count: 10,
    velocity: 2,
    fps: 5,
    url: './smoke-v1.png',
    container: document.body
  };

  // 参数合并
  var params = Object.assign({}, defaults, options || {})
  // 创建存储粒子的数组
  var particles = [];
  // 渲染的粒子数目
  var particleCount = params.count;
  // 每个方向的最大速度
  var maxVelocity = params.velocity;
  // 每秒多少帧
  var targetFPS = params.fps;
  // canvas元素
  var canvas = createCanvas()
  params.container.appendChild(canvas)
  var eleCanvas = canvas;

  if (!eleCanvas) {
    return this;
  }

  // 画布的尺寸
  var canvasWidth = eleCanvas.clientWidth;
  var canvasHeight = eleCanvas.clientHeight;
  
  eleCanvas.width = canvasWidth;
  eleCanvas.height = canvasHeight;

  // 创建图片对象
  var imageObj = new Image();

  // 一旦图像被下载，然后在所有的颗粒上设置图像
  imageObj.onload = function() {
    particles.forEach(function(particle) {
        particle.setImage(imageObj);
    });
  };

  // 烟雾图片地址
  imageObj.src = params.url;

  // 粒子实例方法
  function Particle(context) {
    // 设置初始位置
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;

    // 纵横速度
    this.xVelocity = 0;
    this.yVelocity = 0;

    // 圆角大小
    this.radius = 2;

    // 存储上下文，绘制的时候需要
    this.context = context;
    // 默认的初始透明度为0
    this.alpha = 0
    // 绘制粒子的具体方法
    this.draw = function() {
      // 如果图片，则绘制
      if(this.image){
        this.context.globalAlpha = this.alpha;
        // 烟雾缭绕就看这里了
        // 这是宽度，是动态的
        var fillWidth = canvasWidth / 2, fillHeight = fillWidth * (1 - (this.x / canvasWidth * this.y / canvasHeight));
        this.context.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight, this.x, this.y, fillWidth, fillHeight);
      }
    };

    // 刷新粒子
    this.update = function() {
      // 改变粒子的
      this.x += this.xVelocity;
      this.y += this.yVelocity;

      // 如果到了右边缘
      if (this.x >= canvasWidth - this.imageWidth) {
        this.xVelocity = -this.xVelocity;
        this.x = canvasWidth - this.imageWidth;
      }
      // 检测是否到了左边缘
      else if (this.x <= 0) {
        this.xVelocity = -this.xVelocity;
        this.x = 0;
      }

      // 底边缘
      if (this.y >= canvasHeight - this.imageHeight) {
        this.yVelocity = -this.yVelocity;
        this.y = canvasHeight - this.imageHeight;
      }
      
      // 是否上边缘
      else if (this.y <= 0) {
        this.yVelocity = -this.yVelocity;
        this.y = 0;
      }
      // 越靠近边缘，透明度越低
      // 纵向透明度变化要比横向的明显
      this.alpha = (1 - Math.abs(canvasWidth * 0.5 - this.x) / canvasWidth) * (0.7 - Math.abs(canvasHeight*0.5 - this.y) / canvasHeight) / 2;
    };

    // 设置粒子位置方法
    this.setPosition = function(x, y) {
      this.x = x;
      this.y = y;
    };
    // 设置速度方法
    this.setVelocity = function(x, y) {
      this.xVelocity = x;
      this.yVelocity = y;
    };
    
    this.setImage = function(image){
      this.imageWidth = image.width;
      this.imageHeight = image.height;
      this.image = image;
    }
  }

  // 生成一个min,max大小之间的随机数
  function generateRandom(min, max){
    return Math.random() * (max - min) + min;
  }

  // canvas上下文
  var context;

  // 初始化常见
  function init() {
    var canvas = eleCanvas;
    if (canvas.getContext) {

      // 绘图都需要这条语句
      context = canvas.getContext('2d');

      // 创建粒子，并设置他们的位置什么的，当然都是随机的
      for(var i=0; i < particleCount; ++i){
        var particle = new Particle(context);
        
        // 随机位置
        particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));
        // 设置随机速度
        particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
        particles.push(particle);            
      }
    }
  }
  
  // 初始化
  init();

  // 绘制方法
  function draw() {
    // 清除绘制
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    // 绘制所有粒子
    particles.forEach(function(particle) {
      particle.draw();
    });
  }

  // 刷新
  function update() {
    particles.forEach(function(particle) {
      particle.update();
    });
  }

  // 开始绘制
  if (context) {
    setInterval(function() {
      // 绘制前先更新位置什么的
      update();
      // 绘制
      draw();
    }, 1000 / targetFPS);
  } 
}

function createCanvas () {
  var canvas = document.createElement('canvas')
  canvas.style.width = '600px'
  canvas.style.height = '600px'
  canvas.style.position = 'absolute'
  canvas.style.right = 0
  canvas.style.bottom = 0
  return canvas
}



