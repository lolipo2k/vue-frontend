<template>
    <div class="control-table v-poker-conrols" v-if="inGame">
        <vPokerControlsLeft></vPokerControlsLeft>
        <div class="control-table_right" :class="{ disbl: moveId != profileData.id }">
            <div class="control-table_raise-btns">
                <div class="btn-poker" @click="raiseOn = (playerBalance * 0.3).toFixed(2)">
                    30 %
                </div>
                <div class="btn-poker" @click="raiseOn = (playerBalance * 0.5).toFixed(2)">
                    50 %
                </div>
                <div class="btn-poker" @click="raiseOn = (playerBalance * 0.8).toFixed(2)">
                    80 %
                </div>
                <div class="btn-poker" @click="raiseOn = (playerBalance).toFixed(2)">
                    {{ $t('poker.all_in') }}
                </div>
            </div>
            <div class="control-table_raise-slider">
                <input class="control-table_raise-slider__value" type="number" v-model="raiseOn" :max="playerBalance"
                    @input="() => { if (raiseOn > playerBalance || raiseOn < 0) { raiseOn = playerBalance } }">
                <input type="range" v-model="raiseOn" :max='playerBalance' step="1">
            </div>
            <div class="control-table_btns">
                <div class="btn-poker" @click="fold()" v-if="callChips > 0">
                    {{ $t('poker.fold') }}
                </div>
                <div class="btn-poker" @click="call()" v-if="callChips > 0">
                    {{ $t('poker.call') }}
                    <span>
                        {{ callChips }}
                    </span>
                </div>
                <div class="btn-poker" @click="check()" v-else>
                    {{ $t('poker.check') }}
                </div>
                <div class="btn-poker" :class="(raiseOn == 0) ? 'disbl' : ''" @click="raise()" v-if="callChips > 0">
                    {{ $t('poker.raise_on') }}
                    <span>
                        {{ raiseOn }}
                    </span>
                </div>
                <div class="btn-poker" :class="(raiseOn == 0) ? 'disbl' : ''" @click="raise()" v-else>
                    {{ $t('poker.bet') }}
                    <span>
                        {{ raiseOn }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="control-table v-poker-conrols leave" v-else>
        <div class="control-table_left">
            <div class="control-table_left-btns">
                <div class="btn-default leave" @click="leave()">
                    {{ $t('poker.leave_room') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import emitter from '@/main';
import vPokerControlsLeft from './v-poker-controls-left.vue'

export default {
    name: 'v-poker-conrols',
    components: {
        vPokerControlsLeft
    },
    data() {
        return {
            moveId: 0,
            profileData: {},
            socket: null,
            callChips: 0,
            raiseOn: 0,
            playerBalance: 0,
            inGame: false,
            dataBuyin: {
                min: 0,
                max: 0
            },
            socketIndex: null,
        }
    },
    methods: {
        leave() {
            if (localStorage.getItem('game_id') !== null) {
                localStorage.removeItem('game_id')
            }
            emitter.emit("isReconnect", false);
            this.$router.push('/game')
        },
        fold() {
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'fold',
                    'params': {}
                }
            });
        },
        call() {
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'call',
                    'params': {}
                }
            });
        },
        check() {
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'check',
                    'params': {}
                }
            });
        },
        raise() {
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'raise',
                    'params': { "raise_by": Number(this.raiseOn) }
                }
            });
        },
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === 'PLAYERACTIONREQUIRED') {
                    this.moveId = data.player_id;
                    this.callChips = Number(data.to_call).toFixed(2)
                    if (this.callChips > this.playerBalance) this.callChips = Number(this.playerBalance).toFixed(2)
                }

                if (game_action === "NEWTURN") {
                    this.raiseOn = 0;
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
            emitter.on("moveId", data => { this.moveId = data });
            emitter.on("seat", () => { this.inGame = true });
            emitter.on("gameDetail", data => { this.dataBuyin = data });
            emitter.on("playerBalance", data => { this.playerBalance = data });
            emitter.on("playerBalanceGame", data => {
                if (data.player_id == this.profileData.id) this.playerBalance = data.money
            });
            emitter.on("statusGame", data => { this.inGame = data });
        })
    }
}
</script>