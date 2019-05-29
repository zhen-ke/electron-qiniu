import { getToken, setToken, removeToken } from "@/utils/common";
import {
  getBucketList,
  getList,
  deleteBucket,
  deleteResource,
  createBucket,
  getBucketDomain
} from "@/service/getData";

const app = {
  state: {
    token: getToken(),
    bucketList: [],
    list: [],
    currentBucket: "",
    url: []
  },
  mutations: {
    SET_TOKEN: (state, data) => {
      state.token = data;
    },
    REMOVE_TOKEN: (state, data) => {
      state.token = data;
    },
    SET_BUCKET: (state, data) => {
      state.bucketList = data;
    },
    SET_LIST: (state, data) => {
      state.list = data;
    },
    SWITCH_BUCKET: (state, data) => {
      state.currentBucket = data;
    },
    SET_BUCKET_DOMAIN: (state, data) => {
      state.url = data;
    }
  },
  actions: {
    SetToken: ({ commit }, data) => {
      return new Promise((resolve) => {
        setToken(data);
        commit("SET_TOKEN", data);
        resolve();
      });
    },
    RemoveToken: ({ commit }) => {
      removeToken();
      commit("REMOVE_TOKEN", "");
    },
    GetBucket: ({ commit, state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        getBucketList(state.token)
          .then(it => {
            if (it.status === 200) {
              commit("SET_BUCKET", it.data);
              if (data) {
                dispatch("GetList", data);
                dispatch("GetBucketDomain");
              } else {
                if (it.data && it.data.length) {
                  dispatch("GetList", it.data[0]);
                  dispatch("GetBucketDomain");
                  commit("SWITCH_BUCKET", it.data[0]);
                }
              }
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GetList: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        getList(state.token, data)
          .then(it => {
            if (it.status === 200) {
              commit("SET_LIST", it.data.items);
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    DeleteBucket: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        deleteBucket(state.token, data)
          .then(it => {
            if (it.status === 200) {
              dispatch("GetBucket", state.currentBucket);
            }
            resolve(it);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    DeleteBucketListItem: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        deleteResource(state.token, `${state.currentBucket}:${data}`)
          .then(it => {
            if (it.status === 200) {
              dispatch("GetList", state.currentBucket);
            }
            resolve(it);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    SwitchBucket: ({ commit, dispatch }, data) => {
      commit("SWITCH_BUCKET", data);
      dispatch("GetBucket", data);
    },
    CreateBucket: ({ state, dispatch }, data) => {
      return new Promise((resolve, reject) => {
        createBucket(state.token, data.name, data.region)
          .then(it => {
            if (it.status === 200) {
              dispatch("GetBucket");
            }
            resolve(it);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    GetBucketDomain: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        getBucketDomain(state.token, state.currentBucket)
          .then(it => {
            if (it.status === 200) {
              commit("SET_BUCKET_DOMAIN", it.data);
            }
            resolve(it);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};

export default app;
