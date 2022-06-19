import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element
import "@/element/index"

// axios
import "@/api/index"

// normalize.css
import "normalize.css"
import "@/styles/global.less"

// 时间过滤器
import moment from 'moment'

Vue.filter('dateFilter', val => {
    return moment(val).format('YYYY-MM-DD hh:mm:ss')
})

// fontSize
import "@/assets/fonts/iconfont.css"

Vue.config.productionTip = false


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
