<template>
  <div class="contests">
    <h2>可注册的竞赛</h2>
    <el-table :data="registerContests" stripe style="width: 100%">
      <el-table-column label="名称">
        <template v-slot="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="duration" label="竞赛时长" :formatter="formatDuration" />
      <el-table-column prop="note" label="公告" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link href="#" type="primary" @click="register(row.cid)" v-if="row.isRegistered == false">注册</el-link>
          <el-link href="#" type="primary" @click="unregister(row.cid)" v-else>取消注册</el-link>
        </template>
      </el-table-column>
    </el-table>

    <h2>正在进行的竞赛</h2>
    <el-table :data="runningContests" stripe style="width: 100%">
      <el-table-column label="名称">
        <template v-slot="{ row }">
          <el-link :href="'/contest/' + row.cid" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="duration" label="竞赛时长" :formatter="formatDuration" />
      <el-table-column prop="note" label="公告" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link :href="'/contest/' + row.cid" type="primary">查看</el-link>
          <div v-if="row.isRegistered == false">没有注册，无法提交代码</div>
        </template>
      </el-table-column>
    </el-table>

    <h2>已结束的竞赛</h2>
    <el-table :data="closeContests" stripe style="width: 100%">
      <el-table-column label="名称">
        <template v-slot="{ row }">
          <el-link :href="'/contest/' + row.cid" type="primary">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="duration" label="竞赛时长" :formatter="formatDuration" />
      <el-table-column prop="note" label="公告" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-link :href="'/contest/' + row.cid" type="primary">查看</el-link>
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
  const token = localStorage.getItem('token');

  axios.get('http://localhost:9876/contest/getContestList', {
    params: {
      startIndex: 1,
      length: 10,
    },
    headers: {
      'Authorization': token,
    },
  })
    .then(res => {
      if (res.status === 200) {
        if (res.data.code === 7) {
          console.error(res.data.msg);
          return;
        }
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