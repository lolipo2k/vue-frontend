import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import '@/assets/scss/style.scss';

import i18n from "./lang";

import mitt from 'mitt';
const emitter = mitt();
export default emitter

createApp(App).use(router).use(i18n).mount('#app')
