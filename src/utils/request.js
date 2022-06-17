import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

// 请求拦截器-- 添加token
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 最后必须return
    return config
})

export default axios