import {createApp} from 'vue'
import './style.css'
import './palette.css'
import App from './App.vue'
import router from './router/router'
import {store} from "./store/store.ts";

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
