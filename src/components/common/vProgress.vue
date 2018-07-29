<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn" @touchstart.prevent="progressStart"
             @touchmove.prevent="progressMove" @touchend.prevent="progressEnd"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const BALL_WIDTH = 16;

  export default {
    name: "v-progress",
    props: ['percent'],
    data() {
      return {}
    },
    components: {},
    computed: {},
    methods: {
      progressStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressMove(e) {
        if (!this.touch.initiated) {
          return;
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - BALL_WIDTH, Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);
      },
      progressEnd() {
        this.touch.initiated = false;
        this._triggerPercent()
      },
      progressClick(e){
        // 当点击黄色小圆圈的时候，e.offsetX获取不正确
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._offset(offsetWidth);
        this._triggerPercent();
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`;
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - BALL_WIDTH;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('changePercent', percent);
      }
    },
    watch: {
      percent(newpPrcent) {
        if (newpPrcent >= 0 && !this.touch.initiated) {
          const proWidth = this.$refs.progressBar.clientWidth - BALL_WIDTH;
          const offsetWidth = newpPrcent * proWidth;
          this._offset(offsetWidth);
        }
      }
    },
    created() {
      this.touch = {}
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";

  .progress-bar {
    height: 30px;

    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background-color: @color-background-d;

      .progress {
        position: absolute;
        height: 100%;
        background-color: @color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        top: -13px;
        left: -8px;
        width: 30px;
        height: 30px;

        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid #fff;
          border-radius: 50%;
          background: #ffcd32;
        }
      }
    }
  }
</style>
