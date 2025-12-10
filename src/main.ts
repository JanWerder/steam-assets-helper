import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './assets/styles/main.css'

import SetupView from './views/SetupView.vue'
import EditorView from './views/EditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'setup', component: SetupView },
    { path: '/editor', name: 'editor', component: EditorView }
  ]
})

const app = createApp(App)
app.use(router)
app.use(VueKonva)
app.mount('#app')
