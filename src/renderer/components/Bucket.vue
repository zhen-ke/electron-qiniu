<template>
  <section>
    <el-container>
      <el-header style="-webkit-app-region: drag">
        <h1 class="logo">
          <img
            src="../../../static/image/logo.png"
            alt="logo"
          >
        </h1>
        <div
          class="quit"
          @click="quit"
        >
          <img
            src="../../../static/image/quit.svg"
            alt="quit"
          >
        </div>
        <UploadImage class="addimg"></UploadImage>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <CreateBucket />
          <BucketList @onSwitchBucketList="updateSwitchBucketList" />
        </el-aside>
        <el-main>
          <List
            :bucket="currentBucket"
            :mac="mac"
            :url="url"
            :postData="postData"
            :action="action"
            v-if="bucketList.length"
          />
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<script>
import qiniu from "qiniu";
import { mapState } from "vuex";
import {
  getBucketList,
  deleteBucket,
  getBucketDomain
} from "@/service/getData.js";
import { clipboard } from "electron";
import List from "@/components/Manage/List";
import Upload from "@/components/Upload";
import UploadImage from "@/components/UploadImage";
import CreateBucket from "@/components/CreateBucket";
import BucketList from "@/components/BucketList";

export default {
  data() {
    return {
      currentBucket: "",
      url: "",
      img: "",
      postData: {
        token: ""
      },
      AccessToken: "",
      action: "",
      addDialogVisible: false,
      form: {
        name: "",
        region: ""
      }
    };
  },
  methods: {
    // getBucket() {
    //   getBucketList(this.mac)
    //     .then(it => {
    //       if (it.data.length) {
    //         this.options = it.data;
    //         this.currentBucket = it.data[0];
    //         this.getBucketDomain(this.mac, this.currentBucket);
    //       }
    //     })
    //     .catch(e => {
    //       this.$message.error("accessKey 或者 secretKey 错误");
    //     });
    // },
    updateSwitchBucketList(currentBucket) {
      this.currentBucket = currentBucket;
    },
    quit() {
      localStorage.removeItem("obj");
      this.$electron.ipcRenderer.send("status", false);
    },
    getBucketDomain(mac, data) {
      console.log(data);
      getBucketDomain(mac, data)
        .then(it => {
          console.log(it);
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
    copyText(img) {
      clipboard.writeText(img);
    }
  },
  computed: {
    ...mapState(["bucketList", "mac"])
  },
  mounted() {
    console.log(qiniu)
    const mac = JSON.parse(localStorage.mac || "null");
    if (mac) {
      this.$store.commit({
        type: "STORE_MAC",
        data: mac
      });
      this.$store.dispatch("getBucketList");
    } else {
      // this.$electron.ipcRenderer.on("msg", (event, files) => {
      //   this.mac = files.mac;
      //   this.$store.dispatch("getBucketList");
      // });
    }
  },
  watch: {
    currentBucket(val, oldVal) {
      this.postData.token = this.getUploadToken(val);
      // this.AccessToken = this.getAccessToken(val);
      this.getZoneInfo(val);
      this.getBucketDomain(this.mac, val);
    }
  },
  components: {
    List,
    Upload,
    UploadImage,
    CreateBucket,
    BucketList
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
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
      width: 15px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .addimg {
      position: absolute;
      left: 200px;
      bottom: 20px;
      font-size: 12px;
      line-height: 22px;
    }
  }
  .el-aside {
    border-right: solid 1px #ebeef5;
    background: #fff;
  }
  .el-main {
    padding: 0;
  }
}
</style>
