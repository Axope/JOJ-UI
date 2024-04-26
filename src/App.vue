<template>
  <div class="common-layout" id="app">
    <el-container>
      <!-- Header -->
      <el-header>
        <div>
          <el-menu :router="true" mode="horizontal" :ellipsis="false">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/problems">题库</el-menu-item>
            <el-menu-item index="/contest">竞赛</el-menu-item>
            <el-menu-item index="/about">关于我们</el-menu-item>

            <div class="flex-grow">
            </div>

            <div class="user">
              <el-button v-if="!token" @click="goTo('/register')">注册</el-button>
              <el-button v-if="!token" @click="goTo('/login')">登录</el-button>
              <div v-else>
                <div class="flex flex-wrap items-center">
                  <el-dropdown>

                    <el-button type="primary">
                      {{ username }}
                      <el-icon class="el-icon--right">
                        <ArrowDown />
                      </el-icon>
                    </el-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-if="admin" @click="createProblem">新建题目</el-dropdown-item>
                        <el-dropdown-item @click="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="logout">登出</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>

          </el-menu>
        </div>
      </el-header>


      <!-- main -->
      <el-main>
        <router-view></router-view>
      </el-main>

    </el-container>
  </div>
</template>





<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const token = ref(localStorage.getItem('token'));
const username = ref(localStorage.getItem('username'));
const admin = ref(localStorage.getItem('admin'));
router.afterEach((to, from) => {
  if (to.path === '/') {
    token.value = localStorage.getItem('token');
    username.value = localStorage.getItem('username');
    admin.value = localStorage.getItem('admin')
  }
});

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const goTo = (path) => {
  router.push(path);
};

const changePassword = () => {
  router.push('/changePassword');
};

const createProblem = () => {
  router.push('/createProblem');
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.reload();
};
</script>





<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

el-header {
  background-color: #409EFF;
}

.flex-grow {
  flex-grow: 1;

}

.user {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.example-showcase .el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>