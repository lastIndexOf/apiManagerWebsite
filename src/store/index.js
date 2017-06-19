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
    user: {},
    socket: {},
    groups: []
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
    },
    setUser(state, user) {
      state.user = user
    },
    setAvatar(state, avatar) {
      state.user.avatar = avatar
    },
    setInformation(state,[ name, job ]) {
      state.user.name = name
      state.user.job = job
    },
    setSocket(state, socket) {
      state.socket = socket
    },
    setGroups(state, groups) {
      state.groups = groups
    },
    setGroupSum(state, id) {
      for (let group of state.groups) {
        if (group.id == id)
          group.sum++
      }
    },
    removeSum(state, id) {
      for (let group of state.groups) {
        if (group.id == id)
          group.sum = 0
      }
    }
  },
  actions: {
    async getUser() {

    }
  }
})
