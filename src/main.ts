import {createApp, App as AppType} from 'vue'
import './style.css'
import './palette.css'
import App from './App.vue'
import router from './router/router'
import {key, store} from "./store/store.ts";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import setupSocketListeners from "./api/socketON.ts";

const app: AppType<Element> = createApp(App);

app.use(router)
app.use(store, key)
app.component('VueDatePicker', VueDatePicker)
setupSocketListeners(store, router);
app.mount('#app')
