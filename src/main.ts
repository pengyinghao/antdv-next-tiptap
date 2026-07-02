import { createApp } from 'vue'
import 'virtual:uno.css'

import editor from '@/components'

import App from './App.vue'

createApp(App).use(editor).mount('#app')
