<template>
    <div v-if="choiceRequired" class="modal-background v-poker-choice">
        <div class="modal-body choice-required">
            <h2>
                {{ $t('poker.reveal_cards') }}
            </h2>
            <div class="modal-body_btns">
                <div class="btn-default" @click="choiceRequired = false, showCards(true)">
                    {{ $t('home.yes') }}
                </div>
                <div class="btn-frame" @click="choiceRequired = false, showCards(false)">
                    {{ $t('home.no') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';

export default {
    name: 'v-poker-choice',
    data() {
        return {
            socket: null,
            choiceRequired: false,
            profileData: {},
            socketIndex: null,
        }
    },
    methods: {
        showCards(boolean) {
            this.socket.send({
                'type': 'poker_action',
                'data': {
                    'action': 'show_cards',
                    'params': { "show_cards": boolean }
                }
            });
        },
        socketActions() {
            if (this.socketIndex != null) this.socket.removeListener("poker_status", this.socketIndex);
            this.socketIndex = this.socket.on('poker_status', ({ data: data, game_action }) => {
                if (game_action === "PLAYERCHOICEREQUIRED") {
                    console.log(data.player_id)
                    console.log(this.profileData.id)
                    if (this.profileData.id == data.player_id) {
                        this.choiceRequired = true
                    }
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
        })
    }
}
</script>