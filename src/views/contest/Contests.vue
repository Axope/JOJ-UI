<template>
  <div class="contests">
    <h1>Contest Page</h1>

    <h2>Register Contests:</h2>
    <el-table :data="registerContests" stripe style="width: 100%">
      <el-table-column label="Title">
        <template v-slot="{ row }">
          <span>{{ row.title }}</span>
          <!-- <a href="#">{{ row.title }}</a> -->
          <!-- <a :href="'/contest/' + row.cid">{{ row.title }}</a> -->
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="startTime" label="Start Time" />
      <el-table-column prop="duration" label="Contest Length" :formatter="formatDuration" />
      <el-table-column prop="note" label="Note" />
      <el-table-column label="Option" >
        <template v-slot="{ row }">
          <a href="#" @click="register(row.cid)" v-if="row.isRegistered == false">Register</a>
          <a href="#" @click="unregister(row.cid)" v-else>Unregister</a>
        </template>
      </el-table-column>
    </el-table>

    <h2>Running Contests:</h2>
    <el-table :data="runningContests" stripe style="width: 100%">
      <el-table-column label="Title">
        <template v-slot="{ row }">
          <a :href="'/contest/' + row.cid">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="startTime" label="Start Time" />
      <el-table-column prop="duration" label="Contest Length" :formatter="formatDuration" />
      <el-table-column prop="note" label="Note" />
      <el-table-column label="Option" >
        <template v-slot="{ row }">
          <a :href="'/contest/' + row.cid">Enter</a>
          <div v-if="row.isRegistered == false">没有注册，无法提交代码</div>
        </template>
      </el-table-column>
    </el-table>

    <h2>Closed Contests:</h2>
    <el-table :data="closeContests" stripe style="width: 100%">
      <el-table-column label="Title">
        <template v-slot="{ row }">
          <a :href="'/contest/' + row.cid">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="startTime" label="Start Time" />
      <el-table-column prop="duration" label="Contest Length" :formatter="formatDuration" />
      <el-table-column prop="note" label="Note" />
      <el-table-column label="Option" >
        <template v-slot="{ row }">
          <a :href="'/contest/' + row.cid">Enter</a>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed } from 'vue';
const axios = inject("axios");

interface Contest {
  cid: string;
  title: string;
  status: string;
  startTime: Date;
  duration: number;
  note: string;
  isRegistered: bool;
}

const contests = ref<Contest[]>([]);
const registerContests = ref<Contest[]>([]);
const runningContests = ref<Contest[]>([]);
const closeContests = ref<Contest[]>([]);

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

const formatDuration = (row, column, value) => {
  return value / 1000 / 1000 / 1000 / 60 + " min";
};

const register = (cid) => {
  const token = localStorage.getItem('token');
  const data = {
    cid: cid,
  };
  axios.post('http://localhost:9876/contest/register', data, {
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json',
    }
  })
    .then(res => {
      if (res.status === 200) {
        if (res.data.code === 7) {
          console.error(res.data.msg);
          return;
        }
        const contestIndex = registerContests.value.findIndex(contest => contest.cid === cid);
        if (contestIndex !== -1) {
          registerContests.value[contestIndex].isRegistered = true;
        }
        ElMessage.success('注册成功');
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

const unregister = (cid) => {
  const token = localStorage.getItem('token');
  const data = {
    cid: cid,
  };
  axios.post('http://localhost:9876/contest/unregister', data, {
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json',
    }
  })
    .then(res => {
      if (res.status === 200) {
        if (res.data.code === 7) {
          console.error(res.data.msg);
          return;
        }
        const contestIndex = registerContests.value.findIndex(contest => contest.cid === cid);
        if (contestIndex !== -1) {
          registerContests.value[contestIndex].isRegistered = false;
        }
        ElMessage.success('取消注册成功');
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

const loadContests = () => {
  const formData = new FormData();
  formData.append('startIndex', 1);
  formData.append('length', 10);
  const token = localStorage.getItem('token');

  axios.post('http://localhost:9876/contest/getContestList', formData, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => {
      if (res.status === 200) {
        contests.value = res.data.data.contests;
        contests.value.forEach((contest) => {
          contest.startTime = convertToUTC8(contest.startTime);
        });
        console.log("contests.value", contests.value);
        registerContests.value = contests.value.filter(contest => contest.status === 'Register');
        runningContests.value = contests.value.filter(contest => contest.status === 'Running');
        closeContests.value = contests.value.filter(contest => contest.status === 'Close');
      } else {
        console.error(res.data.msg);
      }
    })
    .catch(error => {
      console.error("请求失败:", error);
    });
};

loadContests();
</script>


<style scoped>
.contests {
  padding: 20px;
}
</style>