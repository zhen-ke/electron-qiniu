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
        <AddImage class="addimg"></AddImage>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <h4 class="title">存储空间列表
            <i
              class="el-icon-plus add"
              @click="addDialogVisible = true"
            ></i>
          </h4>
          <el-menu
            default-active="0"
            class="el-menu-vertical-demo"
          >
            <el-menu-item
              :index="''+index"
              v-for="(item,index) in options"
              :key="index"
              @click="value = item"
            >
              <i class="icon"></i>
              <span slot="title">{{item}}</span>
              <i
                class="el-icon-delete delete"
                @click.stop.prevent="beforeDelete(item)"
              ></i>
            </el-menu-item>
          </el-menu>
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
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="存储空间名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="存储区域">
          <el-select
            v-model="form.region"
            placeholder="请选择存储区域"
          >
            <el-option
              label="华东"
              value="z0"
            ></el-option>
            <el-option
              label="华北"
              value="z1"
            ></el-option>
            <el-option
              label="华南"
              value="z2"
            ></el-option>
            <el-option
              label="北美"
              value="na0"
            ></el-option>
            <el-option
              label="东南亚"
              value="as0"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="addDialogVisible = false"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="addBucket"
        >确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { storageList, dropStorage ,addBucket} from "./../service/getData.js";
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
      action: "",
      addDialogVisible: false,
      form: {
        name: "",
        region: ""
      }
    };
  },
  methods: {
    deleteBucket(data) {
      dropStorage(this.mac, data)
        .then(it => {
          if (it.status === 200) {
            this.$message.success("删除成功");
            this.getBucket();
          }
        })
        .catch(e => {
          this.$message.error("删除失败");
        });
    },
    beforeDelete(data) {
      this.$confirm("此操作将永久删除该空间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteBucket(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getBucket() {
      storageList(this.mac)
        .then(it => {
          if (it.data.length) {
            this.options = it.data;
            this.value = it.data[0];
            this.getBucketList(this.value);
          }
        })
        .catch(e => {
          this.$message.error("accessKey 或者 secretKey 错误");
        });
    },
    addBucket() {
      this.addDialogVisible = false;
        addBucket(this.mac, this.form.name, this.form.region)
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
    quit() {
      localStorage.removeItem("obj");
      this.$electron.ipcRenderer.send("status", false);
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
    getBucketList(val) {
      console.log(val);
      let token = qiniu.util.generateAccessToken(
        this.mac,
        "http://api.qiniu.com/v6/domain/list" + "?tbl=" + val
      );
      let config = {
        params: {
          tbl: val
        },
        headers: {
          Authorization: token
        }
      };
      this.myAxios
        .get("http://api.qiniu.com/v6/domain/list", config)
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
      this.getBucketList(val);
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
    .delete {
      position: absolute;
      right: 0;
      top: 12px;
      color: #f36d6e;
    }
    .title {
      font-weight: normal;
      font-size: 12px;
      padding: 10px;
      color: #909399;
      overflow: hidden;
      .add {
        float: right;
        background: #409eff;
        border-radius: 100%;
        padding: 2px;
        color: #fff;
        cursor: pointer;
      }
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
        position: relative;
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
