<template>
    <div class="v-game-item game-item row">
        <div class="col-2 d-flex align-items-center justify-content-center">
            <div class="game-item_name">
                {{ game.name }}
            </div>
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
            <div class="game-item_blind">
                {{ game.small_blind }} ¥ / {{ game.big_blind }} ¥
            </div>
        </div>
        <div class="col-1 d-flex align-items-center justify-content-center">
            <div class="game-item_bet">
                {{ game.min_buyin }} ¥
            </div>
        </div>
        <div class="col-1 d-flex align-items-center justify-content-center">
            <div class="game-item_players" v-if="game.in_game_count != 1">
                {{ game.in_game_count }} / {{ game.max_seats }}
            </div>
            <div class="game-item_players" v-else>
                0 / {{ game.max_seats }}
            </div>
        </div>
        <div class="col-6 d-flex align-items-center justify-content-center">
            <div class="btn-default" @click="this.$router.push('/game/' + game.id)">
                {{ $t('game.suggest_a_match') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-game-item',
    props: {
        game: {
            type: Object,
            required: true
        }
    },
}
</script>