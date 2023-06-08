<template>
    <section class="players-content v-players-desktop">
        <div class="row d-flex flex-nowrap">
            <div class="col-12 col-xl-9 players-list">
                <div class="players-list_header row">
                    <div class="col-3">
                        {{ $t('players.username') }}
                    </div>
                    <div class="col-3">
                        {{ $t('players.game') }}
                    </div>
                    <div class="col-2">
                        {{ $t('players.bet') }}
                    </div>
                    <div class="col-1">
                        {{ $t('players.raiting') }}
                    </div>
                </div>
                <div class="players-list_content">
                    <vPlayersItem v-for="player in this.$parent.players" :key="player.id" :player="player" />
                </div>
            </div>
            <div class="col-12 col-xl-3 games-filter">
                <h5>
                    {{ $t('players.list_of_games') }}
                </h5>
                <ul class="games-filter_list">
                    <li class="games-filter_item">
                        <img src="../../assets/img/players/dou_dizhu.svg" alt="">
                        {{ $t('players.poker') }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
import vPlayersItem from "./v-players-item";

export default {
    name: 'v-players-desktop',
    components: {
        vPlayersItem
    },
}
</script>