<template>
  <div class="problemDetail" v-if="problem"
    :style="{ borderRadius: `var(--el-border-radius-base)`, boxShadow: `var(--el-box-shadow-light)` }">
    <h1>{{ problem.title }}</h1>
    <p>内存限制: {{ problem.memoryLimit / 1024 / 1024 }} MB&nbsp;&nbsp;&nbsp;&nbsp;
      时间限制: {{ problem.timeLimit / 1000 / 1000 }} ms
    </p>

    <div class="problemMain">

      <h2>题目描述</h2>
      <MdPreview :editorId="id" :modelValue="problem.description" />

      <h2>输入格式</h2>
      <MdPreview :editorId="id" :modelValue="problem.inputFormat" />
      <h2>输出格式</h2>
      <MdPreview :editorId="id" :modelValue="problem.outputFormat" />

      <div v-for="(testSample, index) in problem.testSamples" :key="index">
        <h2>样例 {{ index + 1 }}</h2>
        <!-- <p>Input: {{ testSample.input }}</p>
        <p>Output: {{ testSample.output }}</p>
        <p v-if="testSample.note">Note: {{ testSample.note }}</p>
        <p v-if="testSample.explanation">Explanation: {{ testSample.explanation }}</p> -->
        <div class="sample-wrap sample">
          <div class="input">
            <strong>输入</strong>
            <pre ref="inputContent" :style="{ borderRadius: `var(--el-border-radius-base)` }"
              class="content">{{ testSample.input }}</pre>
          </div>
          <div class="output">
            <strong>输出</strong>
            <pre ref="outputContent" :style="{ borderRadius: `var(--el-border-radius-base)` }"
              class="content">{{ testSample.output }}</pre>
          </div>
        </div>

      </div>

      <div>
        <!-- 编辑器风格选择 -->
        <div class="select-container">
          <span>选择编程语言:</span>
          <el-select v-model="selectedLanguage" placeholder="Select a language" @change="handleChange"
            style="width:90px;">
            <el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>IDE风格:</span>
          <el-select v-model="theme" placeholder="Select a theme" style="width:110px;">
            <el-option v-for="theme in themes" :key="theme.value" :label="theme.label" :value="theme.value" />
          </el-select>
        </div>

        <!-- 编辑器 -->
        <div class="editor-container">
          <monacoEditor v-model="code" :language="selectedLanguage" :theme="theme" width="70%" height="350px"
            @editor-mounted="editorMounted"></monacoEditor>
        </div>
        <el-button type="primary" @click="submitCode">
          Submit
        </el-button>
        <el-button @click="resetCode">Reset</el-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router'
const axios = inject("axios");
import router from '../../router'

import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
const id = 'preview-only';

import * as monaco from 'monaco-editor'
import monacoEditor from './monacoEditor.vue'
const code = ref('')
const editorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  console.log('editor实例加载完成', editor)
}

const theme = ref('vs')
const themes = [
  { label: 'VS', value: 'vs' },
  { label: 'VS Dark', value: 'vs-dark' },
  { label: 'HC Black', value: 'hc-black' }
]

const selectedLanguage = ref('cpp');
const selectedValue = ref(0)
const languages = ref([
  { value: 'cpp', label: 'Cpp' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' }
]);
const handleChange = (value) => {
  selectedLanguage.value = value;
  if (value === 'cpp') {
    selectedValue.value = 0;
  } else if (value === 'java') {
    selectedValue.value = 1;
  } else if (value === 'python') {
    selectedValue.value = 2;
  } else {
    selectedValue.value = 3;
  }
  console.log('Selected Value:', value);
};
const getLang = (value) => {
  if (value === 0) {
    return 'cpp';
  } else if (value === 1) {
    return 'java';
  } else if (value === 2) {
    return 'python'
  } else {
    return 'go';
  }
}

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
  inputFormat: string;
  outputFormat: string;

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
// const code = ref('');
const submitCode = async () => {
  try {
    const submitTime = new Date().toISOString();
    const data = {
      pid: pid,
      cid: cid,
      submitTime: submitTime,
      lang: selectedValue.value,
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
const resetCode = () => {
  code.value = '';
}
</script>

<style scoped>
.problemDetail {
  padding: 20px;
  width: 80%;
  margin: auto;
}

.problemMain {
  text-align: left;
  margin-left: 10%;
}

.select-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.select-container span {
  margin-right: 10px;
}

.small-select .el-select__input {
  width: 20px;
  /* 设置宽度为 120px，可以根据需要调整 */
}

.editor-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.sample-wrap {
  overflow: hidden;
  display: flex;
}

.sample {
  margin-top: 1.5em;
  width: 70%;
}

.copy-btn {
  font-size: .8em;
  float: right;
  padding: 0 5px;
}

.lfe-form-sz-middle {
  font-size: 0.875em;
  padding: 0.313em 1em;
}

.input {
  margin-right: .5em;
  flex: 1;
  overflow: hidden;
}

.output {
  margin-left: .5em;
  flex: 1;
  overflow: hidden;
}

.content {
  background: #F8F8F8;
  padding: 7px;
}
</style>