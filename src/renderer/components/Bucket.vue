<template>
  <section>
    <el-container>
      <el-header style="-webkit-app-region: drag">
        <Header
          :url="url"
          :postData="postData"
          :action="action"
        />
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
import Header from "@/components/Header";
import List from "@/components/List";
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
            console.log("getBucketList", this.url);
          } else {
            console.log("无法获取到域名");
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
    },
    url(a,b) {
      console.log(a,b)
    },
    postData(a,b) {
      console.log(a,b)
    },
    action(a,b) {
      console.log(a,b)
    }
  },
  components: {
    List,
    UploadImage,
    CreateBucket,
    BucketList,
    Header
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
