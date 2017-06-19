import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import sign from '../components/sign/sign'

const router = new Router({
  routes: [
    {
      path: '/',
      component: sign
    },
    {
      path: '/home',
      component: resolve => require(['../components/home/home'], resolve),
      children: [
        {
          path: 'new',
          component: resolve => require(['../components/new/new'], resolve) 
        },
        {
          path: 'doc',
          component: resolve => require(['../components/doc/doc'], resolve) 
        },
        {
          path: 'text',
          component: resolve => require(['../components/text/text'], resolve) 
        },
        {
          path: 'online',
          component: resolve => require(['../components/online/online'], resolve) 
        },

      ]
    }
  ]
})

export default router