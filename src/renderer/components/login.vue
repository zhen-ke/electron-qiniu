<template>
  <div class="form">
    <form>
      <h2 class="title">登录</h2>
      <div class="form-group">
        <!-- <label for="AccessKey">AccessKey</label> -->
        <input type="password" class="form-control" id="AccessKey" v-model="mac.accessKey" placeholder="AccessKey">
      </div>
      <div class="form-group">
        <!-- <label for="SecretKey">SecretKey</label> -->
        <input type="password" class="form-control" id="SecretKey" v-model="mac.secretKey" placeholder="SecretKey">
      </div>
      <button type="submit" class="btn btn-default" @click.prevent="getBucket">确定</button>
    </form>
  </div>
</template>

<script>
import qiniu from "qiniu";
import Util from "./../utils/util";

export default {
  data() {
    return {
      mac: {
        accessKey: "",
        secretKey: ""
      },
      AccessToken: ''
    };
  },
  methods: {
    getBucket() {
      let config = {
        headers: {
          Authorization: this.AccessToken
        }
      };
      this.myAxios
        .get("http://rs.qbox.me/buckets", config)
        .then(it => {
          if (it.data.length) {
            let data = {
              buckets: it.data,
              mac: {
                accessKey: this.mac.accessKey,
                secretKey: this.mac.secretKey
              }
            };
            this.$electron.ipcRenderer.send("bucketsList", data);
          }
        })
        .catch(e => {
          console.log("accessKey 或者 secretKey 错误");
        });
    }
  },
  mounted() {
    this.AccessToken = qiniu.util.generateAccessToken(this.mac,"http://rs.qbox.me/buckets")
    console.log(qiniu)
  }
};
</script>

<style>
.form form {
  width: 300px;
  margin: 0 auto;
  background: #fff;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 30px;
}

.form form .title {
  text-align: center;
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 15px;
  color: #007af5;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
}

.form-control {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 0;
  border-radius: 4px;
  color: #fff;
  background-color: #007af5;
  border-color: #ccc;
  width: 100%;
}
</style>