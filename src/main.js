import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'

Vue.use(ElementUI)

import Comp from './Comp.vue'

Vue.component('Comp', Comp)

new Vue({
    el: '#app',
    render: h => h(App)
})