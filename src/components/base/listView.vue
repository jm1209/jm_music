<template>
  <scroll class="list-view" ref="listView" :data="singerArr" :listen-scroll="listenScroll" :probe-type="probeType"
          @scrollRang="scrollChange">
    <ul>
      <li class="list-group" v-for="singer in singerArr" ref="listGroup">
        <h2 class="list-group-title">{{singer.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in singer.items" @click="selectItem(item)">
            <img v-lazy="item.avatar" width="50" height="50" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="shortcutStart" @touchmove="shortcutMove">
      <ul>
        <li class="item" v-for="(item,index) in shortcutList" :data-index="index"
            :class="curIndex == index ? 'cur' : ''">{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-if="fixedTitle" ref="listFixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>

<script>
  import scroll from 'base/scroll';
  import {getAttrData} from "js/dom";
  import index from "../../router";

  const CUR_HEIGHT = 18;
  const TITLE_LENGTH = 30;

  export default {
    name: "list-view",
    props: ['singerArr'],
    data() {
      return {
        scrollY: -1,
        curIndex: 0,
        diff: -1
      }
    },
    components: {scroll},
    computed: {
      shortcutList() {
        return this.singerArr.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.singerArr[this.curIndex] ? this.singerArr[this.curIndex].title : '';
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('singerDetail', item)
      },
      shortcutStart(e) {
        let anchorIdx = getAttrData(e.target, 'index');
        this.touch.y1 = e.touches[0].pageY;
        this.touch.anchorIdx = anchorIdx;
        this._scrollTo(anchorIdx)
      },
      shortcutMove(e) {
        this.touch.y2 = e.touches[0].pageY;
        let delta = (this.touch.y2 - this.touch.y1) / CUR_HEIGHT | 0;
        let anchorIdx = parseInt(this.touch.anchorIdx) + delta;
        this._scrollTo(anchorIdx)
      },
      scrollChange(pos) {
        this.scrollY = pos.y
      },
      calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          height += list[i].clientHeight;
          this.listHeight.push(height)
        }
      },
      _scrollTo(index) {
        if (index === null) {
          return;
        }
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }

        this.scrollY = -this.listHeight[index];
        this.$refs.listView.scrollToElem(this.$refs.listGroup[index], 0);
      }
    },
    watch: {
      singerArr() {
        setTimeout(() => {
          this.calculateHeight();
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        if (newY > 0) { //当滚动到顶部时，newY > 0
          return 0;
        }

        //在中间滚动时
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];

          if (-newY >= height1 && -newY < height2) {
            this.curIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_LENGTH) ? TITLE_LENGTH - newVal : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        if (this.$refs.listFixed === undefined) {
          return;
        }
        this.$refs.listFixed.style.transform = `translate3d(0,-${fixedTop}px,0)`;
      }
    },
    created() {
      this.touch = {};
      this.listenScroll = true;
      this.probeType = 3;
      this.listHeight = [];
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";

  .list-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: @color-background;

    .list-group {
      padding-bottom: 30px;
      z-index: -1;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-d;
        background-color: @color-highlight-background;
      }
      .list-group-item {
        display: flex;
        padding: 20px 0 0 30px;
        z-index: -1;

        .avatar {
          border-radius: 50%;
          overflow: hidden;
          width: 50px;
          flex: 0 0 50px;
        }
        .name {
          flex: 1;
          margin-left: 20px;
          line-height: 50px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 20px 0;
      background-color: @color-background-d;
      border-radius: 10px;
      font-family: Helvetica;

      .item {
        padding: 3px;
        line-height: 1;
        font-size: @font-size-small;
        color: @color-text-l;
        text-align: center;

        &.cur {
          color: @color-theme;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
  }
</style>
