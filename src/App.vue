<template>
  <div id="app">
    <v-top></v-top>
    <v-tab></v-tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import vTop from 'common/vTop';
  import vTab from 'common/vTab';
  import player from 'base/player';

  export default {
    name: 'App',
    components: {vTop, vTab, player}
  }
</script>
