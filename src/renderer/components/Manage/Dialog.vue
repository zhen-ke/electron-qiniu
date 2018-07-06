<template>
  <div class="dialog">
    <Upload :url="url" :postData="postData" :action="action" @onUpload="updatedUpload"></Upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="cancel({type: 'off'})" size="small">关闭</el-button>
      <!-- <el-button type="primary" @click="cancel({type:'on',data:{}})">确 定</el-button> -->
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload";
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
    return {};
  },
  methods: {
    updatedUpload() {
      this.$emit("onData");
    },
    cancel(msg) {
      // let type = msg.type;
      // switch (type) {
      //   case "on": {
      //     this.$emit("upData", { ...this.editData });
      //     break;
      //   }
      //   case "off": {
      //     break;
      //   }
      // }
      this.$store.commit({
        type: "ADD_IMAGE",
        data: false
      });
    }
  },
  components: {
    Upload
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  .dialog-footer {
    text-align: right;
  }
}
</style>
