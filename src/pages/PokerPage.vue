<template>
    <main class="poker">
        <div class="poker-main"
            v-bind:style="{ backgroundImage: 'url(' + require('../assets/img/poker/poker_background.jpg') + ')' }">
            <div class="poker-table">
                <div class="poker-table_img">
                    <img src="../assets/img/poker/poker_table.svg" alt="">
                </div>
                <div class="poker-table_center">
                    <vPokerCenter></vPokerCenter>
                    <vPokerControls></vPokerControls>
                    <vPokerBuyin></vPokerBuyin>
                </div>
                <div class="poker-players">
                    <vPokerPlayers></vPokerPlayers>
                </div>
            </div>
        </div>
        <vPokerRotate></vPokerRotate>
        <vPokerChips></vPokerChips>
        <vPokerZero></vPokerZero>
        <vPokerChoice></vPokerChoice>
        <vPokerHistory></vPokerHistory>
        <vReconnectGame v-if="logIn && isOpen"></vReconnectGame>
    </main>
</template>
<script>
import vPokerCenter from "@/components/poker/v-poker-center";
import vPokerControls from "@/components/poker/v-poker-conrols";
import vPokerPlayers from "@/components/poker/v-poker-players";
import vPokerRotate from "@/components/poker/v-poker-rotate";
import vPokerChips from "@/components/poker/v-poker-chips";
import vPokerZero from "@/components/poker/v-poker-zero";
import vPokerBuyin from "@/components/poker/v-poker-buyin";
import vPokerChoice from "@/components/poker/v-poker-choice.vue";
import vPokerHistory from "@/components/poker/poker-history/v-poker-history.vue";
import vReconnectGame from "@/layouts/modal/v-reconnect-game.vue";

import SocketWrap from "@/utils/socketWrapper";
import emitter from '@/main';
import params from "@/params";

export default {
    name: 'PokerPage',
    inject: ['currentUrl'],
    components: {
        vPokerCenter,
        vPokerControls,
        vPokerPlayers,
        vPokerRotate,
        vPokerChips,
        vPokerZero,
        vPokerBuyin,
        vPokerChoice,
        vPokerHistory,
        vReconnectGame
    },
    data() {
        return {
            socket: null,
            ws: params.WS_BASE_URL,
            profileData: {},
            logIn: false,
            isOpen: false,
        }
    },
    provide() {
        return {
            suitCards: ['spades', 'clubs', 'diamonds', 'hearts'],
            rankCards: ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'],
        }
    },
    methods: {
        socketStart() {
            this.socket = new SocketWrap(true);
            let token = localStorage.getItem("auth");
            document.cookie = 'authorization=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'authorization=' + token + ';path=/;'
            this.socket.connect(`${this.ws}/ws/pokerlib/?game=${this.$route.params.game}`);
            this.socket.on('connected', () => {
                console.log('connected');
                emitter.emit("socket", this.socket);
            });

            this.socket.on('poker_status', ({ data: data, game_action }) => {
                console.log('pocker_status', game_action, data);
            });
        }
    },
    unmounted() {
        this.socket.close();
        emitter.emit("isReconnect", true);
    },
    mounted() {
        this.$nextTick(function () {
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            if (localStorage.getItem("auth")) { this.logIn = true }
            (!localStorage.getItem("game_id") || localStorage.getItem("game_id") == this.$route.params.game) ? localStorage.setItem('game_id', this.$route.params.game) : this.isOpen = true;
            emitter.on("reconnectFalse", () => {
                localStorage.setItem('game_id', this.$route.params.game)
                this.isOpen = false
            });
            emitter.on("reconnectTrue", () => {
                this.isOpen = false
            });
            this.socketStart();
        })
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.socket.close();
                this.socketStart();
            }
        );
    },
}
</script>
<style scoped>
footer {
    display: none;
}
</style>
<style lang="scss">
@import "../assets/scss/pages/poker.scss";
</style>