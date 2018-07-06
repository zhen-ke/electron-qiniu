<template>
  <section>
    <el-container>
      <el-header style="-webkit-app-region: drag">
        <h1 class="logo">
          <img src="../../../static/image/logo.png" alt="logo">
        </h1>
        <div class="quit" @click="quit">
          <img src="../../../static/image/quit.svg" alt="quit">
        </div>
        <AddImage class="addimg"></AddImage>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <h4 class="title">存储空间列表</h4>
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item :index="''+index" v-for="(item,index) in options" :key="index" @click="value = item.value">
              <i class="icon"></i>
              <span slot="title">{{item.value}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div class="bucket" v-if="options.length" style="-webkit-app-region: no-drag">
            <List :bucket="value" :mac="mac" :url="url" :postData="postData" :action="action"></List>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<script>
import qiniu from "qiniu";
import { clipboard } from "electron";
import List from "@/components/Manage/List";
import Upload from "@/components/Upload";
import AddImage from "@/components/AddImage";

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
      let value = login.buckets[0];
      this.value = value;
    } else {
      this.$electron.ipcRenderer.on("msg", (event, files) => {
        this.getBuckets(files);
        this.mac = files.mac;
        let value = files.buckets[0];
        this.value = value;
      });
    }
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
    Upload,
    AddImage
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 650px;
  .el-header {
    background-color: #409eff;
    color: #fff;
    position: relative;
    .logo {
      width: 125px;
      height: 29px;
      margin-top: 22px;
      img {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }
    .quit {
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 20px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .addimg {
      position: absolute;
      left: 200px;
      bottom: 20px;
    }
  }
  .el-aside {
    border-right: solid 1px #EBEEF5;
    background: #fff;
    .title {
      font-weight: normal;
      font-size: 12px;
      padding: 10px;
      color: #909399;
    }
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: normal;
      display: inline-block;
      width: 130px;
    }
    .icon {
      background: url("../../../static/image/data.png") no-repeat;
      width: 18px;
      height: 18px;
      background-size: contain;
      display: inline-block;
      margin-right: 5px;
    }
    .el-menu {
      border: 0;
      .el-menu-item,
      .el-submenu__title {
        height: 40px;
        line-height: 40px;
      }
      .is-active {
        background-color: #ecf5ff;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: #409eff;
        }
      }
    }
  }
  .el-main {
    padding: 0;
  }
}
.bucket {
  .bucket-select {
    margin-bottom: 10px;
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
