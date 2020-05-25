import Vue from 'vue'
import App from './App'
// 封装请求
import https from './utils/https.js'
// 全局组件
import Status from './components/Status.vue'
import PageHeader from './components/PageHeader.vue'
import Counter from './components/Counter.vue'

Vue.config.productionTip = false
Vue.prototype.request = https;

// 全局注册组件
Vue.component('Status',Status);
Vue.component('PageHeader',PageHeader);
Vue.component('Counter',Counter);

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
