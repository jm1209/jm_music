<template>
  <div class="player" v-show="playList.length > 0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="curSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="narrow()">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="curSong.name"></h1>
          <h2 class="subtitle" v-html="curSong.singer">></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="curSong.image" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <div class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="curLyric">
                <p class="lyricLine" v-for="(line,index) in curLyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(curTime)}}</span>
            <div class="progress-bar-wrapper">
              <v-progress :percent="percent" @changePercent="changeProgress"></v-progress>
            </div>
            <span class="time time-r">{{format(curSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prevSong" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay" :class="disableCls">
              <i class="needsclick" :class="playIcon"></i>
            </div>
            <div class="icon i-right" @click="nextSong" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="magnshowy()">
        <div class="icon">
          <div class="img-wrapper">
            <img :class="cdCls" :src="curSong.image" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="curSong.name"></h2>
          <p class="desc" v-html="curSong.singer"></p>
        </div>
        <div class="control">
          <v-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" class="icon-mini" @click.stop="togglePlay"></i>
          </v-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="curSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  import animations from 'create-keyframe-animation';
  import vProgress from 'common/vProgress';
  import vCircle from 'common/vCircle';
  import {playMode} from 'js/config';
  import {shuffle} from 'js/util';
  import Lyric from 'lyric-parser';

  export default {
    name: "play",
    props: [],
    data() {
      return {
        songReady: true,
        curTime: 0,
        radius: 32,
        curLyric: null
      }
    },
    components: {vProgress, vCircle},
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause';
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.curTime / this.curSong.duration;
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
      },
      ...mapGetters(['fullScreen', 'playList', 'curSong', 'playing', 'curIndex', 'mode', 'sequenceList'])
    },
    methods: {
      narrow() {
        this.setFullScreen(false);
      },
      magnshowy() {
        this.setFullScreen(true);
      },
      enter(el, done) {
        const {scale, x, y} = this._getPosAndScale();
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0 scale(${1.1})`
          },
          100: {
            transform: `translate3d(0,0 scale(${1})`
          }
        };
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        });
        animations.runAnimation(this.$refs.cdWrapper, 'move', done);
      },
      afterEnter(el, done) {
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style = '';
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        const {scale, x, y} = this._getPosAndScale();
        this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', done);
      },
      afterLeave(el, done) {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style.transform = '';
      },
      togglePlay() {
        if (!this.songReady) {
          return;
        }
        this.setPlaying(!this.playing);
      },
      prevSong() {
        if (!this.songReady) {
          return;
        }
        let index = this.curIndex - 1;
        if (index === -1) {
          index = this.playList.length;
        }
        this.setCurIndex(index);
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false;
      },
      nextSong() {
        if (!this.songReady) {
          return;
        }
        let index = this.curIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurIndex(index);
        if (!this.playing) {
          this.togglePlay()
        }
        this.songReady = false;
      },
      ready() {
        this.songReady = true;
      },
      error() {
        this.songReady = true;
      },
      updateTime(e) {
        this.curTime = e.target.currentTime;
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loopSong();
        } else {
          this.nextSong();
        }
      },
      loopSong() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      },
      format(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = interval % 60;
        return `${minute}:${this._pad(second)}`;
      },
      changeProgress(percent) {
        this.$refs.audio.currentTime = percent * this.curSong.duration;
        if (!this.playing) {
          this.togglePlay();
        }
      },
      changeMode() {
        const mode = (this.mode + 1) % 3;
        this.setMode(mode);
        let list = null;
        if (this.mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        this.restCurIndex(list);
        this.setPlayList(list);
      },
      restCurIndex(list) {
        let index = list.findIndex((item) => {
          return this.curSong.id === item.id;
        });
        this.setCurIndex(index);
      },
      getLyric() {
        this.curSong.getLyric().then((lyric) => {
          this.curLyric = new Lyric(lyric)
        });
      },
      _pad(num, n = 2) {
        let numLen = num.toString().length;
        while (numLen < n) {
          num = '0' + num;
          numLen++;
        }
        return num;
      },
      _getPosAndScale() {
        const sRoundW = 40;//小圆圈的宽度
        const sRoundL = 40;//小圆圈中心点距屏幕左边距离
        const sRoundB = 30;//小圆圈中心点距屏幕下方距离
        const bRoundT = 80;//大圆圈边距距屏幕顶部距离
        const bRoundW = window.innerWidth * 0.8;//大圆圈的宽度
        const scale = sRoundW / bRoundW;//缩放比例
        const x = -(window.innerWidth / 2 - sRoundL);
        const y = window.innerHeight - bRoundW / 2 - bRoundT - sRoundB;
        return {scale, x, y};
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING',
        setCurIndex: 'SET_CUR_INDEX',
        setMode: 'SET_MODE',
        setPlayList: 'SET_PLAY_LIST'
      })
    },
    watch: {
      curSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return;
        }
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        })
      },
      playing(newPlay) {
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlay ? audio.play() : audio.pause();
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/mixin";
  @import "../../assets/less/variable";

  .player {
    .normal-player {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 150;
      background-color: @color-background;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(20px);
      }
      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          i {
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          .no-wrap;
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: normal;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;

              &.play {
                animation: rotate 20s linear infinite;
              }
              &.pause {
                animation-play-state: paused;
              }

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0;
            overflow: hidden;
            text-align: center;

            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .dot-wrapper {
          text-align: center;
          font-size: 0;

          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: @color-text-l;

            &.active {
              width: 20px;
              border-radius: 5px;
              background-color: @color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;

          .time {
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;

            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;

          .disable {
            color: @color-theme-d !important;
          }
          .icon {
            flex: 1;
            color: @color-theme;

            i {
              font-size: 30px;
            }

            &.i-left {
              text-align: right;
            }
            &.i-center {
              text-align: center;
            }
            &.i-right {
              text-align: left;
            }
          }
        }
      }
      &.normal-enter-active, .normal-leave-active {
        transition: all 0.4s;

        .top, .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0;

        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player {
      display: flex;
      align-items: center;
      position: fixed;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background-color: @color-highlight-background;

      .icon {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        padding: 0 10px 0 20px;

        .img-wrapper {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;

          .play {
            animation: rotate 20s linear infinite;
          }
          .pause {
            animation-play-state: paused;
          }
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        justshowy-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name {
          margin-bottom: 2px;
          .no-wrap;
          font-size: 14px;
          color: #fff;
        }
        .desc {
          .no-wrap;
          font-size: 12px;
          color: @color-text-d;
        }
      }
      .control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;

        i {
          font-size: 30px;
          color: @color-theme-d;

          &.icon-mini {
            font-size: 32px;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }

      &.mini-enter-active, .mini-leave-active {
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0;
      }
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>
