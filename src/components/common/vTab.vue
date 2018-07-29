<template>
    <div class="tab">
      <router-link tag="div" to="/recommend" class="tab-item">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" to="/singer" class="tab-item">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" to="/rankings" class="tab-item">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link tag="div" to="/search" class="tab-item">
        <span class="tab-link">搜索</span>
      </router-link>
    </div>
</template>

<script>
    export default {
        name: "v-tab"
    }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";

  .tab{
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: @font-size-medium;

    .tab-item{
      flex: 1;
      text-align: center;

      &.active{
        color: @color-theme;

        .tab-link{
          border-bottom: 2px solid @color-theme;
          padding-bottom: 5px;
        }
      }
    }
  }
</style>
