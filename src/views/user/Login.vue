<template>
  <h2>登录</h2>
  <el-form ref="ruleFormRef" style="max-width: 400px;margin: 0 auto;" :model="user" :rules="rules" label-width="auto"
    :size="formSize" status-icon>

    <el-form-item label="用户名" prop="username">
      <el-input v-model="user.username" />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>

    <el-alert v-if="showAlert" :title="registerFailedMessage" type="error" show-icon :closable="false" />

  </el-form>

</template>

<script lang="ts" setup>
import { reactive, ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const axios = inject("axios");

const router = useRouter();
const route = useRoute()
console.log(route)

interface User {
  username: string;
  password: string;
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const user = reactive<User>({
  username: '',
  password: '',
})

const rules = reactive<FormRules<user>>({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      login()
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
const registerFailedMessage = ref('登录失败');

const login = () => {
  const formData = new FormData();
  formData.append('username', user.username);
  formData.append('password', user.password);

  axios.post(`http://localhost:9876/user/login`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(res => {
      if (res.data.code === 0) {
        console.log(res)
        const token = res.data.data.token
        const username = res.data.data.username
        const uid = res.data.data.uid
        const admin = res.data.data.admin
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('uid', uid);
        localStorage.setItem('admin', admin);

        ElMessage.success('登录成功');
        router.push('/').catch(() => {});;
      } else {
        console.error(res.data.msg);
        showAlert.value = true
        registerFailedMessage.value = "登录失败：" + res.data.msg
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
</script>

<style scoped>
/* .submission {
  padding: 20px;
} */
</style>