<template>
  <div>
    <h2>Submissions</h2>

    <el-table :data="submissions" stripe style="width: 100%">
      <!-- <el-table-column prop="sid" label="SID" /> -->
      <el-table-column prop="uid" label="UID" />
      <!-- <el-table-column prop="pid" label="PID" /> -->
      <el-table-column prop="submitTime" label="提交时间" />
      <el-table-column prop="lang" label="编程语言" >
        <template #default="{ row }">
          {{langToString(row.lang)}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="评测状态" />
      <!-- <el-table-column prop="runningTime" label="running time" />
      <el-table-column prop="runningMemory" label="running memory" /> -->
      <el-table-column label="代码详情">
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

const submitCode = ref("");
const dialogVisible = ref(false);
const showSubmitCode = (row) => {
  submitCode.value = row.submitCode;
  dialogVisible.value = true;
  // console.log(submitCode, dialogVisible)
}

const convertToUTC8 = (isoString: string): Date => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, 
    timeZone: 'Asia/Shanghai' 
  };
  return date.toLocaleString('zh-CN', options);
};

const fetchSubmissions = () => {
  axios.get(`http://localhost:9876/submission/getSubmissionList`, {
    params: {
      pid: pid,
      uid: uid
    }
  })
    .then(res => {
      if (res.status === 200) {
        if (res.data.code === 7) {
          console.error(res.data.msg);
          return;
        }
        submissions.value = res.data.data.submissions;
        submissions.value.forEach((submission) => {
          submission.submitTime = convertToUTC8(submission.submitTime);
        });
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