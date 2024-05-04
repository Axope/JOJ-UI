<template>
  <div class="contestProblems" v-if="contest">

    <el-table :data="contest.problems" stripe style="width: 100%">
      <el-table-column prop="pid" label="PID" />
      <el-table-column label="Nick">
        <template v-slot="{ row }">
          <a :href="'/problem/' + row.pid + '?cid=' + cid">{{ row.nick }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template v-slot="{ row }">
          <a :href="'/problem/' + row.pid + '?cid=' + cid">{{ row.title }}</a>
        </template>
      </el-table-column>
    </el-table>
  
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

const fetchContestProblems = () => {
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
onMounted(fetchContestProblems);


const goToProblems = () => {
  router.push(`/contest/${cid}/problems`);
};
const goToStandings = () => {
  router.push(`/contest/${cid}/standings`);
};
const goToSubmissions = () => {
  router.push(`/contest/${cid}/submissions`);
};
</script>

<style scoped>
.contestProblems {
  padding: 20px;
}
</style>