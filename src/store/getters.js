export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const curIndex = state => state.curIndex;

export const curSong = (state) => {
  return state.playList[state.curIndex] || {}
};
