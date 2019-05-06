<template>
  <div class="header">
    <h1 class="logo">
      <img
        :src="logo"
        alt="logo"
      >
    </h1>
    <p
      class="quit"
      @click="quit"
    >
      <img
        :src="quite"
        alt="quit"
      >
    </p>
    <UploadImage class="addimg"></UploadImage>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
import { logo_white, quite } from "@/assets/image.js";

export default {
  data() {
    return {
      logo: logo_white,
      quite: quite
    };
  },
  methods: {
    quit() {
      this.$store.dispatch("RemoveToken");
      this.$electron.ipcRenderer.send("switchToLogin");
    }
  },
  components: {
    UploadImage
  },
  watch: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  .logo {
    width: 45px;
    margin: 15px;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
      margin-top: 8px;
    }
  }
  .quit {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 15px;
    img {
      width: 100%;
      height: auto;
    }
  }
  .addimg {
    position: absolute;
    left: 200px;
    bottom: 20px;
    font-size: 12px;
    line-height: 22px;
  }
}
</style>
