<template>
  <div class="carousel">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <slot></slot>
      </div>
      <!-- 分页器 -->
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper';

  export default {
    name: "v-carousel",
    props: [],
    data() {
      return {}
    },
    components: {},
    computed: {},
    methods: {
      _carouselInit() {
        this.carousel = new Swiper('.swiper-container', {
          autoplay: true,
          pagination: {
            el: '.swiper-pagination',
          },
        })
      }
    },
    created() {
      this.carousel;
    },
    mounted() {
      this._carouselInit();
    }
  }
</script>

<style lang="less">
  @import "../../assets/less/variable";

  .carousel {

    img {
      width: 100%;
    }
    .swiper-pagination-bullet {
      background: @color-text-l
    }
    .swiper-pagination-bullet-active{
      width: 20px;
      border-radius: 5px;
      background: @color-text-ll;
    }

  }
</style>
