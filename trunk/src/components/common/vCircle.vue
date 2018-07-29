<template>
  <div class="circle">
    <svg :height="radius" :width="radius" viewBox="0 0 100 100" version="1.2" xmlns="http://www.w3.org/2000/svg">
      <circle class="circle-bg" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="circle-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "v-circle",
    props: ['radius', 'percent'],
    data() {
      return {
        dashArray: Math.PI * 100
      }
    },
    components: {},
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray;
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";

  .circle {
    position: relative;

    circle{
      stroke-width: 8px;
      transform-origin: center;

      &.circle-bg {
        transform: scale(0.9);
        stroke: @color-theme-d;
      }
      &.circle-bar {
        transform: scale(.9) rotate(-90deg);
        stroke: @color-theme;
      }
    }
  }
</style>
