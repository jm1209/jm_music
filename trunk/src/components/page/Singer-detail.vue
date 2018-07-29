<template>
  <transition name="slide">
    <v-musiclist :title="title" :bgImage="bgImage" :songs="songs"></v-musiclist>
  </transition>
</template>

<script>
  import vMusiclist from 'common/vMusiclist';
  import {getSingerDetail} from "api/singer";
  import {mapGetters} from "vuex";
  import {ERR_OK} from "api/config";
  import {createSong,isValidMusic, processSongsUrl} from "js/song";

  export default {
    name: "singer-detail",
    props: [],
    data() {
      return {
        songs:[]
      }
    },
    components: {vMusiclist},
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar;
      },
      ...mapGetters(['singer'])
    },
    methods: {
      _getDetail() {
        if(!this.singer.id){
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {

          if(res.code == ERR_OK){
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs;
            })
          }
        })
      },
      _normalizeSongs(list){
        let ret = [];
        list.forEach((item) => {
          let {musicData} = item;
          if(isValidMusic(musicData)){
            ret.push(createSong(musicData))
          }
        });
        return ret;
      }
    },
    created() {
      this._getDetail()
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
