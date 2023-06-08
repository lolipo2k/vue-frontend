<template>
    <main class="game">
        <div class="container">
            <div class="game-baner" v-if="!checkMobile">
                <img src="../assets/img/game_baner.svg" alt="">
            </div>
            <div class="game-baner" v-else>
                <img src="../assets/img/game_baner_mobile.svg" alt="">
            </div>
            <section class="create-match">
                <h1>
                    {{ $t("game.place_a_bet_and_start") }}
                </h1>
                <div class="create-match_btns">
                    <label>{{ $t('game.number_of_players') }}:</label>
                    <select v-model="dataGame.max_seats">
                        <option v-for="n in 8" :key="n">{{ n + 1 }}</option>
                    </select>
                    <input type="text" :placeholder="$t('game.small_blind')" v-model="dataGame.small_blind" v-on:keyup="updateData()">
                    <div v-on:click.prevent="createGame" class="btn-default">{{ $t('game.create_a_match') }}</div>
                </div>
                <div class="create-match_info">
                    <div v-if="dataGame.big_blind != ''">
                        <span>
                            {{ $t('game.big_blind') }}
                        </span>
                        {{ dataGame.big_blind }} ¥
                    </div>
                    <div v-if="dataGame.buyin_max != ''">
                        <span>
                            {{ $t('game.max_bet') }}
                        </span>
                        {{ dataGame.buyin_max }} ¥
                    </div>
                    <div v-if="dataGame.buyin_min != ''">
                        <span>
                            {{ $t('game.min_bet') }}
                        </span>
                        {{ dataGame.buyin_min }} ¥
                    </div>
                </div>
                <div class="error" v-if="error != ''">{{ error }}</div>
                <div class="info" v-if="info != ''">{{ info }}</div>
            </section>
            <vGameDesktop v-if="!checkMobile"></vGameDesktop>
            <vGameMobile v-else></vGameMobile>
        </div>
    </main>
</template>
<script>
import axios from 'axios';

import vGameDesktop from "../components/game/v-game-desktop";
import vGameMobile from "../components/game/v-game-mobile";

export default {
    name: 'GamePage',
    inject: ['currentUrl', 'checkMobile'],
    components: {
        vGameDesktop,
        vGameMobile
    },
    data() {
        return {
            dataGame: {
                buyin_min: '',
                buyin_max: '',
                max_seats: '',
                name: '',
                small_blind: '',
                big_blind: '',
            },
            games: [],
            error: '',
            info: '',
        }
    },
    methods: {
        randomString(i) {
            var rnd = '';
            while (rnd.length < i)
                rnd += Math.random().toString(36).substring(2);
            return rnd.substring(0, i);
        },
        createGame() {
            let token = localStorage.getItem("auth");
            if (this.dataGame.max_seats == '' || this.dataGame.small_blind == '') {
                this.error = this.$t("game.fill_data");
                return false;
            }
            this.dataGame.name = 'table_' + this.randomString(8);
            axios.post(this.currentUrl + '/game/game/poker/create', {
                name: this.dataGame.name,
                small_blind: this.dataGame.small_blind,
                big_blind: this.dataGame.small_blind * 2,
                max_buyin: this.dataGame.small_blind * 200,
                min_buyin: this.dataGame.small_blind * 20,
                max_seats: this.dataGame.max_seats
            },
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.gameList();
                    this.error = '';
                    this.info = this.$t("game.game_created");
                    Object.keys(this.dataGame).forEach(key => this.dataGame[key] = '');
                })
                .catch((error) => {
                    this.error = error.response.data.error
                }).finally(() => {
                    console.log('finish');
                });
        },
        formatChips(data) {
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        gameList() {
            axios.get(this.currentUrl + '/game/game/poker/list')
                .then((res) => {
                    this.games = [];
                    this.games = res.data.data;
                });
        },
        updateData() {
            let bool = !!Number(this.dataGame.small_blind)
            if (bool) {
                this.dataGame.big_blind = this.formatChips(this.dataGame.small_blind * 2);
                this.dataGame.buyin_min = this.formatChips(this.dataGame.small_blind * 20);
                this.dataGame.buyin_max = this.formatChips(this.dataGame.small_blind * 200);
            }
            else {
                this.dataGame.big_blind = '';
                this.dataGame.buyin_min = '';
                this.dataGame.buyin_max = '';
            }
        }
    },
    mounted() {
        this.$nextTick(function () {
            let data = JSON.parse(localStorage.getItem("profileInfo"));
            this.dataGame.name = data.username;
            this.gameList();
        })
    }
}
</script>
<style lang="scss">
@import "../assets/scss/pages/game.scss";
</style>