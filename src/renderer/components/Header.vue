<template>
  <div class="header">
    <h1 class="logo">
      <img
        :src="logo"
        alt="logo"
      >
    </h1>
    <div
      class="quit"
      @click="quit"
    >
      <img
        :src="quite"
        alt="quit"
      >
    </div>
    <AddImage class="addimg"></AddImage>
  </div>
</template>

<script>
import AddImage from "@/components/AddImage";
import { logo_white ,quite } from "@/assets/image.js";

export default {
  data() {
    return {
      logo: '',
      quite: ''
    };
  },
  mounted() {
    this.logo = logo_white;
    this.quite = quite;
  },
  methods: {
    quit() {
      localStorage.removeItem("obj");
      this.$electron.ipcRenderer.send("status", false);
    }
  },
  components: {
    AddImage
  }
};
</script>

<style lang="scss" scoped>
.header {
  .logo {
    width: 45px;
    margin: 15px;
    img {
      width: 100%;
      height: auto;
      vertical-align: top;
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
