<template>
  <h1>新建题目</h1>
  <el-form ref="ruleFormRef" style="max-width: 600px;margin: 0 auto;" :model="problem" :rules="rules" label-width="auto"
    :size="formSize" status-icon>

    <el-form-item label="标题" prop="title">
      <el-input v-model="problem.title" />
    </el-form-item>
    <el-form-item label="题目描述" prop="description">
      <el-input v-model="problem.description" type="textarea" :rows="10" placeholder="支持MarkDown语法" />
    </el-form-item>
    <el-form-item label="内存限制" prop="memoryLimit">
      <el-input-number v-model="problem.memoryLimit"></el-input-number>&nbsp;MB
    </el-form-item>
    <el-form-item label="时间限制" prop="timeLimit">
      <el-input-number v-model="problem.timeLimit"></el-input-number>&nbsp;ms
    </el-form-item>

    <el-form-item label="算法标签" prop="tags"> 
      <el-checkbox-group v-model="problem.tags" size="large"  class="left-align">
        <el-checkbox class="el-checkbox-width" v-for="tag in tagsList"
          :key="tag" :value="tag">
          {{ tag }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="输入格式" prop="inputFormat">
      <el-input v-model="problem.inputFormat" type="textarea" :rows="6" placeholder="支持MarkDown语法" />
    </el-form-item>
    <el-form-item label="输出格式" prop="outputFormat">
      <el-input v-model="problem.outputFormat" type="textarea" :rows="6" placeholder="支持MarkDown语法" />
    </el-form-item>

    <div v-for="(testCase, index) in problem.testSamples" :key="index">
      <el-form label-position="top" inline>
        <el-form-item :label="'测试样例 ' + (index + 1)" :prop="'testSamples.' + index">
          <el-form-item label="输入">
            <el-input v-model="testCase.input" type="textarea" :rows="5" placeholder="Input" />
          </el-form-item>
          <el-form-item label="输出">
            <el-input v-model="testCase.output" type="textarea" :rows="5" placeholder="Output" />
          </el-form-item>

          <el-form-item label="测试说明" prop="note">
            <el-input v-model="testCase.note" type="textarea" :rows="2" placeholder="Output" />
          </el-form-item>
          <el-form-item label="样例解释" prop="explanation">
            <el-input v-model="testCase.explanation" type="textarea" :rows="2" placeholder="Output" />
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
          <el-button type="primary">选择测试数据文件</el-button>
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
        创建
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
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
  description: string;
  title: string;
  timeLimit: number;
  memoryLimit: number;
  tags: string[];
  testSamples: TestCase[];
  inputFormat: string;
  outputFormat: string;
}
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const problem = reactive<Problem>({
  description: '',
  title: '',
  timeLimit: 0,
  memoryLimit: 0,
  testSamples: [{ input: '', output: '', note: '', explanation: '' }],
})
const rules = reactive<FormRules<problem>>({
  description: [
    { required: true, message: 'Please input description', trigger: 'blur' },
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

const tagsList = ref([])

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
  formData.append('description', problem.description);
  formData.append('title', problem.title);
  formData.append('timeLimit', problem.timeLimit * 1000 * 1000);
  formData.append('memoryLimit', problem.memoryLimit * 1024 * 1024);
  formData.append('testSamplesJson', JSON.stringify(problem.testSamples));
  formData.append('tagsJson', JSON.stringify(problem.tags));
  formData.append('inputFormat', problem.inputFormat);
  formData.append('outputFormat', problem.outputFormat);

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

const loadTagsList = () => {
  axios.get('http://localhost:9876/problem/getTags')
    .then(res => {
      if (res.status === 200) {
        tagsList.value = res.data.data.tags;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
loadTagsList();
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

.el-checkbox-width{
  width: 100px;
  height: 25px;
}

.left-align {
  display: flex;
  flex-wrap: wrap;
}

</style>