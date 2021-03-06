// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// import '../theme/index.css'
import router from './router'
import http from '@/http'
import store from '@/store'
import VueBus from 'vue-bus'
import filters from '@/common/js/filters/index'
import VueScrollTo from 'vue-scrollto'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueBus)

window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 6000 / 60)
    }
})()

Vue.use(VueScrollTo, {
  container: '.col-right'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  http,
  store,
  filters,
  template: '<App/>',
  components: {App}
})

