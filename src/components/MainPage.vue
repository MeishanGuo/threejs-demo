<template>
  <div>
    <center>
      <h2>数据可视化</h2>
      <h3>threejs 实现3d地球</h3>
    </center>
    <div class="canvas-stage"></div>
  </div>
</template>

<script>

export default {
  name: 'MainPage',
  props: {
    msg: String
  },
  beforeMount() {
    console.log(9999);
  }
}
</script>

<style scoped>
  .canvas-stage {
    width: 640px;
    height: 480px;
    margin: 0 auto;
    border: 1px solid red;
  }
</style>
