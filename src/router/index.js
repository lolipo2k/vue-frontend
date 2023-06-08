import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue'
import PokerPage from '../pages/PokerPage.vue'
import PlayersPage from '../pages/PlayersPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import GamePage from '../pages/GamePage.vue'
import ReplenishPage from '../pages/ReplenishPage.vue'
//import CustomerPage from "../pages/CustomerPage.vue";
//import TicketPage from "../pages/TicketPage.vue";
import VerifyPage from "../pages/VerifyPage.vue";

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/game/:game', name: 'Poker', component: PokerPage },
    { path: '/players', name: 'Players', component: PlayersPage },
    { path: '/profile/:id', name: 'Profile', component: ProfilePage },
    { path: '/game', name: 'Game', component: GamePage },
    { path: '/replenish/:type/:balance', name: 'Replenish', component: ReplenishPage },
    //  { path: '/customer', name: 'Customer', component: CustomerPage },
    //  { path: '/customer/:id', name: 'Ticket', component: TicketPage },
    { path: '/user/account-activate/:id/:hash/', name: 'Verify', component: VerifyPage },
]

const router = createRouter({
    history: createWebHistory('/'),
    routes,
})

export default router
