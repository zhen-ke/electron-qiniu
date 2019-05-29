<template>
  <section class="app-main">
    <p
      class="uploadImage"
      @click="uploadImageVisible = true"
    >上传</p>
    <el-dialog
      title="上传图片"
      :visible.sync="uploadImageVisible"
      class="upload"
    >
      <el-upload
        class="upload"
        drag
        :action="action"
        :on-success='handleSuccess'
        :on-error="handleError"
        :before-upload="beforeUpload"
        :data="uploadData"
        :show-file-list="false"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          拖拽文件或者
          <em>点击上传</em>
        </div>
        <div
          class="el-upload__tip"
          slot="tip"
        >只能上传 JPG/PNG/GIF 文件，且不超过 50M</div>
      </el-upload>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="uploadImageVisible = false"
          size="small"
        >关闭</el-button>
        <!-- <el-button type="primary" @click="cancel({type:'on',data:{}})">确 定</el-button> -->
      </div>
    </el-dialog>
  </section>
</template>

<script>
import qiniu from "qiniu";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      action: "", // 上传的地址
      uploadData: {}, // 上传时附带的额外参数
      uploadImageVisible: false,
      img: ""
    };
  },
  computed: {
    ...mapGetters(["token", "currentBucket"])
  },
  methods: {
    handleSuccess() {
      this.uploadImageVisible = false;
      this.$message.success("上传成功");
      this.$store.dispatch("GetList", this.currentBucket);
    },
    handleError() {
      this.uploadImageVisible = false;
      this.$message.error("上传失败");
    },
    // 在图片提交前进行验证
    beforeUpload(file) {
      const isRightType =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 50MB!");
      }
      return isRightType && isLt2M;
    },
    // 获取上传地址
    getUploadAddress() {
      qiniu.zone.getZoneInfo(
        this.token.accessKey,
        this.currentBucket,
        (...args) => {
          this.action = "http://" + args[1].cdnUpHosts[0];
        }
      );
    },
    // 获取上传 Token
    getUploadToken() {
      var options = {
        scope: this.currentBucket,
        expires: new Date().getTime() + 3600, // 一个小时后过期
        saveKey: `$(fname)`, // 默认使用文件名作为图片的名称
        returnBody:
          '{"fname":"$(fname)","key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
      };
      let putPolicy = new qiniu.rs.PutPolicy(options);
      this.uploadData.token = putPolicy.uploadToken(this.token);
    }
  },
  watch: {
    currentBucket() {
      this.getUploadAddress();
      this.getUploadToken();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  .uploadImage {
    background: url("./../assets/upload.png") no-repeat;
    background-size: 20px 20px;
    width: 70px;
    height: 20px;
    padding-left: 30px;
  }
  .upload {
    text-align: center;
    img {
      width: 100%;
      height: auto;
    }
    .dialog-footer {
      text-align: right;
    }
  }
}
</style>

