<template>
  <el-menu
    default-active="0"
    class="el-menu-vertical-demo"
  >
    <el-menu-item
      :index="''+index"
      v-for="(item,index) in bucketList"
      :key="index"
      @click="switchBucketList(item)"
    >
      <i class="icon"></i>
      <span slot="title">{{item}}</span>
      <i
        class="el-icon-delete delete"
        @click.stop.prevent="beforeDelete(item)"
      ></i>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
import { deleteBucket } from "@/service/getData.js";
export default {
  data() {
    return {};
  },
  methods: {
    switchBucketList(data) {
      this.$emit("onSwitchBucketList", data);
    },
    deleteBucket(data) {
      deleteBucket(this.mac, data)
        .then(it => {
          if (it.status === 200) {
            this.$message.success("删除成功");
            this.$store.dispatch("getBucketList");
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
    }
  },
  computed: {
    ...mapState(["bucketList", "mac"])
  }
};
</script>

<style lang="scss" scoped>
.delete {
  position: absolute;
  right: 0;
  top: 12px;
  color: #f36d6e;
}
span {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  display: inline-block;
  width: 130px;
}
.icon {
  background: url("../assets/data.png") no-repeat;
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
</style>
