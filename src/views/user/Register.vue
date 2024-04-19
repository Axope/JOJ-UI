<template>
    <h2>Register</h2>
    <el-form ref="ruleFormRef" style="max-width: 400px;margin: 0 auto;" :model="user" :rules="rules" label-width="auto"
        :size="formSize" status-icon>

        <el-form-item label="Username" prop="username">
            <el-input v-model="user.username" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
            <el-input v-model="user.password" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                Register
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item>

        <el-alert v-if="showAlert" :title="registerFailedMessage" type="error" show-icon :closable="false" />

    </el-form>

</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios';

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
            register()
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

const register = () => {
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);

    axios.post(`http://localhost:9876/user/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => {
            if (res.data.code === 0) {
                console.log(res)
                router.push('/');
            } else {
                console.error(res.data.msg);
                showAlert.value = true
                registerFailedMessage.value = "注册失败：" + res.data.msg
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