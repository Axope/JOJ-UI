import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from "./router/index.ts";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios) 
app.use(router)
app.use(ElementPlus)

app.mount('#app')

axios.interceptors.response.use(response => {
  const { data } = response;
  if (data.msg === 'token is expired') {
    ElMessage.warning('Token 已过期，请重新登录');
    logout()
  }
  return response;
}, error => {
  return Promise.reject(error);
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('uid');
  localStorage.removeItem('admin');
  router.push('/').catch(() => {});
};