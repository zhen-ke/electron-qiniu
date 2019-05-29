<template>
  <div class="privileges-table">
    <el-table
      :data="list"
      style="width: 100%"
      v-loading="loading"
      min-height="590px"
      size="small"
    >
      <el-table-column
        prop="key"
        label="文件名"
        width="200"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="fsize"
        label="文件大小"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="存储类型"
        sortable
        prop="mimeType"
      >
        <template slot-scope="scope">
          <i class="el-icon-document"></i>
          <span style="margin-left: 5px">{{ scope.row.mimeType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最后更新"
        width="160"
        sortable
        prop="putTime"
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 5px">{{ scope.row.putTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="210"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-zoom-in"
            :disabled="!Boolean(url.length)"
            @click="preview(scope.$index, scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="!Boolean(url.length)"
            @click="handleCopy(scope.$index, scope.row)"
          >复制</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Preview
      :previewUrl="previewUrl"
      :previewVisible="previewVisible"
      @changePreviewVisible="it => previewVisible = it"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Preview from "@/components/Preview";
import { clipboard } from "electron";

export default {
  data() {
    return {
      loading: false,
      previewVisible: false,
      previewUrl: ""
    };
  },
  methods: {
    preview(index, row) {
      this.previewUrl = "http://" + this.url[0] + "/" + row.key;
      this.previewVisible = true;
    },
    handleCopy(index, row) {
      let copyurl = "http://" + this.url + "/" + row.key;
      if (this.url && row.key) {
        clipboard.writeText(copyurl);
        this.$message.success("复制成功");
      } else {
        this.$message.success("复制失败");
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("DeleteBucketListItem", row.key)
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
    ...mapGetters(["list", "url"])
  },
  components: {
    Preview
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.privileges-table {
  .previewimg {
    text-align: center;
    img {
      max-width: 600px;
      max-height: 300px;
    }
  }
}
</style>
