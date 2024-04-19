<template>

  <div class="problems">
    <h1>Problems Page</h1>
    <!-- Add your homepage content here -->

    <!-- <div v-for="problem in problems" :key="problem.pid">
      <div>{{ problem.pid }}</div>
      <div>{{ problem.title }}</div>
    </div> -->
    <el-table :data="problems" stripe style="width: 100%">
      <el-table-column prop="pid" label="PID" />
      <!-- <el-table-column prop="title" label="Title" /> -->
      <el-table-column label="Title">
        <template v-slot="{ row }">
          <a :href="'/problem/' + row.pid">{{ row.title }}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';

interface Problem {
  pid: string;
  title: string;
}

const problems = ref<Problem[]>([]);

const loadProblems = () => {
  axios.get('http://localhost:9876/problem/getProblemList', {
    params: {
      startIndex: 1,
      length: 10,
    }
  })
    .then(res => {
      if (res.status === 200) {
        problems.value = res.data.data.problems;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

loadProblems();
</script>


<style scoped>
.problems {
  padding: 20px;
}
</style>