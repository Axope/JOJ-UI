import { createRouter, createWebHistory } from "vue-router";

import Test from '../views/Test.vue';
// home
import Home from '../views/home/Home.vue';
// about
import About from '../views/about/About.vue';
// user
import Login from '../views/user/Login.vue'
import Register from '../views/user/Register.vue'
import ChangePassword from '../views/user/ChangePassword.vue'
// problem
import Problems from '../views/problem/Problems.vue';
import ProblemDetail from '../views/problem/ProblemDetail.vue'
import CreateProblem from '../views/problem/CreateProblem.vue'
// submission
import Submission from '../views/submission/Submission.vue'
// contest
import Contests from '../views/contest/Contests.vue';
import ContestDetail from '../views/contest/ContestDetail.vue'
import CreateContest from '../views/contest/CreateContest.vue'
import ContestProblems from '../views/contest/ContestProblems.vue'
import ContestStandings from '../views/contest/ContestStandings.vue'
import ContestSubmissions from '../views/contest/ContestSubmissions.vue'

const routes = [
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },

  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/problems',
    name: 'Problems',
    component: Problems,
  },
  { 
    path: '/problem/:pid',
    component: ProblemDetail,
  },
  {
    path: '/createProblem',
    name: 'createProblem',
    component: CreateProblem,
  },

  {
    path: '/contests',
    name: 'Contests',
    component: Contests,
  },
  {
    path: '/createContest',
    name: 'CreateContest',
    component: CreateContest,
  },
  {
    path: '/contest/:cid',
    component: ContestDetail,
    children: [
      {
        path: '',
        component: ContestProblems,
      },
      {
        path: 'standings',
        component: ContestStandings,
      },
      {
        path: 'submissions',
        component: ContestSubmissions,
      },
    ],
  },

  {
    path: '/about',
    name: 'About',
    component: About,
  },
  
  {
    path: '/submission/:pid/:uid',
    name: 'submission',
    component: Submission,
  },
  
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/changePassword',
    component: ChangePassword,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;