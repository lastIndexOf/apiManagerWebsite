import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '../router/index'

import request from 'superagent'

export default new Vuex.Store({
  // modules: {},
  state: {
    isBlur: false,
    showTabs: false,
    user: {}
  },
  mutations: {
    back(state) {
      router.back()
    },
    cancelBlur(state) {
      let timer = setTimeout(() => {
        timer = null
        state.isBlur = false
      }, 200)
    },
    beBlur(state) {
      state.isBlur = true
    },
    showMenu(state) {
      state.showTabs = true
    },
    notShowMenu(state) {
      state.showTabs = false
    }
  },
  actions: {
    async getUser() {

    }
  }
})
