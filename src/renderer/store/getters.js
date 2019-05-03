import { timetrans } from "@/utils/common";

const getters = {
  token: state => state.app.token,
  bucketList: state => state.app.bucketList,
  currentBucket: state => state.app.currentBucket,
  url: state => state.app.url,
  list: state =>
    state.app.list.map(it => {
      it.fsize = (it.fsize / 1024) > 1024 ? (it.fsize / 1024 / 1024).toFixed(2) + " MB" : (it.fsize / 1024).toFixed(2) + " KB";
      it.type = it.type === 0 ? "普通存储" : "低频存储";
      it.putTime = timetrans(it.putTime / 10000);
      return it;
    })
};
export default getters;
