<template>
  <h1>new problem</h1>
  <el-form ref="ruleFormRef" style="max-width: 600px;margin: 0 auto;" :model="problem" :rules="rules" label-width="auto"
    :size="formSize" status-icon>

    <el-form-item label="Descript" prop="descript">
      <el-input v-model="problem.descript" />
    </el-form-item>
    <el-form-item label="Title" prop="title">
      <el-input v-model="problem.title" />
    </el-form-item>
    <el-form-item label="Memory Limit" prop="memoryLimit">
      <el-input v-model="problem.memoryLimit" />
    </el-form-item>
    <el-form-item label="Time Limit" prop="timeLimit">
      <el-input v-model="problem.timeLimit" />
    </el-form-item>

    <div v-for="(testCase, index) in problem.testSamples" :key="index">
      <el-form label-position="top" inline>
        <el-form-item :label="'Test Case ' + (index + 1)" :prop="'testSamples.' + index">
          <el-form-item label="Input">
            <el-input v-model="testCase.input" type="textarea" :rows="5" placeholder="Input" />
          </el-form-item>
          <el-form-item label="Output">
            <el-input v-model="testCase.output" type="textarea" :rows="5" placeholder="Output" />
          </el-form-item>

          <el-form-item label="Note" prop="note">
            <el-input v-model="testCase.note" placeholder="Note" />
          </el-form-item>
          <el-form-item label="Explanation" prop="explanation">
            <el-input v-model="testCase.explanation" placeholder="Explanation" />
          </el-form-item>
        </el-form-item>
        <el-button type="danger" @click="removeTestCase(index)">删除</el-button>
      </el-form>
      <hr>
    </div>
    <!-- 添加测试用例按钮 -->
    <el-button @click="addTestCase">添加测试用例</el-button>

    <el-form-item label="测试数据" :style="{ marginTop: '20px' }">
      <el-upload ref="uploadRef" :auto-upload="false" :file-list="fileList" :on-change="onChange"
        :accept="'application/zip'">
        <template #trigger>
          <el-button type="primary">select file</el-button>
        </template>

        <template #tip>
          <div class="el-upload__tip">
            请将测试数据打包成一个zip上传
          </div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>

    <el-alert v-if="showAlert" :title="createFailedMessage" type="error" show-icon :closable="false" />

  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const axios = inject("axios");

const router = useRouter();
const route = useRoute();
console.log(route);

interface TestCase {
  input: string;
  output: string;
  note?: string;
  explanation?: string;
}
interface Problem {
  descript: string;
  title: string;
  timeLimit: number;
  memoryLimit: number;
  testSamples: TestCase[];
}
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const problem = reactive<Problem>({
  descript: '',
  title: '',
  timeLimit: 0,
  memoryLimit: 0,
  testSamples: [{ input: '', output: '', note: '', explanation: '' }],
})
const rules = reactive<FormRules<problem>>({
  descript: [
    { required: true, message: 'Please input descript', trigger: 'blur' },
  ],
  title: [
    { required: true, message: 'Please input title', trigger: 'blur' },
  ],
  timeLimit: [
    { required: true, message: 'Please input time limit', trigger: 'blur' },
  ],
  memoryLimit: [
    { required: true, message: 'Please input memory limit', trigger: 'blur' },
  ],
})

const addTestCase = () => {
  problem.testSamples.push({ input: '', output: '', note: '', explanation: '' });
};
const removeTestCase = (index: number) => {
  problem.testSamples.splice(index, 1);
};

// / / / // / // / / // / // / // /
const uploadRef = ref<Nullable<ElUpload>>(null);
const fileList = ref([]);
const onChange = (file, list) => {
  if (list.length > 1 && file.status !== "fail") {
    list.splice(0, 1);
  } else if (file.status === "fail") {
    errorMsg("上传失败，请重新上传！");
    list.splice(0, 1);
  }

  fileList.value = list;
  console.log(file)
  console.log(list[0])
  console.log(fileList.value[0])
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      createProblem()
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const showAlert = ref(false);
const createFailedMessage = ref('创建题目失败');

const createProblem = () => {
  const formData = new FormData();
  formData.append('descript', problem.descript);
  formData.append('title', problem.title);
  formData.append('timeLimit', problem.timeLimit);
  formData.append('memoryLimit', problem.memoryLimit);
  formData.append('testSamplesJson', JSON.stringify(problem.testSamples));
  const file = fileList.value[0];
  if (!file) {
    console.error('No file selected');
    return;
  }
  formData.append('file', file.raw)
  const token = localStorage.getItem('token');
  // for (var [a, b] of formData.entries()) {
  //   console.log(a, b);
  // }

  axios.post(`http://localhost:9876/problem/createProblem`, formData, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => {
      if (res.data.code === 0) {
        console.log(res)
        router.push('/');
      } else {
        console.error(res.data.msg);
        showAlert.value = true
        createFailedMessage.value = "题目创建失败：" + res.data.msg
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
</script>

<style scoped>
.createProblem {
  padding: 20px;
}

.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>