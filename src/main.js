import Vue from 'vue'
import App from './App'
import VConsole from 'vconsole'

import uView from 'uview-ui'
Vue.use(uView)

Vue.config.productionTip = false

new VConsole()

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
