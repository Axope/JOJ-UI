<template>
  <div class="upload-file">
    <el-upload class="upload_wrap" ref="upload" action="uploadUrl" :auto-upload="false" :file-list="fileList"
      :on-progress="onProgress" :on-change="onChange">

      <el-button slot="trigger"><i class="el-icon-upload" style="font-size:16px">
        </i>上传文件
      </el-button>  
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
        上传到服务器
      </el-button>
      <div slot="tip" class="el-upload__tip">
        只支持上传.h5文件，文件最大不得超过2G
      </div>

    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const fileList = ref([])

// 限制文件上传的个数
const onChange = (file, list) => {
  if (list.length > 1 && file.status !== "fail") {
    list.splice(0, 1);
  } else if (file.status === "fail") {
    errorMsg("上传失败，请重新上传！");
    list.splice(0, 1);
  }
};
// 上传之前限制文件格式
const beforeUp = (file) => {
  const isH5 = file.name.split(".")[1] === "png";
  const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
  if (!isH5) {
    errorMsg("仅支持上传.png文件");
  }
  if (!isLt2G) {
    errorMsg("上传文件大小不能超过 2G!");
  }
  return isH5 && isLt2G;
};
const submitUpload = () => {
  this.$refs.upload.submit();
};
</script>

<style>
.upload_wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.el-list-enter-active,
.el-list-leave-active {
  transition: none;
}

.el-list-enter,
.el-list-leave-active {
  opacity: 0;
}

.el-upload-list__item-name {
  width: 300px;
}

.el-upload-list {
  height: 40px;
}
</style>