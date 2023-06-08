<template>
    <vPokerBet v-if="bet != '' && (player.status == 'ten' || player.status == 'eight' || player.status == 'seven')">
    </vPokerBet>
    <div v-if="gameStart" :class="`target-offset-${index + 1}`">
        <div v-if="player.cards.length != 0" class="user-carts">
            <div v-for="card in player.cards" v-bind:key="card" class="flip-container">
                <div class="flip-back-front-card-animation">
                    <img class="back" :src="require(`@/assets/img/poker/carts/back.svg`)" alt="">
                    <img class="front" :src="require(`@/assets/img/poker/carts${card}`)" alt="">
                </div>
            </div>
        </div>
        <div v-else class="user-carts give-animation">
            <div>
                <img :src="require(`@/assets/img/poker/carts/back.svg`)" alt="">
            </div>
            <div>
                <img :src="require(`@/assets/img/poker/carts/back.svg`)" alt="">
            </div>
        </div>
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
    <vPokerBet v-if="bet != '' && (player.status != 'ten' || player.status != 'eight' || player.status != 'seven')">
    </vPokerBet>
</template>
<script>
import emitter from '@/main';
import vPokerBet from "./v-poker-bet.vue";

export default {
    name: 'v-poker-player',
    inject: ['currentUrl'],
    props: {
        player: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    components: {
        vPokerBet
    },
    data() {
        return {
            moveId: 0,
            gameStart: false,
            dealerId: 0,
            interval: null,
            timeWidth: 0,
            bet: '',
            chipsOne: 0,
            chipsTen: 0,
            chipsHundred: 0,
            chipsThousand: 0,
            isWinner: false,
            socketIndex: null,
            additional: 0,
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
        socketActions() {
            this.socketIndex = this.$parent.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "ROUNDCLOSED") {
                    this.bet = ''
                    setTimeout(() => {
                        this.dealerId = 0
                    }, 3000);
                }

                if (game_action === "SMALLBLIND") {
                    this.dealerId = data.dealer_id
                }

                if (game_action === "DECLAREFINISHEDWINNER" || game_action === 'DECLAREPREMATUREWINNER') {
                    if (data.player_id == this.player.id) {
                        let classWinner = (this.$parent.inGame) ? this.player.rotate : this.player.status;
                        emitter.emit("chipsToUser", classWinner);
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