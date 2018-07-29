<template>
  <div class="recommend">
    <scroll class="content" ref="scroll">
      <div>
        <v-carousel v-if="sliderArr.length">
          <div class="swiper-slide" v-for="slider in sliderArr"><a :href="slider.linkUrl"><img :src="slider.picUrl"
                                                                                               @load="loadImg"></a>
          </div>
        </v-carousel>

        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in recommendArr">
              <div class="icon"><img v-lazy="item.imgurl" width="60" height="60"></div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loading-wrapper" v-if="!recommendArr.length">
      <v-loading></v-loading>
    </div>
  </div>
</template>

<script>
  import scroll from 'base/scroll';
  import vCarousel from 'common/vCarousel';
  import vLoading from 'common/vLoading';
  import {getCarousel, getRecommend} from "api/recommend";
  import {ERR_OK} from "api/config";

  export default {
    name: "recommend",

    data() {
      return {
        sliderArr: [],
        recommendArr: []
      }
    },
    components: {scroll, vCarousel, vLoading},
    methods: {
      loadImg() {
        if (!this.checkLoad) {
          this.$refs.scroll.refresh();
          this.checkLoad = true;
        }
      },
      _getCarousel() {
        getCarousel().then((res) => {
          if (res.code == ERR_OK) {
            this.sliderArr = res.data.slider;
          }
        })
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code == ERR_OK) {
            this.recommendArr = res.data.list;
          }
        })
      }
    },
    created() {
      this._getCarousel();
      this._getRecommend();
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";

  .recommend {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;

    .content {
      height: 100%;
      overflow: hidden;

      .recommend-list {

        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          color: @color-theme;
          font-size: @font-size-medium;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            flex: 1;
            flex-direction: column;
            justify-content: center;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;

            .name {
              margin-bottom: 10px;
              color: @color-text;
            }
            .desc {
              color: @color-text-d;
            }
          }
        }
      }
    }

    .loading-wrapper{
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }
  }
</style>
