<template>
  <div class="common-layout" id="app">
    <el-container>
      <!-- Header -->
      <el-header>
        <div>
          <el-menu :default-active="activeIndex" :router="true" mode="horizontal" :ellipsis="false">
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>首页
            </el-menu-item>
            <el-menu-item index="/problems"><el-icon>
              <QuestionFilled /></el-icon>题库
            </el-menu-item>
            <el-menu-item index="/contests">
              <el-icon><Histogram /></el-icon>竞赛
            </el-menu-item>
            <el-menu-item index="/about">
              <el-icon><InfoFilled /></el-icon>关于我们
            </el-menu-item>

            <div class="flex-grow"></div>

            <div class="dark-box">
              <el-button text class="switch" :class="isDark ? 'isDark-switch' : 'noDark-switch'" @click="toggleDark">
                <el-icon v-if="isDark">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"
                      fill="currentColor"></path>
                  </svg>
                </el-icon>
                <el-icon v-else>
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
                      fill="currentColor"></path>
                  </svg>
                </el-icon>
              </el-button>
            </div>

            <div class="user">
              <el-button v-if="!token" @click="goTo('/register')">注册</el-button>
              <el-button v-if="!token" @click="goTo('/login')">登录</el-button>
              <div v-else>
                <div class="flex flex-wrap items-center">
                  <el-dropdown>

                    <el-button type="primary">
                      <el-icon><UserFilled /></el-icon>
                      &nbsp;
                      {{ username }}
                      <el-icon class="el-icon--right">
                        <ArrowDown />
                      </el-icon>
                    </el-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-if="admin === '1'" @click="createProblem">
                          <el-icon><CirclePlus /></el-icon>新建题目
                        </el-dropdown-item>
                        <el-dropdown-item v-if="admin === '1'" @click="createContest">
                          <el-icon><CirclePlus /></el-icon>新建比赛
                        </el-dropdown-item>
                        <el-dropdown-item @click="changePassword">
                          <el-icon><Unlock /></el-icon>修改密码
                        </el-dropdown-item>
                        <el-dropdown-item @click="logout">
                          <el-icon><SwitchButton /></el-icon>登出
                        </el-dropdown-item>
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
import { ref, watch, onMounted } from 'vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useRoute } from 'vue-router';

const isDark = ref(true)
const toggleDark = () => {
  isDark.value = !isDark.value
  const html = document.querySelector('html')
  if (html) {
    if (isDark.value) {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }
}

const router = useRouter();
const route = useRoute();

const token = ref(localStorage.getItem('token'));
const username = ref(localStorage.getItem('username'));
const admin = ref(localStorage.getItem('admin'));
const uid = ref(localStorage.getItem('uid'));
router.afterEach((to, from) => {
  if (to.path === '/') {
    token.value = localStorage.getItem('token');
    username.value = localStorage.getItem('username');
    admin.value = localStorage.getItem('admin')
    uid.value = localStorage.getItem('uid')
  }
});

const activeIndex = ref('/')
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
const createContest = () => {
  router.push('/createContest');
}

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('uid');
  localStorage.removeItem('admin');
  router.push('/').catch(() => {});
};

const setCurrentRoute = () => {
  // activeIndex.value = route.path;
  const parts = route.path.split('/');
  activeIndex.value = parts[1];
  if (activeIndex.value === "contest") {
    activeIndex.value = "contests";
  }
  if (activeIndex.value === "problem") {
    activeIndex.value = "problems";
  }
  if (activeIndex.value === "") {
    activeIndex.value = "/";
  }
  console.log("activeIndex", activeIndex.value)
};
watch(route, setCurrentRoute);
onMounted(setCurrentRoute);
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
.dark-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}
.switch {
  width: 40px;
  height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  padding-bottom: 0;
  padding-top: 0px;

  background-color: #ebeef5 !important;
  font-size: 12px;
}
.isDark-switch {
  .el-icon {
    background-color: #fff !important;
    padding: 2px;
    border-radius: 50%;
    color: #000;
    margin-left: -8px;
  }
}
.noDark-switch {
  background-color: rgb(8, 8, 8) !important;

  .el-icon {
    color: #fff;
    margin-left: 15px;
  }
}
</style>