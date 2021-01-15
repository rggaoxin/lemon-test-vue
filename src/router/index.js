import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            // name: 'index'
            name: 'dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '系统首页' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/projects_list',
                    component: resolve => require(['../components/page/ProjectList.vue'], resolve),
                    meta: { title: '项目列表' },
                    name: 'projects_list'
                },
                {
                    path: '/projects_add',
                    component: resolve => require(['../components/page/ProjectAdd.vue'], resolve),
                    meta: { title: '项目新增' },
                    name: 'projects_add'
                },
                {
                    path: '/envs_list',
                    component: resolve => require(['../components/page/EnvList.vue'], resolve),
                    meta: { title: '环境列表' },
                    name: 'envs_list'
                },
                {
                    path: '/envs_add',
                    component: resolve => require(['../components/page/EnvAdd.vue'], resolve),
                    meta: { title: '环境新增' },
                    name: 'envs_add'
                },
                {
                    path: '/builtin_list',
                    component: resolve => require(['../components/page/BuiltinList.vue'], resolve),
                    meta: { title: '函数列表' },
                    name: 'builtin_list'
                },
                {
                    path: '/builtin_edit/:id',
                    // props: true,
                    component: resolve => require(['../components/page/BuiltinEdit.vue'], resolve),
                    meta: { title: '函数编辑' },
                    name: 'builtin_edit'
                },
                {
                    path: '/interfaces_list',
                    component: resolve => require(['../components/page/InterfaceList.vue'], resolve),
                    meta: { title: '接口列表' },
                    name: 'interfaces_list'
                },
                {
                    path: '/interfaces_add',
                    component: resolve => require(['../components/page/InterfaceAdd.vue'], resolve),
                    meta: { title: '接口新增' },
                    name: 'interfaces_add'
                },
                {
                    path: '/testcases_list',
                    component: resolve => require(['../components/page/TestcaseList.vue'], resolve),
                    meta: { title: '用例列表' },
                    name: 'testcases_list'
                },
                {
                    path: '/testcases_add',
                    component: resolve => require(['../components/page/TestcaseAdd.vue'], resolve),
                    meta: { title: '用例新增' },
                    name: 'testcases_add'
                },
                {
                    path: '/testcases_edit/:id',
                    component: resolve => require(['../components/page/TestcaseEdit.vue'], resolve),
                    meta: { title: '用例编辑' },
                    name: 'testcases_edit'
                },
                {
                    path: '/configures_list',
                    component: resolve => require(['../components/page/ConfigureList.vue'], resolve),
                    meta: { title: '配置列表' },
                    name: 'configures_list'
                },
                {
                    path: '/configures_add',
                    component: resolve => require(['../components/page/ConfigureAdd.vue'], resolve),
                    meta: { title: '配置新增' },
                    name: 'configures_add'
                },
                {
                    path: '/configures_edit/:id',
                    component: resolve => require(['../components/page/ConfigureEdit.vue'], resolve),
                    meta: { title: '配置编辑' },
                    name: 'configures_edit'
                },
                {
                    path: '/testsuites_list',
                    component: resolve => require(['../components/page/TestsuiteList.vue'], resolve),
                    meta: { title: '套件列表' },
                    name: 'testsuites_list'
                },
                {
                    path: '/testsuites_add',
                    component: resolve => require(['../components/page/TestsuiteAdd.vue'], resolve),
                    meta: { title: '套件新增' },
                    name: 'testsuites_add'
                },
                {
                    path: '/testsuites_edit/:id',
                    component: resolve => require(['../components/page/TestsuiteEdit.vue'], resolve),
                    meta: { title: '套件编辑' },
                    name: 'testsuites_edit'
                },
                {
                    path: '/reports_list',
                    component: resolve => require(['../components/page/ReportList.vue'], resolve),
                    meta: { title: '报告列表' },
                    name: 'reports_list'
                },
                {
                    path: '/reports_view/:id',
                    component: resolve => require(['../components/page/ReportView.vue'], resolve),
                    meta: { title: '报告查看' },
                    name: 'reports_view'
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' },
                    name: '404'
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' },
                    name: '403'
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    if(!token && to.path !== '/login' && to.path !== '/register'){   // 如果没有token值, 那么重定向到登录页面
        next({
          path: '/login',
        });
      }else {
        let routerName = ['builtin_edit', 'configures_edit', 'testcases_edit', 'reports_view', 'testsuites_edit'];
        // console.log('routerName', routerName);
        if (routerName.includes(from.name)) {
            let path_name = to.path.split("/")[2];
            // console.log('path_name', path_name);
            if (/\D/.test(path_name)) {
                next({name: path_name});
            }
        }
        
        // if (from.name === 'builtin_edit') {
        //     console.log(to);
        //     let path_name = to.path.split("/")[2];
        //     console.log(path_name);
        //     if (/\D/.test(path_name)) {
        //         next({name: path_name});
        //     }
        // }

        next();
      }
});


//抛出路由
export default router;