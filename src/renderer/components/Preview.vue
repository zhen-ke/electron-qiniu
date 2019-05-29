<template>
  <el-dialog
    title="预览"
    :visible.sync="visible"
    width="70%"
    class="previewimg"
    @close="handleClose"
  >
    <img
      :src="previewUrl"
      alt="previewimg"
    >
    <a
      :href="previewUrl"
      download="previewUrl"
      ref="img"
    ></a>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="mini"
        @click="copy"
      >复制</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="download"
      >下载</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { clipboard } from "electron";

export default {
  props: {
    previewVisible: {
      type: Boolean
    },
    previewUrl: {
      type: String
    }
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handleClose() {
      this.$emit("changePreviewVisible", false);
    },
    copy() {
      if (this.previewUrl) {
        clipboard.writeText(this.previewUrl);
        this.handleClose();
        this.$message.success("复制成功");
      } else {
        this.$message.success("复制失败");
      }
    },
    download() {
      this.$refs.img.click();
      this.handleClose();
    }
  },
  watch: {
    previewVisible(newVal) {
      this.visible = newVal;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
img {
  width: 50%;
}
</style>
