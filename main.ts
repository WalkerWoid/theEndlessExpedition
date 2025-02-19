import '@/assets/style/main.css'
import {createApp} from "vue";
import {createPinia} from "pinia";
import Game from "./src/Game.vue";

const app = createApp(Game)
const pinia = createPinia()

app.use(pinia)
app.mount('#game')