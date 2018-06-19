<template>
  <div class="bucket" v-if="options.length">
    <div class="bucket-select">
      <el-select v-model="value" placeholder="请选择空间">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="bucket-upload">
      <el-upload class="upload" drag :action="action" :on-success='handleSuccess' :on-error="handleError" :before-upload="beforeUpload" :data="postData" :show-file-list="false" multiple>
        <img v-if="img" :src="img">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png/gif文件，且不超过5M</div>
      </el-upload>
    </div>
    <p class="bucket-img" v-if="img">图片地址：
      <span>{{img}}</span>
      <button type="button" class="copy" @click="copyText(img)">复制</button>
    </p>
  </div>
</template>

<script>
import qiniu from "qiniu";
import { clipboard } from "electron";

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
        .catch(e => {});
    },
    handleSuccess(res, file) {
      // 上传成功后在图片框显示图片
      this.img = "http://" + this.url + "/" + res.key;
      this.$message.success("上传成功");
    },
    handleError(res) {
      // 显示错误
      this.$message.error("上传失败");
    },
    beforeUpload(file) {
      // 在图片提交前进行验证
      const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 50;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isRightType && isLt2M;
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
        expires: new Date().getTime() + 3600,
        returnBody:
          '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
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
  },
  watch: {
    value(val, oldVal) {
      this.postData.token = this.getUploadToken(val);
      this.AccessToken = this.getAccessToken(val);
      this.getZoneInfo(val);
      this.getBucketList("http://api.qiniu.com/v6/domain/list", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.bucket {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  .bucket-select {
    margin-bottom: 50px;
  }
  .bucket-upload {
    margin-bottom: 50px;
    img {
      width: 100%;
      height: auto;
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
