<template>
    <div class="poker-players_item v-poker-players" v-for="(value, i) in playersData" :key="value.id"
        :class="[(!value.my && inGame) ? 'poker-players_' + value.rotate : '', (!value.my && !inGame) ? 'poker-players_' + value.status : '', { 'my-player poker-players_my': value.my, 'another-player': !value.my }]">
        <vPokerPlayerMy v-if="value.my" :player="value"></vPokerPlayerMy>
        <vPokerPlayer v-else :player="value" :index="i"></vPokerPlayer>
    </div>
    <div class="poker-players_item" v-for="(value, i) in number" :key="i" :class="'poker-players_' + value.class">
        <vPokerSeat v-if="!inGame && isMax" :number="value.class" :index="value.index"></vPokerSeat>
    </div>
    <vPokerSounds ref="sounds" />
</template> 
<script>
import vPokerPlayerMy from "./v-poker-player-my.vue";
import vPokerPlayer from "./v-poker-player.vue";
import vPokerSounds from "./v-poker-sounds.vue";
import vPokerSeat from "./v-poker-seat.vue";

import emitter from '@/main';

export default {
    name: 'v-poker-players',
    inject: ['suitCards', 'rankCards'],
    components: {
        vPokerPlayerMy,
        vPokerPlayer,
        vPokerSounds,
        vPokerSeat
    },
    computed: {
        sizeBetweenPlayer() {
            return Math.round(400 / (this.playersData.length - 1)) + 'px';
        },
        centerIndex() {
            return (this.playersData.length - 1) / 2;
        }
    },
    data() {
        return {
            playersData: [],
            number: [
                { class: 'nine', index: 0 },
                { class: 'two', index: 1 },
                { class: 'four', index: 2 },
                { class: 'six', index: 3 },
                { class: 'eight', index: 4 },
                { class: 'seven', index: 5 },
                { class: 'five', index: 6 },
                { class: 'three', index: 7 },
                { class: 'one', index: 8 },
            ],
            numberRotate: [
                { class: 'nine', index: 0, round: 5 },
                { class: 'two', index: 1, round: 4 },
                { class: 'four', index: 2, round: 3 },
                { class: 'six', index: 3, round: 2 },
                { class: 'eight', index: 4, round: 1 },
                { class: 'my', index: 5, round: 0 },
                { class: 'seven', index: 6, round: 9 },
                { class: 'five', index: 7, round: 8 },
                { class: 'three', index: 8, round: 7 },
                { class: 'one', index: 9, round: 6 },
            ],
            profileData: {},
            socket: null,
            inGame: false,
            hand: [this.$t("poker.high_card"), this.$t("poker.one_pair"), this.$t("poker.two_pair"), this.$t("poker.three_kind"), this.$t("poker.straight"), this.$t("poker.flush"), this.$t("poker.full_house"), this.$t("poker.four_kind"), this.$t("poker.straight_flush")],
            socketIndex: null,
            isMax: false,
        }
    },
    methods: {
        start() {
            emitter.emit("gameStart", true);
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'start',
                    'params': {}
                }
            });
        },
        maxSeats(data) {
            this.isMax = true
            this.number = this.number.slice(0, data);
        },
        rotatePlaces() {
            let index = this.playersData.findIndex(player => player.my == true);
            if (index != -1) {
                let roundIndex = this.numberRotate.findIndex(item => item.class == this.playersData[index].status);
                let round = this.numberRotate[roundIndex].round;
                this.playersData.forEach(element => {
                    let statusIndex = this.numberRotate.findIndex(item => item.class == element.status);
                    if (statusIndex + round > 9) {
                        element.rotate = this.numberRotate[statusIndex + round - 10].class
                    }
                    else {
                        element.rotate = this.numberRotate[statusIndex + round].class
                    }
                });
            }
        },
        formatChips(data) {
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        tableUsers(data) {
            this.playersData = []
            data.forEach((element) => {
                element.cards = [];
                element.action = '';
                element.rotate = '';
                element.chips = Number(element.chips).toFixed(2);

                element.my = this.profileData.id == element.id;
                this.playersData.push(element)
            });
            if (this.playersData.length >= 2) this.start()
        },
        statusUsers(data) {
            Object.keys(data).forEach((element) => {
                let index = this.playersData.findIndex(player => player.id == element);
                this.playersData[index].status = data[element]

                let deleteIndex = this.number.findIndex(item => item.class == data[element]);
                if (deleteIndex !== -1) {
                    this.playersData[index].statusIndex = this.number[deleteIndex].index
                    this.number.splice(deleteIndex, 1);
                }
            });
        },
        deleteUser(id) {
            let index = this.playersData.findIndex(element => element.id == id);
            if (index != -1) {
                let object = { class: this.playersData[index].status, index: this.playersData[index].statusIndex }
                this.number.push(object);
                this.playersData.splice(index, 1);
            }
        },
        addUser(data) {
            let user = data.user;
            let item = this.playersData.find(element => element.id == user.id);
            if (!item) {

                user.status = data.seat;

                let deleteIndex = this.number.findIndex(element => element.class == data.seat);
                if (deleteIndex !== -1) {
                    user.statusIndex = this.number[deleteIndex].index
                    this.number.splice(deleteIndex, 1);
                }

                user.chips = Number(user.chips).toFixed(2);
                user.cards = [];
                user.action = '';
                user.rotate = '';

                user.my = this.profileData.id == user.id;
                this.playersData.push(user);
                this.rotatePlaces()
            }
            if (this.playersData.length >= 2) this.start()
        },
        publicCard(data) {
            let index = this.playersData.findIndex(element => element.id == data.player_id);
            data.cards.forEach((element, idx) => {
                this.playersData[index].cards[idx] = "/" + this.suitCards[element[1]] + "/" + this.rankCards[element[0]] + ".svg";
            });
        },
        setAction(action, data) {
            let index = this.playersData.findIndex(element => element.id == data.player_id);
            if (index != -1) this.playersData[index].action = action;
        },
        gameBet(id, money, profileBalance) {
            let index = this.playersData.findIndex(element => element.id == id);

            let balance = Number(profileBalance).toFixed(2);
            this.playersData[index].chips = balance;
            let action = { player_id: id, money: balance }
            emitter.emit("playerBalanceGame", action);

            let info = [id, money]
            emitter.emit("changeBet", info);
        },
        buyChips(dataChips) {
            let index = this.playersData.findIndex(element => element.id == dataChips.player_id);
            let balance = Number(dataChips.balance).toFixed(2);
            console.log(this.playersData[index], balance);
            this.playersData[index].chips = balance;

            let data = {
                player_id: dataChips.id,
                money: balance,
            }

            emitter.emit("playerBalanceGame", data);
        },
        addLogWinner(handname, id) {
            let action = this.hand[handname]
            let index = this.playersData.findIndex(element => element.id == id);
            let name = this.playersData[index].username;
            let log = this.$t("poker.player") + name + this.$t("poker.win_with") + action;
            emitter.emit("addLog", log);
        },
        addLogAction(action, id) {
            let index = this.playersData.findIndex(element => element.id == id);
            if (index != -1) {
                let name = this.playersData[index].username;
                let log = this.$t("poker.player") + name + ' ' + action;
                emitter.emit("addLog", log);
            }
        },
        choiceLog(data) {
            let index = this.playersData.findIndex(element => element.id == data.player_id);
            let name = this.playersData[index].username;
            let log = this.$t("poker.player") + name + this.$t("poker.show_card");
            emitter.emit("addLog", log);
        },
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {

                if (game_action === 'PLAYERSINGAME') {
                    this.tableUsers(data.players)
                    this.statusUsers(data.players_seats)
                }

                if (game_action === "PLAYERREMOVED") {
                    this.deleteUser(data.player_id)
                    if (data.player_id == this.profileData.id) emitter.emit("statusGame", false);
                }

                if (game_action === "USERPROFILEJOINED") {
                    this.addUser(data)
                    if (data.reconnect) {
                        emitter.emit("statusGame", true);
                        this.rotatePlaces()
                    }
                }

                if (game_action === "DEALTCARDS") {
                    this.$refs.sounds.$refs.cardsStartSound.play();
                }

                if (game_action === "PUBLICCARDSHOW") {
                    this.publicCard(data)
                }

                if (game_action === "NEWROUNDSTARTED") {
                    emitter.emit("gameStart", true);
                }

                if (game_action === "PLAYERREVEALCARDS") {
                    this.publicCard(data)
                }

                if (game_action === "BUYCHIPS") {
                    this.buyChips(data)
                }

                if (game_action === "PLAYERCHOICEREQUIRED") {
                    this.choiceLog(data)
                }

                if (game_action === "NEWTURN") {
                    if (data.turn != 0) {
                        emitter.emit("animation", true);
                        setTimeout(() => {
                            this.playersData.forEach((element) => {
                                element.action = '';
                            });
                        }, 1000);
                    }
                    else {
                        this.playersData.forEach((element) => {
                            element.action = '';
                        });
                    }
                    if (data.ingame) emitter.emit("gameStart", true);
                    this.$refs.sounds.$refs.cardAddSound.play();
                }

                if (game_action === "PLAYERBALANCE") {
                    let index = this.playersData.findIndex(element => element.id == data.player_id);
                    this.playersData[index].chips = Number(data.money).toFixed(2);
                    emitter.emit("playerBalanceGame", data);
                }

                if (game_action === "PLAYERCALL") {
                    this.setAction(this.$t("poker.call"), data);
                    emitter.emit("timeFinish", true);
                    this.gameBet(data.player_id, data.turn_stake, data.balance)
                    this.$refs.sounds.$refs.chipsSoundRaise.play();
                    this.addLogAction(this.$t("poker.call"), data.player_id);
                }

                if (game_action === "PLAYERCHECK") {
                    this.setAction(this.$t("poker.check"), data);
                    emitter.emit("timeFinish", true);
                    this.$refs.sounds.$refs.checkSound.play();
                    this.addLogAction(this.$t("poker.check"), data.player_id);
                }

                if (game_action === "PLAYERRAISE") {
                    this.setAction(this.$t("poker.raise"), data);
                    emitter.emit("timeFinish", true);
                    this.gameBet(data.player_id, data.turn_stake, data.balance)
                    this.$refs.sounds.$refs.chipsSoundRaise.play();
                    this.addLogAction(this.$t("poker.raise"), data.player_id);
                }

                if (game_action === "PLAYERFOLD") {
                    this.setAction(this.$t("poker.fold"), data);
                    emitter.emit("timeFinish", true);
                    this.$refs.sounds.$refs.foldSound.play();
                    this.addLogAction(this.$t("poker.fold"), data.player_id);
                }

                if (game_action === "PLAYERISALLIN") {
                    this.setAction(this.$t("poker.all_in"), data);
                    emitter.emit("timeFinish", true);
                    this.$refs.sounds.$refs.allInSound.play();
                    this.addLogAction(this.$t("poker.all_in"), data.player_id);
                }

                if (game_action === "PLAYERACTIONREQUIRED") {
                    emitter.emit("moveIdTime", data);
                }

                if (game_action === "DECLAREFINISHEDWINNER" || game_action === 'DECLAREPREMATUREWINNER') {
                    this.moveId = 0;
                    emitter.emit("moveId", 0);

                    this.playersData.forEach((element) => {
                        element.action = '';
                    });

                    if (data.handname) this.addLogWinner(data.handname, data.player_id);

                    this.setAction(this.$t("poker.winner"), data);

                    let index = this.playersData.findIndex(element => element.id == data.player_id);
                    this.playersData[index].chips = (Number(data.player_balance)).toFixed(2);
                }

                if (game_action === "ROUNDCLOSED") {
                    setTimeout(() => {
                        emitter.emit("gameStart", false);
                        this.playersData.forEach((element) => {
                            element.cards = [];
                            element.action = '';
                            if (this.playersData.length >= 2) this.start()
                        });
                    }, 5000);
                }

                if (game_action === "ZEROBALANCE") {
                    let index = this.playersData.findIndex(element => element.id == data.player_id);
                    let name = this.playersData[index].username;
                    let log = this.$t("poker.player") + name + this.$t("poker.out_balance");
                    emitter.emit("addLog", log);

                    this.deleteUser(data.player_id)
                    if (data.player_id == this.profileData.id) emitter.emit("statusGame", false);
                }

                if (game_action === "SMALLBLIND") {
                    let info = [data.player_id, data.paid_amount]
                    emitter.emit("changeBet", info);
                }

                if (game_action === "BIGBLIND") {
                    let info = [data.player_id, data.paid_amount]
                    emitter.emit("changeBet", info);
                }
            });
        }
    },
    unmounted() {
        this.socket.removeListener("poker_status", this.socketIndex);
    },
    mounted() {
        this.$nextTick(function () {
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            emitter.on("socket", socket => {
                this.socket = socket;
                this.socketActions();
            });
            emitter.on("action", data => { this.setAction(data[0], data[1]) });
            emitter.on("clearActions", () => {
                this.playersData.forEach((element) => { element.action = '' });
            });
            emitter.on("statusGame", data => {
                this.inGame = data
            });
            emitter.on("seat", () => {
                this.rotatePlaces()
            });
            emitter.on("maxSeats", data => {
                this.maxSeats(data)
            });
        })
    }
}
</script>


<style>
:root {
    --target-offset: 0;
}

.poker-players .another-player:nth-child(1) {
    --target-offset: calc((v-bind('centerIndex') - 1) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(2) {
    --target-offset: calc((v-bind('centerIndex') - 2) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(3) {
    --target-offset: calc((v-bind('centerIndex') - 3) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(4) {
    --target-offset: calc((v-bind('centerIndex') - 4) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(5) {
    --target-offset: calc((v-bind('centerIndex') - 5) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(6) {
    --target-offset: calc((v-bind('centerIndex') - 6) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(7) {
    --target-offset: calc((v-bind('centerIndex') - 7) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(8) {
    --target-offset: calc((v-bind('centerIndex') - 8) * v-bind('sizeBetweenPlayer'));
}

.poker-players .another-player:nth-child(9) {
    --target-offset: calc((v-bind('centerIndex') - 9) * v-bind('sizeBetweenPlayer'));
}

.user-carts.give-animation div {
    position: relative;
}

.user-carts.give-animation div:nth-child(1) {
    animation-name: moving-to-target;
    animation-fill-mode: both;
    animation-duration: 1.5s;
    animation-delay: 0.1s;
}

.user-carts.give-animation div:nth-child(2) {
    animation-name: moving-to-target;
    animation-fill-mode: both;
    animation-duration: 1.5s;
    animation-delay: 0.5s;
}

.user-carts.give-me-animation div:nth-child(2) {
    animation-name: moving-to-me;
    animation-fill-mode: both;
    animation-duration: 1.5s;
    animation-delay: 0.5s;
}

.user-carts.give-me-animation div:nth-child(1) {
    animation-name: moving-to-me;
    animation-fill-mode: both;
    animation-duration: 1.5s;
    animation-delay: 0.1s;
}

.flip-container {
    perspective: 1000px;
}

.flip-back-front-card-animation .back {
    position: absolute;
    left: 0;
    top: 0;
    animation-name: flip-front-back-card;
    animation-fill-mode: both;
    animation-duration: 0.5s;
}

.carts .flip-back-front-card-animation {
    width: 70px;
    height: 120px;
}

.user-carts .flip-back-front-card-animation {
    width: 65px;
    height: 91px;
}

.flip-back-front-card-animation {
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s;
}

.flip-back-front-card-animation .front {
    position: absolute;
    left: 0;
    top: 0;
    animation-name: flip-back-front-card;
    animation-fill-mode: both;
    animation-duration: 0.5s;
}


@keyframes flip-back-front-card {
    from {
        transform: rotateY(0deg) translateY(-30px);
        opacity: 0;
    }

    to {
        transform: rotateY(360deg) translateY(0);
        opacity: 1;
    }
}

@keyframes flip-front-back-card {
    from {
        transform: rotateY(-360deg) translateY(-30px);
        opacity: 1;
    }

    to {
        transform: rotateY(0deg) translateY(0);
        opacity: 0;
    }
}

@keyframes moving-to-me {

    /* animate from: center of current view */
    from {
        transform: translateY(-150px);
        opacity: 0;
    }

    /* animate to: its original position */
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes moving-to-target {

    /* animate from: center of current view */
    from {
        transform: translateY(150px) translateX(var(--target-offset));
        opacity: 0;
    }

    /* animate to: its original position */
    to {
        transform: translateY(0) translateX(0);
        opacity: 1;
    }
}

@media (max-width: 1150px) {
    .user-carts .flip-back-front-card-animation {
        height: 50px;
    }
}
</style>