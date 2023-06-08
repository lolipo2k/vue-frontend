<template>
    <div class="control-table_left">
        <div class="control-table_left-auto">
            <ul>
                <li><input type="checkbox" @change="check('callFold')" id="callFold" v-model="callFold"> <label
                        for="callFold">{{ $t('poker.auto_check_fold') }}</label>
                </li>
                <li><input type="checkbox" @change="check('fold')" id="fold" v-model="fold"> <label for="fold">
                        {{ $t('poker.auto_fold') }}</label></li>
                <li><input type="checkbox" @change="check('call')" id="call" v-model="call"> <label for="call">
                        {{ $t('poker.auto_call') }}
                    </label></li>
            </ul>
        </div>
        <div class="control-table_left-logs">
            <div class="logs-content">
                <div class="logs-content__item" v-for="log in dataLogs" :key="log">
                    {{ log }}
                </div>
            </div>
        </div>
        <div class="control-table_left-btns">
            <div class="btn-default leave" @click="leave_seat()">
                {{ $t('poker.stand_up') }}
            </div>
            <div class="btn-default" @click="(isOpen = true)">
                {{ $t('poker.buy_chips') }}
            </div>
        </div>
    </div>

    <div class="modal-background" v-if="isOpen">
        <div class="modal-body buyin-range">
            <div class="close" @click="(isOpen = false)"></div>
            <h2>
                {{ $t('poker.buy_chips') }}
            </h2>
            <div class="buyin-range_content">
                <div class="buyin-range_content-value">
                    <input type="number" v-model.number="chipsBuyin"
                        :max="min($parent.dataBuyin.max - $parent.playerBalance, Number(profileData.chips) - $parent.playerBalance)"
                        :min="0">
                </div>
                <div class="buyin-range_content-slider">
                    <input type="range" step="1" v-model="chipsBuyin"
                        :max="min($parent.dataBuyin.max - $parent.playerBalance, Number(profileData.chips) - $parent.playerBalance)"
                        :min="0">
                </div>
            </div>
            <div class="btn-default" @click="(isOpen = false), buyChips()">
                {{ $t('poker.choose') }}
            </div>
        </div>
    </div>
</template>
<script>
import emitter from '@/main';

export default {
    name: 'v-poker-controls-left',
    data() {
        return {
            callFold: false,
            fold: false,
            call: false,
            profileData: {},
            isOpen: false,
            chipsBuyin: 0,
            dataLogs: ['Good luck!'],
            socketIndex: null,
        }
    },
    methods: {
        min(a, b) {
            a = Number(a)
            b = Number(b)
            return (a < b) ? a : b;
        },
        check(data) {
            switch (data) {
                case 'callFold':
                    this.fold = false
                    this.call = false
                    break;
                case 'fold':
                    this.callFold = false
                    this.call = false
                    break;
                case 'call':
                    this.callFold = false
                    this.fold = false
                    break;
            }
        },
        leave_seat() {
            emitter.emit("statusGame", false);
            this.$parent.socket.send({
                'type': 'leave_seat',
                'data': {
                    'action': 'leave_seat',
                    'params': {}
                }
            });
        },
        foldAction() {
            this.$parent.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'fold',
                    'params': {}
                }
            });
        },
        callAction() {
            this.$parent.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'call',
                    'params': {}
                }
            });
        },
        buyChips() {
            this.$parent.playerBalance += Number(this.chipsBuyin)
            this.$parent.socket.send({
                'type': 'buy_chips',
                'data': {
                    'action': 'buy_chips',
                    "chips": this.chipsBuyin,
                }
            });
            this.chipsBuyin = 0;
        },
        callFoldAction() {
            (this.$parent.callChips == 0) ? this.callAction() : this.foldAction()
        },
        autoAction() {
            if (this.callFold) this.callFoldAction()
            if (this.fold) this.foldAction()
            if (this.call) this.callAction()
        },
        socketActions() {
            if (this.socketIndex != null) this.$parent.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.$parent.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "NEWTURN") {
                    this.callFold = false
                    this.fold = false
                    this.call = false
                }
                if (game_action === 'PLAYERACTIONREQUIRED') {
                    if (data.player_id == this.profileData.id) {
                        this.autoAction()
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
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            emitter.on("addLog", data => {
                this.dataLogs.unshift(data)
            });
        })
    }
}
</script>
