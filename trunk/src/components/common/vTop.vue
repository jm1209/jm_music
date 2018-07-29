<template>
    <div class="top">
      <div class="icon"></div>
      <div class="text">Jm Music</div>
    </div>
</template>

<script>
    export default {
        name: "v-top",
        props: [],
        data() {
            return {}
        },
        components: {},
        computed: {},
        methods: {},
        created() {
        }
    }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";
  @import "../../assets/less/mixin";

  .top{
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-theme;
    font-size: 0;

    .icon{
      display: inline-block;
      .bg-img(logo);
      background-size: 30px 32px;
      background-repeat: no-repeat;
      vertical-align: top;
      width: 30px;
      height: 32px;
      margin-right: 9px;
      margin-top: 6px;
    }
    .text{
      display: inline-block;
      font-size:@font-size-large ;
      line-height: 38px;
    }
  }
</style>
