<template>
  <h1>新建比赛</h1>
  <el-form ref="ruleFormRef" style="max-width: 600px;margin: 0 auto;" :model="contest" :rules="rules" label-width="auto"
    :size="formSize" status-icon>

    <el-form-item label="比赛标题" prop="title">
      <el-input v-model="contest.title" placeholder="请输入比赛标题"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-date-picker v-model="contest.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="比赛时长" prop="duration">
      <el-input-number v-model="contest.duration" placeholder="请输入比赛时长"></el-input-number>&nbsp;分钟
    </el-form-item>
    <el-form-item label="比赛公告" prop="note">
      <el-input v-model="contest.note"></el-input>
    </el-form-item>
    <el-form-item label="比赛规则" prop="rule">
      <el-select v-model="contest.rule" placeholder="请选择比赛规则">
        <el-option label="ACM" value="ACM"></el-option>
        <el-option label="OI" value="OI"></el-option>
        <el-option label="IOI" value="IOI"></el-option>
      </el-select>
    </el-form-item>

    <!-- 选择题目 -->
    <div v-for="(problemInfo, index) in contest.problems" :key="index">
      <el-form label-position="top" inline>
        <el-form-item :label="'Problem ' + (index + 1)" :prop="'problemInfo.' + index">
          <el-form-item label="Nick" prop="nick">
            <el-input v-model="problemInfo.nick" placeholder="Nick" />
          </el-form-item>
          <div>
            <el-button type="primary" @click="showDialog">Select Problems</el-button>
            <el-dialog
              title="Select Problems"
              v-model="dialogVisible"
              width="50%"
              :before-close="handleCloseDialog"
            >
            <div class="radio-group">
              <el-radio v-for="problem in diaProblems" :label="problem.pid" :key="problem.pid" v-model="selectedProblem">
                {{ problem.title }}
              </el-radio>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveProblems">确定选择</el-button>
            </span>
            </el-dialog>
          </div>
        </el-form-item>
          <el-button type="danger" @click="removeProblemInfo(index)">删除</el-button>
      </el-form>
      <hr>
    </div>
    <el-button @click="addProblemInfo">添加题目</el-button>

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

interface ProblemInfo {
  pid: string;
  nick: string;
  title: string;
}
type ContestRule = 'ACM' | 'OI' | 'IOI';
interface Contest {
  title: string;
  problems: ProblemInfo[];
  startTime: Date;
  duration: number;
  note: string;
  rule: ContestRule;
}
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const contest = reactive<Contest>({
  title: '',
  problems: [],
  startTime: new Date(),
  duration: 0,
  note: '',
  rule: 'ACM',
})
const rules = reactive<FormRules<Contest>>({
  title: [
    { required: true, message: '请输入比赛标题', trigger: 'blur' },
  ],
  startTime: [
    { required: true, type: 'date', message: '请选择开始时间', trigger: 'change' }
  ],
  duration: [
    { required: true, type: 'number', message: '请输入比赛时长', trigger: 'blur' },
  ],
  rule: [
    { required: true, message: '请选择比赛规则', trigger: 'change' }
  ],
})


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      createContest()
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
const createFailedMessage = ref('创建比赛失败');

const addProblemInfo = () => {
  contest.problems.push({ pid: '', nick: '', title: ''});
};
const removeProblemInfo = (index: number) => {
  contest.problems.splice(index, 1);
};

const createContest = () => {
  const formData = new FormData();
  formData.append('title', contest.title);
  formData.append('problemsJson', JSON.stringify(contest.problems));
  // formData.append('testSamplesJson', JSON.stringify(contest.testSamples));
  formData.append('startTime', contest.startTime.toISOString());
  formData.append('duration', contest.duration);
  formData.append('note', contest.note);
  formData.append('rule', contest.rule);
  const token = localStorage.getItem('token');
  // for (var [a, b] of formData.entries()) {
  //   console.log(a, b);
  // }
  // return

  axios.post(`http://localhost:9876/contest/createContest`, formData, {
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
        createFailedMessage.value = "比赛创建失败：" + res.data.msg
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

// dia
interface Problem {
  pid: string;
  title: string;
}
const selectedProblem = ref<Problem | null>(null);
const diaProblems = ref<Problem[]>([]);
const dialogVisible = ref(false)
const showDialog = () => {
  dialogVisible.value = true;
  loadProblems();
};
const loadProblems = () => {
  axios.get('http://localhost:9876/problem/getProblemList', {
    params: {
      startIndex: 1,
      length: 10,
    }
  })
    .then(res => {
      if (res.status === 200) {
        console.log(res)
        diaProblems.value = res.data.data.problems;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
const handleCloseDialog = (done) => {
  selectedProblem.value = null;
  done();
};
const saveProblems = () => {
  console.log('Selected Problem:', selectedProblem.value);
  const selectedProblemObject = diaProblems.value.find(problem => problem.pid === selectedProblem.value);
  console.log('Selected Problem Object:', selectedProblemObject);
  if (selectedProblemObject) {
    const lastIndex = contest.problems.length - 1;
    contest.problems[lastIndex].pid = selectedProblemObject.pid;
    contest.problems[lastIndex].title = selectedProblemObject.title;
  }
  dialogVisible.value = false;
};
</script>

<style scoped>
/* .radio-group {
  display: flex;
  flex-direction: column;
}
.radio-group el-radio {
  margin-bottom: 10px;
} */
</style>