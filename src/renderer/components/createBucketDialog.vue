<template>
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
        @click="closeDialog"
      >取 消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="confirmAddBucket"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    form: {
      type: Object
    },
    addDialogVisible: {
      type: Boolean
    }
  },
  methods: {
    closeDialog() {
      this.$emit('onHandleCloseDialog')
    },
    confirmAddBucket() {
      this.$emit('onHandleConfirmAddBucket')
    }
  }
};
</script>

<style>
</style>
