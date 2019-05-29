<template>
  <section>
    <h4 class="title">存储空间列表
      <i
        class="el-icon-plus add"
        @click="dialogVisible = true"
      ></i>
    </h4>
    <el-dialog
      title="添加存储空间"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="createBucket"
        :model="form"
        size="small"
      >
        <el-form-item
          label="存储空间名称"
          prop="name"
          :rules="{ required: true, message: '存储空间名称为空', trigger: 'blur' }"
        >
          <el-input
            v-model="form.name"
            placeholder="请输入存储空间名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="存储区域"
          prop="region"
          :rules="{ required: true, message: '存储区域为空', trigger: 'blur' }"
        >
          <el-select
            v-model="form.region"
            placeholder="请选择存储区域"
            style="width: 100%"
          >
            <el-option
              :label="value"
              :value="key"
              v-for="(value, key) in regionList"
              :key="key"
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
          @click="cancel('createBucket')"
        >取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitForm('createBucket')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: "",
        region: ""
      },
      regionList: {
        z0: "华东",
        z1: "华北",
        z2: "华南",
        na0: "北美",
        as0: "东南亚"
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("CreateBucket", {
              name: this.form.name,
              region: this.form.region
            })
            .then(it => {
              if (it.status === 200) {
                this.$message.success("添加成功");
                this.cancel("createBucket");
              }
            })
            .catch(() => {
              this.$message.error("添加失败");
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel(formName) {
      this.resetForm(formName);
      this.dialogVisible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
