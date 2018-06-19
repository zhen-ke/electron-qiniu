import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/login').default
    },
    {
      path: '/bucket',
      name: 'bucket',
      component: require('@/components/Bucket').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
