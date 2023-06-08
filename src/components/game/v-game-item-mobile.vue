<template>
    <div class="game-item_mobile v-game-item-mobile">
        <div class="row">
            <div class="col-6">
                <div class="game-item_mobile__name">
                    {{ game.name }}
                </div>
                <div class="game-item_mobile__raiting">
                    <span>{{ $t('game.players') }}</span>
                    <div class="game-item_players" v-if="game.in_game_count != 1">
                        {{ game.in_game_count }} / {{ game.max_seats }}
                    </div>
                    <div class="game-item_players" v-else>
                        0 / {{ game.max_seats }}
                    </div>
                </div>
            </div>
            <div class="col-6 d-flex flex-column">
                <div class="game-item_mobile__blind">
                    {{ $t('game.small_big_blind') }}
                    <span>
                        {{ game.small_blind }} ¥/{{ game.big_blind }} ¥
                    </span>
                </div>
                <div class="game-item_mobile__bet">
                    {{ $t('game.bet') }}
                    <span>
                        {{ game.min_buyin }} ¥
                    </span>
                </div>
            </div>
            <div class="col-12">
                <div class="btn-default" @click="this.$router.push('/game/' + game.id)">
                    {{ $t('game.suggest_a_match') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-game-item-mobile',
    props: {
        game: {
            type: Object,
            required: true
        }
    },
}
</script>