<template>
  <section>
    <header style="-webkit-app-region: drag"></header>
    <div class="bucket" v-if="options.length" style="-webkit-app-region: no-drag">
      <div class="bucket-select">
        <el-select v-model="value" placeholder="请选择空间" size="small">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div class="quit" @click="quit">
          <img src="../assets/icon_quit.svg" alt="quit">
        </div>
      </div>
      <List :bucket="value" :mac="mac" :url="url" :postData="postData" :action="action"></List>
    </div>
  </section>
</template>

<script>
import qiniu from "qiniu";
import { clipboard } from "electron";
import List from "@/components/Manage/List";
import Upload from "@/components/Upload";

export default {
  data() {
    return {
      mac: {},
      options: [],
      value: "",
      url: "",
      img: "",
      postData: {
        token: ""
      },
      AccessToken: "",
      action: ""
    };
  },
  methods: {
    quit() {
      localStorage.removeItem("obj");
      this.$electron.ipcRenderer.send("status", false);
    },
    getBuckets(msg) {
      let list = msg || JSON.parse(localStorage.obj || "[]");
      if (list.buckets) {
        list.buckets.forEach((it, index) => {
          let obj = {};
          obj["label"] = it;
          obj["value"] = it;
          this.options.push(obj);
        });
      } else {
        console.log("没有新建空间");
      }
    },
    getBucketList(url, val) {
      let config = {
        params: {
          tbl: val
        },
        headers: {
          Authorization: this.AccessToken
        }
      };
      this.myAxios
        .get(url, config)
        .then(it => {
          if (it.data.length) {
            this.url = it.data[0];
            console.log(this.url);
          }
        })
        .catch(e => {
          this.$message.error("网络错误");
        });
    },
    getZoneInfo(val) {
      // 获取上传空间的空间区域
      qiniu.zone.getZoneInfo(this.mac.accessKey, val, this.zoneInfoCallBack);
    },
    zoneInfoCallBack(...args) {
      console.log(args[1].cdnUpHosts[0]);
      this.action = "http://" + args[1].cdnUpHosts[0];
    },
    getUploadToken(val) {
      // 获取上传Token
      var options = {
        scope: val,
        expires: new Date().getTime() + 3600, // 一个小时后过期
        saveKey: `$(fname)`, // 默认使用文件名作为图片的名称
        returnBody:
          '{"fname":"$(fname)","key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      return putPolicy.uploadToken(this.mac);
    },
    getAccessToken(val) {
      // 获取认证Token
      return qiniu.util.generateAccessToken(
        this.mac,
        "http://api.qiniu.com/v6/domain/list" + "?tbl=" + val
      );
    },
    copyText(img) {
      clipboard.writeText(img);
    }
  },
  mounted() {
    let login = JSON.parse(localStorage.obj || "null");
    if (login) {
      this.getBuckets(login);
      this.mac = login.mac;
    } else {
      this.$electron.ipcRenderer.on("msg", (event, files) => {
        this.getBuckets(files);
        this.mac = files.mac;
      });
    }
    // let bucket = JSON.parse(localStorage.obj || "[]");
    // let value = bucket.buckets[0];
    // this.postData.token = this.getUploadToken(this.value);
    // this.AccessToken = this.getAccessToken(value);
    // this.getZoneInfo(value);
    // this.getBucketList("http://api.qiniu.com/v6/domain/list", value);
    // this.value = value
    // console.log(this.value,value)
  },
  watch: {
    value(val, oldVal) {
      this.postData.token = this.getUploadToken(val);
      this.AccessToken = this.getAccessToken(val);
      this.getZoneInfo(val);
      this.getBucketList("http://api.qiniu.com/v6/domain/list", val);
    }
  },
  components: {
    List,
    Upload
  }
};
</script>

<style lang="scss" scoped>
header {
  height: 25px;
}
.bucket {
  padding: 20px;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // text-align: center;
  .bucket-select {
    margin-bottom: 10px;
    position: relative;
    .quit {
      position: absolute;
      top: 0;
      right: 0;
      width: 25px;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .bucket-img {
    white-space: nowrap;
    span {
      color: #ff3e3e;
    }
  }
  .copy {
    margin-left: 10px;
    border: 0;
    padding: 5px 10px;
    border-radius: 4px;
    background: #2c9cfb;
    color: #fff;
  }
}
</style>
