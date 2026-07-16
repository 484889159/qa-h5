import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  Button, Cell, Popup, Uploader, Field, RadioGroup, Radio,
  Search, Tabbar, TabbarItem, NavBar, Picker, Switch,
  Tabs, Tab, Empty, Icon, Overlay
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

const vantComponents = [
  Button, Cell, Popup, Uploader, Field, RadioGroup, Radio,
  Search, Tabbar, TabbarItem, NavBar, Picker, Switch,
  Tabs, Tab, Empty, Icon, Overlay
]
vantComponents.forEach(comp => app.use(comp))

app.use(router)
app.mount('#app')