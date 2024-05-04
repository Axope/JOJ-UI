<template>
  <div class="problemDetail" v-if="problem">
    <h1>{{ problem.title }}</h1>
    <p>Memory Limit: {{ problem.memoryLimit / 1024 / 1024 }} MB&nbsp;&nbsp;&nbsp;&nbsp;
      Time Limit: {{ problem.timeLimit / 1000 / 1000 }} ms
    </p>

    <div class="problemMain">

      <h2>Description</h2>
      <p>{{ problem.description }}</p>

      <div v-for="(testSample, index) in problem.testSamples" :key="index">
        <h2>Test Sample {{ index + 1 }}</h2>
        <p>Input: {{ testSample.input }}</p>
        <p>Output: {{ testSample.output }}</p>
        <p v-if="testSample.note">Note: {{ testSample.note }}</p>
        <p v-if="testSample.explanation">Explanation: {{ testSample.explanation }}</p>
      </div>

      <div>
        <textarea v-model="code" rows="10" cols="50"></textarea>
        <select v-model="lang">
          <option value="0">Cpp</option>
          <option value="1">Java</option>
          <option value="2">Python</option>
          <option value="3">Go</option>
        </select>
        <button @click="submitCode">Submit</button>
      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router'
const axios = inject("axios");
import router from '../../router'

const route = useRoute()
console.log(route)
console.log("cid", route.query.cid)

interface TestCase {
  input: string;
  output: string;
  note?: string;
  explanation?: string;
}
interface Problem {
  pid: string;
  title: string;
  timeLimit: number;
  memoryLimit: number;
  description: string;
  testSamples: TestCase[];

  // options
  dataRange?: string;
  point?: number;
  tags?: string[];
  tutorial?: string;
}

const problem = ref<Problem>();
const pid = route.params.pid;
const cid = route.query.cid;

const fetchProblemDetail = () => {
  axios.get(`http://localhost:9876/problem/${pid}`)
    .then(res => {
      if (res.status === 200) {
        console.log(res)
        problem.value = res.data.data.problem;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
onMounted(fetchProblemDetail);

// Code Submit
const code = ref('');
let lang: number = 0;
const submitCode = async () => {
  try {
    const submitTime = new Date().toISOString();
    const data = {
      pid: pid,
      cid: cid,
      submitTime: submitTime,
      lang: lang,
      submitCode: code.value,
    };
    console.log("data = ", data)
    // 提交代码
    axios.post('http://localhost:9876/submit', data, {
      headers: {
        'Authorization': localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    });

    let uid: number = localStorage.getItem('uid');
    router.push({
      name: 'submission',
      params: { pid, uid }
    });
  } catch (error) {
    console.error('Error submitting code:', error);
  }
};
</script>

<style scoped>
.problemDetail {
  padding: 20px;
}

.problemMain {
  text-align: left;
  margin-left: 10%;
}
</style>