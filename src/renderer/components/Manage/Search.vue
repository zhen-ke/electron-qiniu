<template>
    <el-input placeholder="请输入内容" v-model="input" size="small">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
</template>

<script>
export default {
  data () {
    return  {
      input: ''
    };
  },
  watch: {
    input: function (newVal, oldVal) {
      this.$emit('changeSearch',newVal);
      // console.log(newVal)
    }
  }
};
</script>

<style lang = "scss" scoped>

</style>
