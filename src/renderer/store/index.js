import Vue from "vue";
import Vuex from "vuex";
import { getBucketList } from "@/service/getData.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    visible: false,
    mac: {},
    bucketList: []
  },
  mutations: {
    ADD_IMAGE(state, payload) {
      state.visible = payload.data;
    },
    STORE_MAC(state, payload) {
      state.mac = payload.data;
    },
    GET_BUCKET_LIST(state, payload) {
      state.bucketList = payload;
    }
  },
  actions: {
    getBucketList: ({ state, commit }) => {
      getBucketList(state.mac).then(it => {
        if (it.data.length) {
          commit("GET_BUCKET_LIST", it.data);
          // this.getBucketDomain(this.mac, this.currentBucket);
        }
      });
    }
  },
  getters: {}
});

export default store;
