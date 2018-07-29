import Vue from 'vue';
import Router from 'vue-router';
import Rankings from 'page/Rankings';
import Recommend from 'page/Recommend';
import Search from 'page/Search';
import Singer from 'page/Singer';
import SingerDetail from 'page/Singer-detail';

Vue.use(Router);

export default new Router({
  mode:'history',
  linkExactActiveClass: 'active',
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path: '/rankings',
      name: 'Rankings',
      component: Rankings
    },{
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },{
      path: '/search',
      name: 'Search',
      component: Search
    },{
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {path:':id',component:SingerDetail}
      ]
    },
  ]
})
