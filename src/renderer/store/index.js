import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    visible: false
  },
  mutations: {
    ADD_IMAGE(state, payload) {
      state.visible = payload.data
    },
  },
  actions: {
  },
  getters: {
  }
})

export default store