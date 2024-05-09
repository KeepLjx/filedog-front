import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)




const routes: Array<RouteConfig> = [
  {
    path:'/',
    component: ()=> import('../views/FatherView.vue'),
    redirect: '/index',
    meta: {title: "文集掌控" ,hidden: true},
    children: [
      {
        path:'/index',
        name:'home',
        component: ()=> import('../views/IndexView.vue'),
        meta: {title: "文集掌控" ,hidden: true}
      },
    
      {
        path: '/gather',
        component: ()=> import('../views/GatherView.vue'),
        meta: {title: "发布收集" , hidden: true}
      },
      {
        path: '/download',
        component: ()=> import('../views/DownloadView.vue'),
        meta: {title: "文件管理", hidden: true}
      }
    ]
  },
  
  {
    path: '/404',
    component: ()=> import('../views/404View.vue')
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/select',
    component: ()=> import('../components/CascadeSelection.vue')
  }

]

const router = new VueRouter({
  routes
})

export default router

const routeValueMap = {
  '/gather': '发布收集',
  '/index': '文件提交',
  '/download': '文件管理'
};
router.beforeEach((to, from, next) => {
  // 根据路由路径获取新的值
  const newValue = routeValueMap[to.path as keyof typeof routeValueMap];
  if (newValue) {
    // 更新Vuex状态
    store.commit('updateValue', newValue);

    // 更新文档标题
    document.title = newValue;
  }

  next();
});