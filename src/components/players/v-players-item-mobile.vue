<template>
    <div class="players-item_mobile v-players-item-mobile">
        <div class="row">
            <div class="col-6">
                <div class="players-item_mobile__img">
                    <img :src="this.currentUrl + this.player.image_medium" alt="">
                </div>
                <div class="players-item_mobile__name" @click="this.$router.push('/profile/' + this.player.id)">
                    {{ this.player.username }}
                </div>
                <div class="players-item_mobile__raiting">
                    <span>Raiting</span> -
                </div>
            </div>
            <div class="col-6 d-flex flex-column">
                <div class="players-item_mobile__game">
                    Game
                    <span>
                        -
                    </span>
                </div>
                <div class="players-item_mobile__bet">
                    Bet
                    <span>
                        - ¥
                    </span>
                </div>
            </div>
            <div class="col-12">
                <div class="btn-default">
                    Suggest a match
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'v-players-item-mobile',
    inject: ['currentUrl'],
    props: {
        player: {
            type: Object,
            required: true
        }
    },
}
</script>