import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './assets/styles/main.css'

import SetupView from './views/SetupView.vue'
import EditorView from './views/EditorView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'setup', component: SetupView },
    { path: '/editor', name: 'editor', component: EditorView }
  ]
})

const app = createApp(App)
app.use(router)
app.use(VueKonva)

router.isReady().then(() => {
  app.mount('#app')
})
