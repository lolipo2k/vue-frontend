<template>
    <div class="modal-background reconnect-game">
        <div class="modal-body">
            <div class="close" @click="close()"></div>
            <div class="modal-body_title">
                <h2>
                    {{ $t("home.reconnect_title") }}
                </h2>
            </div>
            <div class="modal-body_btns">
                <div class="btn-default" @click="reconnect()">
                    {{ $t("home.yes") }}
                </div>
                <div class="btn-frame" @click="close()">
                    {{ $t("home.no") }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';
export default {
    name: 'v-reconnect-game',
    methods: {
        close() {
            this.$parent.isReconnect = false;
            localStorage.removeItem('game_id')
            if (this.$route.params.game) emitter.emit("reconnectFalse", true);
        },
        reconnect() {
            this.$router.push('/game/' + localStorage.getItem('game_id'))
            if (this.$route.params.game) emitter.emit("reconnectTrue", true);
        }
    }
}
</script>