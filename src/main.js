import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import axios from 'axios';
// import pie from 'v-charts/lib/pie.common'
// import histogram from 'v-charts/lib/histogram.common'
// import ring from 'v-charts/lib/ring.common'

import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
import "babel-polyfill";
// 开启contentmenu
import contentmenu from 'v-contextmenu'

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});

// 开启contentmenu
Vue.use(contentmenu);

// Vue.component(pie.name, pie);
// Vue.component(histogram.name, histogram);
// Vue.component(ring.name, ring);

//全局加载resource拦截器
import './axios';
// Vue.prototype.$http = axios;

const i18n = new VueI18n({
    locale: 'zh',
    messages
});


new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');