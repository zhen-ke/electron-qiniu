<template>
  <p class="upload" @click="add">上传</p>
</template>

<script>
export default {
  methods: {
    add() {
      this.$store.commit({
        type: "ADD_IMAGE",
        data: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload {
  background: url("../../../static/image/upload.png") no-repeat;
  background-size: 20px 20px;
  width: 70px;
  height: 20px;
  padding-left: 30px;
}
</style>

