<template>
  <div class="contestSubmissions">
    <h2>ContestSubmissions Page</h2>

    <el-table :data="submissions" stripe style="width: 100%">
      <el-table-column prop="sid" label="SID" />
      <el-table-column prop="uid" label="UID" />
      <el-table-column prop="pid" label="PID" />
      <el-table-column prop="submitTime" label="submit time" />
      <el-table-column prop="lang" label="lang" >
        <template #default="{ row }">
          {{langToString(row.lang)}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="status" />
      <el-table-column prop="runningTime" label="running time" />
      <el-table-column prop="runningMemory" label="running memory" />
      <el-table-column label="submit code">
        <template #default="{ row }">
          <el-button @click="showSubmitCode(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="Submit Code" width="50%">
      <div>{{ submitCode }}</div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router'
const axios = inject("axios");
const route = useRoute()
console.log(route)
const cid = route.params.cid;

// 将数字语言转换为字符串
const langToString = (lang: number): string => {
  switch (lang) {
    case 0:
      return 'Cpp';
    case 1:
      return 'Java';
    case 2:
      return 'Python';
    case 3:
      return 'Go';
    default:
      return 'Unknown Language';
  }
};

interface Submission {
  sid: string;
  uid: number;
  pid: string;
  submitTime: string; // 使用字符串表示时间，需要根据需要进行解析
  lang: number;
  status: StatusSet;
  runningTime: number;
  runningMemory: number;
  submitCode: string;
  point?: number; // 可选字段
}
type StatusSet =
  | 'Pending'
  | 'Compiling'
  | 'Judging'
  | 'Compile Error'
  | 'Accept'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Runtime Error'
  | 'Output Limit Exceeded'
  | 'Unknown Error';

const submissions = ref<Submission[]>();

const submitCode = ref("");
const dialogVisible = ref(false);
const showSubmitCode = (row) => {
  submitCode.value = row.submitCode;
  dialogVisible.value = true;
}

const fetchSubmissions = () => {
  axios.get(`http://localhost:9876/contest/getContestSubmissionList`, {
    params: {
      cid: cid
    }
  })
    .then(res => {
      if (res.status === 200) {
        console.log(res)
        submissions.value = res.data.data.submissions;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
onMounted(fetchSubmissions);

</script>

<style scoped>
.contestSubmissions {
  padding: 20px;
}
</style>