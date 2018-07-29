import * as types from './mutations-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CUR_INDEX](state, index) {
    state.curIndex = index;
  },
};

export default mutations;
