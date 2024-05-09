import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 尝试获取本地存储中的数据
function getSavedState(key: string): any {
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// 保存数据到本地存储
function saveState(key: string, state: any): void {
  window.localStorage.setItem(key, JSON.stringify(state));
}


export default new Vuex.Store({
  state: {
    value: '',
    pass: 'filedog666',
    oss: 'https://filedog.oss-cn-beijing.aliyuncs.com/',
  },
  getters: {
    getPass: state=> state.pass,
  },
  mutations: {
    // mutation来更新value
    updateValue(state, newValue) {
      state.value = newValue;
    },
  },
  actions: {
  },
  modules: {
  }
})
