import {createApp} from 'vue'
import './style.css'
import './palette.css'
import App from './App.vue'
import router from './router/router'
import {store} from "./store/store.ts";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import setupSocketListeners from "./api/socketON.ts";

const app = createApp(App);

app.use(router)
app.use(store)
app.component('VueDatePicker', VueDatePicker)
setupSocketListeners(store);
app.mount('#app')
