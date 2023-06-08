<template>
    <div class="players-item row v-players-item">
        <div class="col-3 d-flex align-items-center justify-content-center">
            <div class="players-item_img">
                <img :src="this.currentUrl + this.player.image_medium" alt="">
            </div>
            <div class="players-item_name" @click="this.$router.push('/profile/' + this.player.id)">
                {{ this.player.username }}
            </div>
        </div>
        <div class="col-3 d-flex align-items-center justify-content-center">
            <div class="players-item_game">
                -
            </div>
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
            <div class="players-item_bet">
                -
            </div>
        </div>
        <div class="col-1 d-flex align-items-center justify-content-center">
            <div class="players-item_raiting">
                -
            </div>
        </div>
        <div class="col-3 d-flex align-items-center justify-content-center">
            <div class="btn-default">
                {{ $t('players.suggest_a_match') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-players-item',
    inject: ['currentUrl'],
    props: {
        player: {
            type: Object,
            required: true
        }
    },
}
</script>