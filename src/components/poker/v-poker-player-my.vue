<template>
    <div v-if="gameStart">
        <div class="user-carts give-me-animation">
            <div v-for="card in myCards" v-bind:key="card">
                <img :class="{ act: card.active }" :src="require(`@/assets/img/poker/carts${card.img}`)" alt="">
            </div>
        </div>
    </div>
    <vPokerBet v-if="bet != ''">
    </vPokerBet>
    <div class="user-combination" v-if="combination">
        {{ combination }}
    </div>
    <div class="user-info" :class="{ act: player.id == moveId, winner: this.isWinner }">
        <div class="user-info_img">
            <img :src="this.currentUrl + player.image_medium" alt="">
        </div>
        <div class="user-info_name">
            {{ player.username }}
        </div>
        <div class="user-info_score">
            {{ formatChips(player.chips) }} ¥
        </div>
        <div class="user-info_dealer" v-if="dealerId == player.id">
            <img src="@/assets/img/poker/chips/dealer.svg" alt="">
        </div>
    </div>
    <div class="user-additional" v-if="player.id == moveId">
        {{ additional }}
    </div>
    <div class="user-time" v-if="player.id == moveId" :style="'width:' + timeWidth + 'px;'">
    </div>
    <div class="user-action" v-if="player.action != ''">
        {{ player.action }}
    </div>
</template>
<script>
import emitter from '@/main';
import vPokerBet from "./v-poker-bet.vue";

import axios from 'axios';

export default {
    name: 'v-poker-player-my',
    inject: ['suitCards', 'rankCards', 'currentUrl'],
    props: {
        player: {
            type: Object,
            required: true
        }
    },
    components: {
        vPokerBet
    },
    data() {
        return {
            moveId: 0,
            myCards: [],
            gameStart: false,
            dealerId: 0,
            interval: null,
            timeWidth: 0,
            bet: 0,
            chipsOne: 0,
            chipsTen: 0,
            chipsHundred: 0,
            chipsThousand: 0,
            myHelper: [],
            combination: '',
            isWinner: false,
            socketIndex: null,
            additional: 0,
            combinationList: new Map([
                ['HIGHCARD', this.$t("poker.high_card")],
                ['ONEPAIR', this.$t("poker.one_pair")],
                ['TWOPAIR', this.$t("poker.two_pair")],
                ['THREEOFAKIND', this.$t("poker.three_kind")],
                ['STRAIGHT', this.$t("poker.straight")],
                ['FLUSH', this.$t("poker.flush")],
                ['FULLHOUSE', this.$t("poker.full_house")],
                ['FOUROFAKIND', this.$t("poker.four_kind")],
                ['STRAIGHTFLUSH', this.$t("poker.straight_flush")],
            ]),
        }
    },
    methods: {
        formatChips(data) {
            if (data == 0) return 0;
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        chipsCount(data) {
            if (data < 10) this.chipsOne = Math.ceil(data)
            data = data / 10;
            this.chipsTen = Math.floor(data % 10);
            data = data / 10;
            this.chipsHundred = Math.floor(data % 10);
            data = data / 10;
            this.chipsThousand = Math.floor(data % 10);
        },
        timeStart(additionalTime, passedTime = 0) {
            if (passedTime > 30) {
                this.timeWidth = 0
                additionalTime -= (passedTime - 30)
            }
            else {
                passedTime = Math.trunc(passedTime) * 3
                this.timeWidth = 90 - passedTime
            }
            this.additional = Math.trunc(additionalTime)

            var time = this;
            this.interval = setInterval(() => {
                if (time.timeWidth <= 0) {
                    if (time.additional > 0) {
                        time.additional -= 1
                    }
                    else {
                        clearInterval(time.interval)
                        time.interval = null
                    }
                }
                else {
                    time.timeWidth -= 3;
                }
            }, 1000);
        },
        helperHand(data) {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + `/game/game/poker/helper/hand`, {
                "cards": data
            },
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    let active = res.data.handbase
                    if (res.data.name != 'HIGHCARD') {
                        this.combination = this.combinationList.get(`${res.data.name}`)
                        this.chooseActive(active)
                    }
                });
        },
        chooseActive(data) {
            data.forEach((element) => {
                element = JSON.stringify(element)
                let myIndex = this.myHelper.findIndex(item => JSON.stringify(item) == element)
                if (myIndex != -1) {
                    this.myCards[myIndex].active = true
                }
            });
            if (data.length != 0) {
                emitter.emit("cartHelper", data);
            }
        },
        socketActions() {
            if (this.socketIndex != null) this.$parent.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.$parent.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "DEALTCARDS") {
                    this.myHelper = data.cards;
                    data.cards.forEach((element, index) => {
                        this.myCards[index] = { active: false, img: '' }
                        this.myCards[index].img = "/" + this.suitCards[element[1]] + "/" + this.rankCards[element[0]] + ".svg";
                    });
                }

                if (game_action === "NEWTURN") {
                    let cards = data.board.concat(this.myHelper);
                    this.helperHand(cards)
                }

                if (game_action === "ROUNDCLOSED") {
                    this.bet = ''
                    setTimeout(() => {
                        this.combination = ''
                        this.dealerId = 0
                    }, 3000);
                }

                if (game_action === "SMALLBLIND") {
                    this.dealerId = data.dealer_id
                }

                if (game_action === "DECLAREFINISHEDWINNER" || game_action === 'DECLAREPREMATUREWINNER') {
                    if (data.player_id == this.player.id) {
                        emitter.emit("chipsToUser", 'my');
                        this.isWinner = true;
                        setTimeout(() => {
                            this.isWinner = false;
                        }, 5000);
                    }
                }

                if (game_action === "NEWTURN") {
                    if (data.turn != 0) {
                        setTimeout(() => {
                            this.bet = ''
                        }, 1000);
                    }
                }

                if (game_action === "REALBALANCE") {
                    let profile = JSON.parse(localStorage.getItem("profileInfo"))
                    profile.chips = data.money
                    emitter.emit("profileInfo", profile)
                }
            });
        }
    },
    unmounted() {
        this.$parent.socket.removeListener("poker_status", this.socketIndex);
    },
    mounted() {
        this.$nextTick(function () {
            this.socketActions();
            emitter.on("gameStart", boolean => { this.gameStart = boolean });
            emitter.on("timeFinish", () => {
                clearInterval(this.interval)
                this.interval = null
            });
            emitter.on("moveId", data => { this.moveId = data });
            emitter.on("moveIdTime", data => {
                this.moveId = data.player_id
                if ((this.player.id == this.moveId) && this.interval == null) this.timeStart(data.additional_time, data.time_passed);
            });
            emitter.on("changeBet", data => {
                if (this.player.id == data[0]) {
                    this.chipsCount(data[1])
                    this.bet = this.formatChips(data[1])
                    console.log(this.bet)
                }
            });
        })
    }
}
</script>