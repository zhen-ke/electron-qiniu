<template>
  <el-menu default-active="0">
    <el-menu-item
      :index="''+index"
      v-for="(item,index) in bucketList"
      :key="index"
      @click="switchBucket(item)"
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    switchBucket(data) {
      this.$store.dispatch("SwitchBucket", data);
    },
    beforeDelete(data) {
      this.$confirm("此操作将永久删除该空间, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("DeleteBucket", data)
            .then(() => {
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message.error("删除失败");
            });
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
    ...mapGetters(["bucketList"])
  },
  mounted() {
    this.$store.dispatch("GetBucket");
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
