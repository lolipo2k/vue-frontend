<template>
    <section class="game-content_mobile v-game-mobile">
        <h1>
            <span>{{ $t('game.or') }}</span>
            {{ $t('game.choose_an_opponent') }}
        </h1>
        <div class="row d-flex flex-nowrap">
            <div class="col-12 game-list">
                <div class="game-list_content__mobile">
                    <vGameItemMobile v-for="game in this.$parent.games" :key="game.id" :game="game" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import vGameItemMobile from "./v-game-item-mobile";

export default {
    name: 'v-game-mobile',
    components: {
        vGameItemMobile
    },
}
</script>