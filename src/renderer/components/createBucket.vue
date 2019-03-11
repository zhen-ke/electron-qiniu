<template>
  <div>
    <h4 class="title">存储空间列表
      <i
        class="el-icon-plus add"
        @click="addDialogVisible = true"
      ></i>
    </h4>
    <create-bucket-dialog
      :addDialogVisible="addDialogVisible"
      :form="form"
      @onHandleCloseDialog="updateHandleCloseDialog"
      @onHandleConfirmAddBucket="updateHandleConfirmAddBucket"
    />
  </div>
</template>

<script>
import createBucketDialog from "./createBucketDialog";

export default {
  props: {
    form: {
      type: Object
    }
  },
  data() {
    return {
      addDialogVisible: false
    };
  },
  methods: {
    updateHandleCloseDialog() {
      this.addDialogVisible = false
    },
    updateHandleConfirmAddBucket() {
      this.$emit("onHandleGetBucket");
    }
  },
  components: {
    createBucketDialog
  }
};
</script>

<style lang="scss" scoped>
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
</style>
