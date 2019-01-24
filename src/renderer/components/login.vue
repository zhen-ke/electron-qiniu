<template>
  <section
    style="-webkit-app-region: drag"
    class="login"
  >
    <div class="form">
      <form>
        <h2 class="title">登录</h2>
        <div class="form-group">
          <!-- <label for="AccessKey">AccessKey</label> -->
          <input
            type="password"
            class="form-control"
            id="AccessKey"
            v-model="mac.accessKey"
            placeholder="AccessKey"
          >
        </div>
        <div class="form-group">
          <!-- <label for="SecretKey">SecretKey</label> -->
          <input
            type="password"
            class="form-control"
            id="SecretKey"
            v-model="mac.secretKey"
            placeholder="SecretKey"
          >
        </div>
        <el-button
          type="primary"
          @click.prevent="getBucket"
          size="small"
          class="btn"
        >确定</el-button>
      </form>
    </div>
  </section>
</template>

<script>
import { storageList } from "./../service/getData.js";

export default {
  data() {
    return {
      mac: {
        accessKey: "",
        secretKey: ""
      },
    };
  },
  methods: {
    getBucket() {
      if (this.mac.accessKey === "" || this.mac.secretKey === "") {
        this.$message.error("accessKey/secretKey不能为空");
      } else {
        storageList(this.mac)
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
              localStorage.obj = JSON.stringify(data);
            }
          })
          .catch(e => {
            this.$message.error("accessKey 或者 secretKey 错误");
          });
      }
    },
    checkLogin() {
      let login = JSON.parse(localStorage.obj || "null");
      if (login) {
        this.$electron.ipcRenderer.send("status", true);
      }
    }
  },
  created() {
    this.checkLogin();
  }
};
</script>

<style scoped>
.login {
  background: #409eff;
  width: 100%;
  height: 100%;
}
.form form {
  width: 300px;
  margin: 0 auto;
  background: #fff;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 30px;
}

.form form .title {
  text-align: center;
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 15px;
  color: #409eff;
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
  border: 1px solid #d7dae2;
  border-radius: 4px;
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.btn {
  width: 100%;
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #d7dae2;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #d7dae2;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #d7dae2;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #d7dae2;
}
</style>