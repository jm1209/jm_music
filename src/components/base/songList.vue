<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song,index) in songs" @click="chooseItem(song,index)">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{ singerDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: ['songs'],
    data() {
      return {}
    },
    components: {},
    computed: {},
    methods: {
      singerDesc(song) {
        return `${song.singer}·${song.name}`
      },
      chooseItem(song,index){
        this.$emit('choose',song,index)
      }
    },
    created() {

    },

  }
</script>

<style scoped lang="less">
  @import "../../assets/less/variable";
  @import "../../assets/less/mixin";

  .song-list {
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: @font-size-medium;

      .content{
        flex: 1;
        line-height: 20px;
        overflow: hidden;

        .name{
          .no-wrap;
          color: @color-text;
        }
        .desc{
          .no-wrap;
          margin-top: 4px;
          color:  @color-text-d;
        }
      }
    }
  }
</style>
