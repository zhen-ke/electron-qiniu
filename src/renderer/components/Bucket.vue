<template>
  <section>
    <el-container>
      <el-header style="-webkit-app-region: drag">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar
            :options="options"
            :mac="mac"
            :form='form'
            @onHandleItem="updateHandleItem"
            @onHandleGetBucket="updateHandleGetBucket"
          />
        </el-aside>
        <el-main>
          <div
            class="bucket"
            v-if="options.length"
            style="-webkit-app-region: no-drag"
          >
            <List
              :bucket="value"
              :mac="mac"
              :url="url"
              :postData="postData"
              :action="action"
            ></List>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<script>
import {
  getBucketList,
  deleteBucket,
  createBucket,
  getBucketDomain
} from "@/service/getData.js";
import qiniu from "qiniu";
import { clipboard } from "electron";
import List from "@/components/Manage/List";
import Upload from "@/components/Upload";
import Header from "./Header";
import Sidebar from "./Sidebar";
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
      action: "",
      addDialogVisible: false,
      form: {
        name: "",
        region: ""
      }
    };
  },
  methods: {
    // Sidebar 切换 Bucket 列表
    updateHandleItem(item) {
      this.value = item;
    },
    // Sidebar 删除 Bucket 列表
    updateHandleGetBucket() {
      this.getBucket();
    },
    getBucket() {
      getBucketList(this.mac)
        .then(it => {
          if (it.data.length) {
            this.options = it.data;
            this.value = it.data[0];
            this.getBucketDomain(this.mac, this.value);
          }
        })
        .catch(e => {
          this.$message.error("accessKey 或者 secretKey 错误");
        });
    },
    addBucket() {
      this.addDialogVisible = false;
      createBucket(this.mac, this.form.name, this.form.region)
        .then(it => {
          if (it.status === 200) {
            this.form.name = "";
            this.form.region = "";
            this.$message.success("添加成功");
            this.getBucket();
          }
        })
        .catch(e => {
          this.$message.error("添加失败");
        });
    },

    // getBuckets(msg) {
    //   let list = msg || JSON.parse(localStorage.obj || "[]");
    //   if (list.buckets) {
    //     this.options = list.buckets;
    //     // list.buckets.forEach((it, index) => {
    //     //   let obj = {};
    //     //   obj["label"] = it;
    //     //   obj["value"] = it;
    //     //   this.options.push(obj);
    //     // });
    //   } else {
    //     console.log("没有新建空间");
    //   }
    // },
    getBucketDomain(mac, data) {
      console.log(data);
      getBucketDomain(mac, data)
        .then(it => {
          if (it.data.length) {
            this.url = it.data[0];
            console.log('getBucketList',this.url);
          }else {
            console.log('无法获取到域名')
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
    // getAccessToken(val) {
    //   // 获取认证Token
    //   return qiniu.util.generateAccessToken(
    //     this.mac,
    //     "http://api.qiniu.com/v6/domain/list" + "?tbl=" + val
    //   );
    // },
    copyText(img) {
      clipboard.writeText(img);
    }
  },
  mounted() {
    let login = JSON.parse(localStorage.obj || "null");
    if (login) {
      // this.getBuckets(login);
      this.mac = login.mac;
      this.getBucket();
      // this.value = this.options[0];
      // let value = login.buckets[0];
      // this.value = value;
    } else {
      this.$electron.ipcRenderer.on("msg", (event, files) => {
        // this.getBuckets(files);
        this.mac = files.mac;
        this.getBucket();
        // this.value = this.options[0];
        // let value = files.buckets[0];
        // this.value = value;
      });
    }
  },
  watch: {
    value(val, oldVal) {
      this.postData.token = this.getUploadToken(val);
      // this.AccessToken = this.getAccessToken(val);
      this.getZoneInfo(val);
      this.getBucketDomain(this.mac, val);
    }
  },
  components: {
    List,
    Upload,
    Header,
    Sidebar
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
