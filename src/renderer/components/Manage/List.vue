<template>
  <div class="privileges-table">
    <el-table
      :data="filterTableData"
      style="width: 100%"
      v-loading="loading"
      max-height="590"
      size="small"
    >
      <el-table-column
        prop="key"
        label="文件名"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="fsize"
        label="文件大小"
        sortable
      >
      </el-table-column>
      <el-table-column label="存储类型">
        <template slot-scope="scope">
          <i class="el-icon-document"></i>
          <span style="margin-left: 5px">{{ scope.row.mimeType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最后更新"
        width="160"
      >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 5px">{{ scope.row.putTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="205"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-zoom-in"
            @click="preview(scope.$index, scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >复制</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <Dialog
        :url="url"
        :postData="postData"
        :action="action"
        @onData="updateData"
      ></Dialog>
    </el-dialog>
    <el-dialog
      title="预览"
      :visible.sync="PreviewDialogVisible"
      width="75%"
      class="previewimg"
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
  </div>
</template>

<script>
import { deleteResource , getList } from "@/service/getData.js";
import qiniu from "qiniu";
import { clipboard } from "electron";
import Dialog from "@/components/Manage/Dialog";
import Pagination from "@/components/Manage/Pagination";
import { mapState } from "vuex";
export default {
  props: {
    bucket: {
      type: String
    },
    mac: {
      type: Object
    },
    url: {
      type: String
    },
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
      tableData: [],
      loading: false,
      rowList: {},
      dialogFormVisible: false,
      PreviewDialogVisible: false,
      currIndex: null,
      title: "",
      addStatus: false,
      search: "",
      AccessToken: "", // 存储空间列表 Authorization
      deleteAccessToken: "", // 删除资源 Authorization
      EncodedEntryURI: "", // 删除资源
      previewUrl: ""
    };
  },
  methods: {
    close() {
      this.$store.commit({
        type: "ADD_IMAGE",
        data: false
      });
    },
    delete(data) {
      deleteResource(this.mac, data)
        .then(it => {
          this.$message.success("删除成功");
        })
        .catch(e => {
          this.$message.error("资源不存在");
        });
    },
    timetrans(date) {
      var date = new Date(date); //如果date为13位不需要乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    formatter(row, column) {
      return row.type;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    preview(index, row) {
      this.PreviewDialogVisible = true;
      this.previewUrl = "http://" + this.url + "/" + row.key;
    },
    copy() {
      this.PreviewDialogVisible = false;
      if (this.previewUrl) {
        clipboard.writeText(this.previewUrl);
        this.$message.success("复制成功");
      } else {
        this.$message.success("复制失败");
      }
    },
    download() {
      this.$refs.img.click();
      this.PreviewDialogVisible = false;
    },
    handleEdit(index, row) {
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
          this.$delete(this.tableData, index, this.tableData[index]);
          let entry = `${this.bucket}:${row.key}`;
          this.delete(entry);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // changeStatus(data) {
    //   this.dialogFormVisible = data;
    //   this.addStatus = false;
    // },
    updateData(msg) {
      this._getData(this.mac,this.bucket);
    },
    _getData: function(mac,bucket) {
      this.loading = true;
      getList(mac,bucket)
        .then(it => {
          if (it.data.items.length) {
            this.loading = false;
            let array = [];
            let obj = {};
            it.data.items.forEach(it => {
              obj.key = it.key;
              obj.hash = it.hash;
              obj.fsize = (it.fsize / 1024).toFixed(2) + " KB";
              obj.mimeType = it.mimeType;
              obj.putTime = this.timetrans(it.putTime / 10000);
              obj.type = it.type === 0 ? "普通存储" : "低频存储";
              obj.status = it.status;
              array.push(obj);
              obj = {};
            });
            this.tableData = array;
          } else {
            this.loading = false;
            this.tableData = [];
          }
        })
        .catch(e => {
          this.loading = false;
          this.$message.error("网络错误");
        });
    },
    updateSearch(msg) {
      this.search = msg;
    }
  },
  computed: {
    ...mapState(["visible"]),
    filterTableData() {
      if (this.search.length > 0) {
        return this.tableData.filter(it => {
          return it.key.indexOf(this.search) !== -1;
        });
      } else {
        return this.tableData;
      }
    }
  },
  mounted() {
    if (this.bucket) {
      this._getData(this.mac,this.bucket);
    }
  },
  watch: {
    visible(newVal, oldVal) {
      if (newVal) {
        this.dialogFormVisible = true;
        this.title = "上传图片";
        this.addStatus = true;
      } else {
        this.dialogFormVisible = false;
        this.addStatus = false;
      }
    },
    bucket(newVal, oldVal) {
      if (newVal) {
        this._getData(this.mac,newVal);
      }
    }
  },
  components: {
    Dialog,
    Pagination
  }
};
</script>

<style lang='scss' scoped>
.privileges-table {
  .table-hd {
    padding: 15px 0;
  }
  .pagination {
    background-color: #fff;
    padding: 15px 0;
    text-align: right;
  }
  .previewimg {
    text-align: center;
    img {
      max-width: 600px;
      max-height: 300px;
    }
  }
}
</style>
