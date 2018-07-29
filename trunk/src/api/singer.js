import jsonp from 'js/jsonp';
import axios from 'axios';
import {commonParams, options} from "api/config";

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });

  return jsonp(url, data, options);
}

export function getSingerDetail(singerId){

  const data = Object.assign({}, commonParams,{
    hostUin:0,
    needNewCode:0,
    platform:'yqq',
    order:'listen',
    begin:0,
    num:80,
    songstatus:1,
    singermid:singerId
  })

  return axios.get('/api/getSingerDetail',{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
