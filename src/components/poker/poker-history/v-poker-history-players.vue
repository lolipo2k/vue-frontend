<template>
    <div v-for="player in players" :key="player.player_game_id" class="history-content_body-info__top-players_item"
        :class="'history-content_body-info__top-players_' + player.seat_class">
        <div class="user-info">
            <div class="user-info_img" v-if="player.player">
                <img :src="player.player.image_medium" alt="">
            </div>
            <div class="user-info_img" v-else>
                <img :src="currentUrl + '/media/default.jpeg'" alt="">
            </div>
            <div class="user-info_name">
                {{ player.player_name }}
            </div>
            <div class="user-info_score">
                {{ formatChips(player.money) }} ¥
            </div>
        </div>
        <div class="user-action" v-if="isWinner(player.player_game_id)">
            {{ $t('poker.winner') }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-poker-history-players',
    inject: ['currentUrl'],
    props: ['players', 'winners'],
    methods: {
        formatChips(data) {
            if (data == 0) return 0;
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        isWinner(id) {
            let index = this.winners.findIndex(element => element.player_id == id);
            return (index != -1) ? true : false;
        }
    },
}
</script>