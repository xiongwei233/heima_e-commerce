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

// fontSize
import "@/assets/fonts/iconfont.css"

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
