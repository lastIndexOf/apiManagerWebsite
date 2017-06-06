import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from '../components/home/home'

const router = new Router({
  routes: [
    {
      path: '/home',
      component: home,
      children: [
        {
          path: ''
        }
      ]
    }
  ]
})

router.push('home')

export default router