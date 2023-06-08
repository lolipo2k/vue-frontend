<template>
    <main>
        <div class="container">
            <section class="slider-baner">
                <vHomeCarousel></vHomeCarousel>
            </section>
            <section class="create-account">
                <div class="create-account__left">
                    <span>{{ $t("home.create_account") }}</span>
                    {{ $t("home.earn_money") }}
                </div>
                <div class="create-account__right">
                    <div class="btn-default" @click="createAccount()">
                        {{ $t("home.create_account") }}
                    </div>
                    <p class="money_earned">
                        {{ $t("home.money_earned") }}: <span>40 000 $</span>
                    </p>
                </div>
            </section>
            <section class="steps-list">
                <h1>{{ $t("home.earn_with_winbig") }}</h1>
                <div class="row">
                    <div class="col-xl-3 col-lg-6">
                        <div class="step-item act">
                            <div class="step-item_img">
                                <img src="../assets/img/board-icons/board-game_1.svg" alt="">
                            </div>
                            <div class="step-item_text">
                                <a href="#" @click="createAccount()">
                                    {{ $t("home.create_account") }}
                                </a>
                                <img src="../assets/img/board-icons/arrow.svg" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6">
                        <div class="step-item">
                            <div class="step-item_img">
                                <img src="../assets/img/board-icons/board-game_2.svg" alt="">
                            </div>
                            <div class="step-item_text">
                                {{ $t("home.coose_game") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6">
                        <div class="step-item">
                            <div class="step-item_img">
                                <img src="../assets/img/board-icons/board-game_3.svg" alt="">
                            </div>
                            <div class="step-item_text">
                                {{ $t("home.find_opponent") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-lg-6">
                        <div class="step-item">
                            <div class="step-item_img">
                                <img src="../assets/img/board-icons/board-game_4.svg" alt="">
                            </div>
                            <div class="step-item_text">
                                {{ $t("home.get_your_money") }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="games-list">
                <h1>{{ $t("home.game_list") }}</h1>
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-3" @click="this.$router.push('/game')">
                        <div class="game-item"
                            v-bind:style="{ backgroundImage: 'url(' + require('../assets/img/games-img/dou_dizhu.jpg') + ')' }">
                            <div class="game-item_background"></div>
                            <div class="game-item_online">
                                {{ $t("home.online") }}: -
                            </div>
                            <div class="game-item_name">
                                {{ $t("home.poker") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="game-item disbl"
                            v-bind:style="{ backgroundImage: 'url(' + require('../assets/img/games-img/chess.jpg') + ')' }">
                            <div class="game-item_disbl"></div>
                            <div class="game-item_background"></div>
                            <div class="game-item_online">
                                {{ $t("home.online") }}: -
                            </div>
                            <div class="game-item_name">
                                {{ $t("home.chess") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="game-item disbl"
                            v-bind:style="{ backgroundImage: 'url(' + require('../assets/img/games-img/go.jpg') + ')' }">
                            <div class="game-item_disbl"></div>
                            <div class="game-item_background"></div>
                            <div class="game-item_online">
                                {{ $t("home.online") }}: -
                            </div>
                            <div class="game-item_name">
                                {{ $t("home.go") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="game-item disbl"
                            v-bind:style="{ backgroundImage: 'url(' + require('../assets/img/games-img/china_chess.jpg') + ')' }">
                            <div class="game-item_disbl"></div>
                            <div class="game-item_background"></div>
                            <div class="game-item_online">
                                {{ $t("home.online") }}: -
                            </div>
                            <div class="game-item_name">
                                {{ $t("home.chinese_chess") }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="invite-friends">
                <div class="invite-friends_left">
                    <span>{{ $t("home.invite_friends_to_game_1") }} </span>
                    {{ $t("home.invite_friends_to_game_2") }}
                    <p>
                        {{ $t("home.invite_friends_1") }} <br> {{ $t("home.invite_friends_2") }}
                    </p>
                </div>
                <div class="invite-friends_right">
                    <div class="btn-default">
                        {{ $t("home.get_a_link") }}
                    </div>
                </div>
            </section>
            <section class="advantages">
                <h1>{{ $t("home.advantages") }}</h1>
                <div class="row">
                    <div class="col-12 col-lg-4">
                        <div class="advantage-item">
                            <div class="advantage-item_icon">
                                <img src="../assets/img/advantages/time.svg" alt="">
                            </div>
                            <div class="advantage-item_text">
                                {{ $t("home.play_anywhere") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4">
                        <div class="advantage-item">
                            <div class="advantage-item_icon">
                                <img src="../assets/img/advantages/money.svg" alt="">
                            </div>
                            <div class="advantage-item_text">
                                {{ $t("home.withdrawal_of_winnings") }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-4">
                        <div class="advantage-item">
                            <div class="advantage-item_icon">
                                <img src="../assets/img/advantages/balance.svg" alt="">
                            </div>
                            <div class="advantage-item_text">
                                {{ $t("home.deposit_money") }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <vHomeFaq></vHomeFaq>
        </div>
    </main>
</template>

<script>
import emitter from '../main';

import vHomeCarousel from "../components/home/v-home-carousel";
import vHomeFaq from "../components/home/v-home-faq";

export default {
    name: 'HomePage',
    components: {
        vHomeCarousel,
        vHomeFaq
    },
    methods: {
        createAccount() {
            (localStorage.getItem("auth")) ? this.$router.push('/game') : emitter.emit("modal-register", true);
        },
    },
}
</script>

<style lang="scss">
@import "../assets/scss/pages/home.scss";
</style>