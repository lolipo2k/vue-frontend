<template>
    <section class="game-content v-game-desktop">
        <h1>
            <span>{{ $t('game.or') }}</span>
            {{ $t('game.choose_an_opponent') }}
        </h1>
        <div class="row d-flex flex-nowrap">
            <div class="col-12 game-list">
                <div class="game-list_header row">
                    <div class="col-2">
                        {{ $t('game.username') }}
                    </div>
                    <div class="col-2">
                        {{ $t('game.small_big_blind') }} 
                    </div>
                    <div class="col-1">
                        {{ $t('game.bet') }}
                    </div>
                    <div class="col-1">
                        {{ $t('game.players') }}
                    </div>
                </div>
                <div class="game-list_content">
                    <vGameItem v-for="game in this.$parent.games" :key="game.id" :game="game" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import vGameItem from "./v-game-item";

export default {
    name: 'v-game-desktop',
    components: {
        vGameItem
    },
}
</script>