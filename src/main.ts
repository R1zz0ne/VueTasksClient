import {createApp} from 'vue'
import './style.css'
import './palette.css'
import App from './App.vue'
import router from './router/router'
import {store} from "./store/store.ts";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";


createApp(App)
    .use(router)
    .use(store)
    .component('VueDatePicker', VueDatePicker)
    .mount('#app')
