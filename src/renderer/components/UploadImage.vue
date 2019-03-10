<template>
  <section>
    <p
      class="uploadImage"
      @click="uploadImageVisible = true"
    >上传</p>
    <el-dialog
      title="上传图片"
      :visible.sync="uploadImageVisible"
    >
      <el-upload
        class="upload"
        drag
        :action="action"
        :on-success='handleSuccess'
        :on-error="handleError"
        :before-upload="beforeUpload"
        :data="postData"
        :show-file-list="false"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
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
export default {
  props: {
    action: {
      type: String
    },
    postData: {
      type: Object
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      uploadImageVisible: false,
      img: ""
    };
  },
  methods: {
    handleSuccess(res, file) {
      // 上传成功后在图片框显示图片
      this.img = "http://" + this.url + "/" + res.key;
      this.uploadImageVisible = false
      this.$message.success("上传成功");
      // 上传成功后要刷新列表（缺少）
    },
    handleError(res) {
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
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 50MB!");
      }
      return isRightType && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.uploadImage {
  background: url("../../../static/image/upload.png") no-repeat;
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
}
.dialog-footer {
  text-align: right;
}
</style>

