<template>
    <div v-if="enoughChips" class="modal-background v-poker-chips">
        <div class="modal-body enough-chips">
            <div class="close" @click="enoughChips = false"></div>
            <h2>
                {{ $t('poker.enough_money') }}
            </h2>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';

export default {
    name: 'v-poker-chips',
    data() {
        return {
            enoughChips: false,
            socket: null,
            socketIndex: null,
        }
    },
    methods: {
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "NOTENOUGHCHIPS") {
                    console.log(data);
                    this.enoughChips = true
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
        })
    }
}
</script>