<template>
    <div v-if="zeroBalance" class="modal-background v-poker-zero">
        <div class="modal-body zero-balance">
            <div class="close" @click="(zeroBalance = false)"></div>
            <h2>
                {{ $t('poker.balance_over') }}
            </h2>
            <div class="modal-body_btns">
                <div class="btn-default" @click="zeroBalance = false">
                    {{ $t('poker.back_game') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import emitter from '@/main';
import params from "@/params";

export default {
    name: 'v-poker-zero',
    inject: ['currentUrl'],
    data() {
        return {
            zeroBalance: false,
            profileData: {},
            socket: null,
            ws: params.WS_BASE_URL,
            socketIndex: null,
        }
    },
    methods: {
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "ZEROBALANCE") {
                    if (this.profileData.id == data.player_id) {
                        this.zeroBalance = true;
                    }
                }
            });
        },
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
        })
    }
}
</script>