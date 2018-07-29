<template>
  <div ref="scroll">
    <slot></slot>
  </div>
</template>

<script>
  import Bscroll from 'better-scroll';

  export default {
    name: "scroll",
    props: {
      probeType: {type: Number, default: 1},
      click: {type: Boolean, default: true},
      data: {type: Array, default: null},
      listenScroll: {type: Boolean, default: false},
    },
    methods: {
      _initScroll(){
        if(!this.$refs.scroll){
          return;
        }
        this.scroll = new Bscroll(this.$refs.scroll,{
          probeType:this.probeType,
          click:this.click
        });
        if(this.listenScroll){
          const self = this;
          this.scroll.on('scroll',(pos) => {
            self.$emit('scrollRang',pos)
          })
        }
      },
      enable(){
        this.scroll && this.scroll.enable();
      },
      disable(){
        this.scroll && this.scroll.disable();
      },
      refresh(){
        this.scroll && this.scroll.refresh();
      },
      scrollTo(){
        this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);
      },
      scrollToElem(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
      },
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      },20)
    },
    watch: {
      data(){
        setTimeout(() => {
          this.refresh();
        },20)
      }
    }
  }
</script>

