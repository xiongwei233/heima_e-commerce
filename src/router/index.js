import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: 'login',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home'),
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: 'Welcome',
                component: () => import('@/views/home/welcome')
            },
            {
                path: '/users',
                name: 'Users',
                component: () => import('@/views/users/index')
            },
            {
                path: '/rights',
                name: 'Rights',
                component: () => import('@/views/roles/rights')
            },
            {
                path: '/roles',
                name: 'Roles',
                component: () => import('@/views/roles/roles')
            },
            {
                path: '/goods',
                name: 'Goods',
                component: () => import('@/views/products/goods'),
            },
            {
                path: '/goods/add',
                name: 'Add',
                component: () => import('@/views/products/add'),
            },
            {
                path: '/categories',
                name: 'Categories',
                component: () => import('@/views/products/categories')
            },
            {
                path: '/params',
                name: 'params',
                component: () => import('@/views/products/params')
            },
            {
                path: '/orders',
                name: 'Orders',
                component: () => import('@/views/orders/')
            },
            {
                path: '/reports',
                name: 'Reports',
                component: () => import('@/views/reports/')
            },
            {
                path: '*',
                name: 'Error',
                component: () => import('@/views/error/index')
            }
        ]
    },
]

const router = new VueRouter({
    routes,
    mode: "history"
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径信息
    // from 代表从哪个跳转而来的路径信息
    // next 是一个函数表示放行
    // next()放行next('login)强制跳转
    if (to.path === "/login") return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("/login");
    next();
});

export default router
