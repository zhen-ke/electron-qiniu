<template>
  <section>
    <el-container>
      <el-header style="-webkit-app-region: drag">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <CreateBucket />
          <BucketList />
        </el-aside>
        <el-main>
          <List />
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<script>
import Header from "@/components/Header";
import List from "@/components/List";
import UploadImage from "@/components/UploadImage";
import CreateBucket from "@/components/CreateBucket";
import BucketList from "@/components/BucketList";

export default {
  data() {
    return {};
  },
  components: {
    List,
    UploadImage,
    CreateBucket,
    BucketList,
    Header
  }
};
</script>
