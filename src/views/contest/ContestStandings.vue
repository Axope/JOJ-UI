<template>
  <div class="contestStandings">
    <el-table :data="standings" stripe style="width: 100%" v-if="standings.length > 0">
      <!-- <el-table-column prop="uid" label="UID" width="180"> -->
      <!-- </el-table-column> -->
      <el-table-column label="排名">
        <template v-slot="{ row }">
          <div>{{ calculateRank(row) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="用户名">
        <template v-slot="{ row }">
          <div>{{ getUsername(row) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="通过数量">
        <template v-slot="{ row }">
          <div>{{ getAcceptCount(row) }}</div>
        </template>
      </el-table-column>

      <el-table-column v-if="rule === 'ACM'" label="罚时">
        <template v-slot="{ row }">
          <div>{{ calculatePenalty(row) }}</div>
        </template>
      </el-table-column>

      <el-table-column v-for="(pss, index) in standings[0].pss" :key="index" :label="pss.nick">
        <template v-slot="{ row }">
          <div>{{ getProblemStatus(row, index) }}</div>
        </template>
      </el-table-column>
      
    </el-table>

  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue';
import { useRoute } from 'vue-router'
const axios = inject("axios");

const route = useRoute()
console.log(route)

const getProblemStatus = (row, index) => {
  return row.pss[index].status;
};
const getAcceptCount = (row) => {
  let acceptCount = 0;
  for (const pss of row.pss) {
    if (pss.status === 'Accept') {
      acceptCount++;
    }
  }
  return acceptCount;
};
const usernameList = ref<string[]>([]);
const getUsername = (row) => {
  const index = standings.value.findIndex(item => item.uid === row.uid);
  console.log("index", index, usernameList.value[index]);
  return usernameList.value[index];
};
const rule = ref<string>('');
const calculatePenalty = (row) => {
  let penalty = 0;
  for (const pss of row.pss) {
    penalty += pss.penalty + pss.failCnt * 20;
  }
  return penalty;
};
const calculateRank = (row) => {
  return standings.value.findIndex(item => item.uid === row.uid)+1;
};

interface ProblemSolveStatus {
  pid: string;
  nick: string;
  status: string;
  penalty: number;
  failCnt: number;
}
interface RankListData {
  uid: string;
  pss: ProblemSolveStatus[];
}
const standings = ref<RankListData[]>([]);
const loadStandings = () => {
  axios.get('http://localhost:9876/contest/getStandingsByRank', {
    params: {
      cid: route.params.cid,
      startIdx: 1,
      len: 10,
    }
  })
    .then(res => {
      if (res.status === 200) {
        standings.value = res.data.data.rankList;
        usernameList.value = res.data.data.usernameList;
        rule.value = res.data.data.rule;
        console.log(standings)
        console.log("usernameList", usernameList)
        console.log("rule", rule)
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};
loadStandings();

</script>

<style scoped>
.contestStandings {
  padding: 20px;
}
</style>