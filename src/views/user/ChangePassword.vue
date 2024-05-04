<template>
  <h2>Change Password</h2>
  <el-form ref="ruleFormRef" style="max-width: 400px;margin: 0 auto;" :model="user" :rules="rules" label-width="auto"
    :size="formSize" status-icon>

    <el-form-item label="old password" prop="password">
      <el-input v-model="user.password" />
    </el-form-item>

    <el-form-item label="new password" prop="newPassword">
      <el-input v-model="user.newPassword" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Change
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
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
  password: string;
  newPassword: string;
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const user = reactive<User>({
  password: '',
  newPassword: '',
})

const rules = reactive<FormRules<user>>({
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: 'Please input newPassword', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      changePassword()
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
const registerFailedMessage = ref('注册失败');

const changePassword = () => {
  const formData = new FormData();
  formData.append('password', user.password);
  formData.append('newPassword', user.newPassword);
  const token = localStorage.getItem('token');

  axios.post(`http://localhost:9876/user/changePassword`, formData, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => {
      if (res.data.code === 0) {
        console.log(res)
        ElMessage.success("密码修改成功")
        router.push('/').catch(() => {});
      } else {
        console.error(res.data.msg);
        showAlert.value = true
        registerFailedMessage.value = "密码修改失败：" + res.data.msg
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