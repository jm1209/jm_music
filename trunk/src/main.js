import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';
import store from './store'

import 'less/index.less';
import 'swiper/dist/css/swiper.min.css';

Fastclick.attach(document.body);

Vue.use(VueLazyLoad,{
  loading:require('images/default.png')
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
