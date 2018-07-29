import {playMode} from "js/config";

const state = {
  singer: {},
  playing: false,//是否播放
  fullScreen: true,//是否展开
  playList: [],//播放列表
  sequenceList: [],//展示个单列表
  mode: playMode.sequence,//播放规则
  curIndex: -1,//当前播放下标
};

export default state;
