<template>
  <div class="contestDetail" v-if="contest">

    <h1>{{ contest.title }}</h1>
    <p>开始时间: {{ convertToUTC8(contest.startTime) }}</p>
    <p>比赛时长: {{ contest.duration / 1000 / 1000 / 1000 / 60 + " min" }}</p>

    <div class="button-list">
      <el-button 
        size="small"
        @click="changeRoute('')" 
        :type="currentRoute === '' ? 'primary' : ''"
      >
        题目
      </el-button>
      <el-button 
        size="small"
        @click="changeRoute('standings')" 
        :type="currentRoute === 'standings' ? 'primary' : ''"
      >
      查看排名
      </el-button>
      <el-button 
        size="small"
        @click="changeRoute('submissions')" 
        :type="currentRoute === 'submissions' ? 'primary' : ''"
      >
      查看提交
      </el-button>
      <!-- <el-button size="small" @click="goToStandings">查看排名</el-button> -->
      <!-- <el-button size="small" @click="goToSubmissions">查看提交</el-button> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router'
import router from '../../router'
const axios = inject("axios");

const route = useRoute()
console.log(route)

interface ContestProblem {
  pid: string;
  nick: string;
  title: string;
}
interface Contest {
  cid: string;
  title: string;
  status: string;
  problems: ContestProblem[];
  startTime: Date;
  duration: number;
  note: string;
}


const contest = ref<Contest>();
const cid = route.params.cid;

const convertToUTC8 = (isoString: string): Date => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, 
    timeZone: 'Asia/Shanghai' 
  };
  return date.toLocaleString('zh-CN', options);
};

const fetchContestDetail = () => {
  axios.get(`http://localhost:9876/contest/${cid}`)
    .then(res => {
      if (res.status === 200) {
        console.log(res)
        contest.value = res.data.data.contest;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
onMounted(fetchContestDetail);

const currentRoute = ref('')
const changeRoute = (routeName) => {
  currentRoute.value = routeName;
  router.push({ path: '/contest/' + cid + '/' + routeName });
};
</script>

<style scoped>
.contestDetail {
  padding: 20px;
}

.button-list {
  display: flex;
  justify-content: flex-start;
  gap: 5px;
}
</style>