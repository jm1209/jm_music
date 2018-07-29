<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-img" ref="bgImg" :style="bgStyle">
      <div class="play-wrapper" v-show="songs.length > 0" ref="playWrapper">
        <div class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" ref="list" :data="songs" :probeType="probeType" :listenScroll="listenScroll"
            @scrollRang="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @choose="chooseItem"></song-list>
      </div>
    </scroll>
    <div class="loading-wrapper" v-if="!songs.length">
      <v-loading></v-loading>
    </div>
  </div>
</template>

<script>
  import scroll from 'base/scroll';
  import songList from 'base/songList';
  import vLoading from 'common/vLoading';
  import {mapActions} from 'vuex';

  const NO_MOVE_HEIGHT = 40;

  export default {
    name: "v-musiclist",
    props: ['bgImage', 'title', 'songs'],
    data() {
      return {
        scrollY: -1
      }
    },
    components: {scroll, songList, vLoading},
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`;
      }
    },
    methods: {
      back() {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      chooseItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions(['selectPlay', 'randomPlay'])
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY);
        let zIndex = 0;
        let scale = 1;
        this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`;

        const percnt = Math.abs(newY / this.imgHeight);
        if (newY > 0) {
          scale = 1 + percnt;
          zIndex = 10
        }

        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.bgImg.style['paddingTop'] = 0;
          this.$refs.bgImg.style['height'] = `${NO_MOVE_HEIGHT}px`;
          this.$refs.playWrapper.style['display'] = `none`;
        } else {
          this.$refs.bgImg.style['paddingTop'] = '70%';
          this.$refs.bgImg.style['height'] = 0;
          this.$refs.playWrapper.style['display'] = `block`;
        }
        this.$refs.bgImg.style['zIndex'] = zIndex;
        this.$refs.bgImg.style['transform'] = `scale(${scale})`;
      }
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.imgHeight = this.$refs.bgImg.clientHeight;
      this.minTranslateY = -this.imgHeight + NO_MOVE_HEIGHT;
      this.$refs.list.$el.style.top = `${this.$refs.bgImg.clientHeight}px`;
    }
  }
</script>

<style scoped lang="less">
  @import '../../assets/less/variable';
  @import '../../assets/less/mixin';

  .music-list {
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: @color-background;

    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;

      i {
        display: block;
        padding: 10px;
        font-size: 22px;
        color: @color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      .no-wrap;
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .bg-img {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;

      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;

        .play {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid @color-theme;
          color: @color-theme;
          border-radius: 100px;
          font-size: 0;

          .icon-play {
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-medium-x;
          }
          .text {
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-medium;
          }
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background-color: @color-background;
    }
    .list {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-background;

      .song-list-wrapper {
        padding: 20px 30px;
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .loading-wrapper {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
</style>
