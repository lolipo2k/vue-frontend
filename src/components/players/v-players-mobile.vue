<template>
    <section class="players-content_mobile v-players-mobile">
        <div class="players-content_mobile__top d-flex justify-content-between align-items-center">
            <div class="filter-btn_mobile" @click="(this.filterOpen = true)">
                All Games
            </div>
            <div class="sort-btn_mobile">
                <img src="../../assets/img/up_down.svg" alt="" @click="(this.sortOpen = true)">
            </div>
        </div>
        <div v-if="filterOpen" class="filter-content_mobile">
            <div class="filter-content_mobile__close" @click="(this.filterOpen = false)">
                <div class="close"></div>
            </div>
            <div class="filter-content_mobile__content">
                <ul>
                    <li>
                        <img src="../../assets/img/players/dou_dizhu.svg" alt="">
                        {{ $t('players.poker') }}
                    </li>
                </ul>
            </div>
            <div class="btn-default">
                Select
            </div>
        </div>
        <div v-if="sortOpen" class="sort-content_mobile">
            <div class="sort-content_mobile__close" @click="(this.sortOpen = false)">
                <div class="close"></div>
            </div>
            <div class="sort-content_mobile__content">
                <ul>
                    <li class="act">
                        High Bets first
                    </li>
                    <li>
                        Low Bets first
                    </li>
                    <li>
                        High Rating first
                    </li>
                    <li>
                        Low Rating first
                    </li>
                </ul>
            </div>
            <div class="btn-default">
                Select
            </div>
        </div>
        <div class="players-list_content__mobile">
            <vPlayersItemMobile v-for="player in this.$parent.players" :key="player.id" :player="player" />
        </div>
    </section>
</template>
<script>
import vPlayersItemMobile from './v-players-item-mobile'

export default {
    name: 'v-players-mobile',
    components: {
        vPlayersItemMobile
    },
    data() {
        return {
            filterOpen: false,
            sortOpen: false,
        }
    },
}
</script>