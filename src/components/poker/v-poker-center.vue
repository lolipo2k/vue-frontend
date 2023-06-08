<template>
    <div class="v-poker-center">
        <div class="total-pot" :class="(winClass != '') ? winClass + ' win' : ''" v-if="totalPot != 0">
            <div class="total-pot_score">{{ $t('poker.pot') }}: {{ totalPot }} ¥</div>
            <div class="total-pot_chips">
                <div v-if="chipsOne >= 1">
                    <img v-for="i in chipsOne" :key="i" :style="'z-index:' + i + ';'"
                        src="@/assets/img/poker/chips/chips_one.svg" alt="">
                </div>
                <div v-if="chipsTen >= 1">
                    <img v-for="i in chipsTen" :key="i" :style="'z-index:' + i + ';'"
                        src="@/assets/img/poker/chips/chips_ten.svg" alt="">
                </div>
                <div v-if="chipsHundred >= 1">
                    <img v-for="i in chipsHundred" :key="i" :style="'z-index:' + i + ';'"
                        src="@/assets/img/poker/chips/chips_hundred.svg" alt="">
                </div>
                <div v-if="chipsThousand >= 1">
                    <img v-for="i in chipsThousand" :key="i" :style="'z-index:' + i + ';'"
                        src="@/assets/img/poker/chips/chips_thousand.svg" alt="">
                </div>
            </div>
        </div>
        <div class="carts">
            <ul>
                <li v-for="card in boardCards" class="flip-container" v-bind:key="card">
                    <div class="flip-back-front-card-animation">
                        <img class="front" :class="{ act: card.active }"
                            :src="require(`@/assets/img/poker/carts${card.img}`)" alt="">
                        <img class="back" :src="require(`@/assets/img/poker/carts/back.svg`)" alt="">
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';

export default {
    name: 'v-poker-center',
    inject: ['suitCards', 'rankCards'],
    data() {
        return {
            boardCards: [],
            totalPot: 0,
            stepReady: false,
            socket: null,
            countUsers: 0,
            gameStart: false,
            chipsOne: 0,
            chipsTen: 0,
            chipsHundred: 0,
            chipsThousand: 0,
            boardHelper: [],
            socketIndex: null,
            winClass: ''
        }
    },
    methods: {
        ready() {
            this.socket.send({
                'type': 'ready',
                'data': {
                    "status": true
                }
            });
        },
        formatChips(data) {
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        cartHelper(data) {
            data.forEach((element) => {
                element = JSON.stringify(element)
                let myIndex = this.boardHelper.findIndex(item => JSON.stringify(item) == element)
                if (myIndex != -1) {
                    this.boardCards[myIndex].active = true
                }
            });
        },
        setWinClass(data) {
            this.winClass = data
            setTimeout(() => {
                this.totalPot = 0;
                this.winClass = '';
            }, 3000);
        },
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "NEWTURN") {
                    this.boardHelper = data.board
                    data.board.forEach((element, index) => {
                        this.boardCards[index] = { active: false, img: '' }
                        this.boardCards[index].img = "/" + this.suitCards[element[1]] + "/" + this.rankCards[element[0]] + ".svg";
                    });
                    let balance = (data.pot < 1) ? data.pot : parseInt(data.pot);
                    this.totalPot = this.formatChips(balance);

                    if (balance < 10) this.chipsOne = Math.ceil(balance)
                    balance = balance / 10;
                    this.chipsTen = Math.floor(balance % 10);
                    balance = balance / 10;
                    this.chipsHundred = Math.floor(balance % 10);
                    balance = balance / 10;
                    this.chipsThousand = Math.floor(balance % 10);

                    if (data.turn == 0) {
                        this.boardCards = [];
                    }
                }

                if (game_action === "ROUNDCLOSED") {
                    setTimeout(() => {
                        this.boardCards = [];
                        this.totalPot = 0;
                        this.winClass = '';
                    }, 3000);
                }
            });
        }
    },
    unmounted() {
        this.socket.removeListener("poker_status", this.socketIndex);
    },
    mounted() {
        this.$nextTick(function () {
            emitter.on("socket", socket => {
                this.socket = socket;
                this.socketActions();
            });
            emitter.on("cartHelper", data => { this.cartHelper(data) });
            emitter.on("chipsToUser", data => { this.setWinClass(data) });
        })
    }
}
</script>