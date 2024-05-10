<template>

  <div class="problems">
    <h1>问题列表</h1>

    <el-table :data="problems" stripe style="width: 100%">
      <!-- <el-table-column prop="pid" label="PID" /> -->
      <el-table-column label="标题">
        <template v-slot="{ row }">
          <el-link :href="'/problem/' + row.pid" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="timeLimit" label="时间限制">
        <template v-slot="{ row }">
          {{ row.timeLimit / 1000 / 1000 }} ms
        </template>
      </el-table-column>
      <el-table-column prop="memoryLimit" label="内存限制">
        <template v-slot="{ row }">
          {{ row.memoryLimit / 1024 / 1024 }} MB
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="问题标签">
        <template v-slot="{ row }">
          <div v-for="(tag, index) in row.tags" 
            :key="index" 
            class="tag-box" 
            :style="{ backgroundColor: getColor(tag), borderRadius:`var(--el-border-radius-base)`, boxShadow: `var(--el-box-shadow-light)`}">
            {{tag}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      layout="sizes, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div> 


</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue';
const axios = inject("axios");

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const handleCurrentChange = (val: number) => {
  const startIndex = (val - 1) * pageSize.value + 1;
  loadProblems(startIndex, pageSize.value)
}

const tagsData = ref({
    "系统测试": "#1B1C1D",
    "模板": "#2185D0",
    "前缀和": "#009C95",
    "差分": "#5829BB",
    "贪心": "#2949B4",
    "二分": "#E03997",
    "线段树": "#B5CC18",
    "图论": "#FBBD08",
    "最短路": "#52C41A",
    "网络流": "#DB2828",
    "THUPC": "#13C2C2",
    "DP": "#00B5AD"
}); 
const getColor = (tag: string) => {
  return tagsData.value ? tagsData.value[tag] : '';
};

interface Problem {
  pid: string;
  title: string;
  timeLimit: number;
  memoryLimit: number;
  tags: string[];
}

const problems = ref<Problem[]>([]);

const loadProblems = (startIndex, length) => {
  axios.get('http://localhost:9876/problem/getProblemList', {
    params: {
      startIndex: startIndex,
      length: length,
    }
  })
    .then(res => {
      if (res.status === 200) {
        problems.value = res.data.data.problems;
        total.value = res.data.data.total;
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

loadProblems(1, pageSize.value);
</script>


<style scoped>
.problems {
  padding: 20px;
}

.tag-box {
  display: inline-block;
  margin: 5px;
  padding: 10px;
  text-align: center;
  color: white;
}

.demo-pagination-block {
  margin: 10px;
  text-align: center; 
}

.el-pagination {
  /* justify-content: center; */
}
</style>