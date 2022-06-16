import Vue from 'vue'
import App from './App.vue'
import router from './router'

// element
import "@/element/index"

// axios


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
