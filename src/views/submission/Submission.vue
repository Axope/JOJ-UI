<template>
  <div>
    <h2>Submissions</h2>
    <!-- <ul>
      <li v-for="submission in submissions" :key="submission.SID">
        <p>SID: {{ submission.sid }}</p>
        <p>UID: {{ submission.uid }}</p>
        <p>PID: {{ submission.pid }}</p>
        <p>Submit Time: {{ submission.submitTime }}</p>
        <p>Language: {{ langToString(submission.lang) }}</p>
        <p>Status: {{ submission.status }}</p>
        <p>Running Time: {{ submission.runningTime }}</p>
        <p>Running Memory: {{ submission.runningMemory }}</p>
        <p>Submit Code: {{ submission.submitCode }}</p>
      </li>
    </ul> -->
    <el-table :data="submissions" stripe style="width: 100%">
      <el-table-column prop="sid" label="SID" />
      <el-table-column prop="uid" label="UID" />
      <el-table-column prop="pid" label="PID" />
      <el-table-column prop="submitTime" label="submit time" />
      <el-table-column prop="lang" label="lang" />
      <el-table-column prop="status" label="status" />
      <el-table-column prop="runningTime" label="running time" />
      <el-table-column prop="runningMemory" label="running memory" />
      <el-table-column prop="submitCode" label="Code" />
      
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios';
const route = useRoute()
console.log(route)

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

const pid = route.params.pid;
const uid = route.params.uid;

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

const fetchSubmissions = () => {
  axios.get(`http://localhost:9876/submission/getSubmissionList`, {
    params: {
      pid: pid,
      uid: uid
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
.submission {
  padding: 20px;
}
</style>