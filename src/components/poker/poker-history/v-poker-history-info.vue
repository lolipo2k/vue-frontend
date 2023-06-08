<template>
    <div class="history-content_body-info" v-if="tableInfo.table_freeze">
        <div class="history-content_body-info__top"
            v-bind:style="{ backgroundImage: 'url(' + require('@/assets/img/poker/poker_background.jpg') + ')' }">
            <div class="history-content_body-info__top-img">
                <img src="@/assets/img/poker/poker_table.svg" alt="">
            </div>
            <div class="history-content_body-info__top-players">
                <vPokerHistoryPlayers :players="tableInfo.table_freeze.players" :winners="tableInfo.table_freeze.winners">
                </vPokerHistoryPlayers>
            </div>
            <div class="history-content_body-info__top-center">
                <vPokerHistoryCenter :cards="tableInfo.table_freeze.table_cards">
                </vPokerHistoryCenter>
            </div>
        </div>

        <div class="history-content_body-info__bottom">

            <div class="history-content_body-info__bottom-item" v-for="(item, index) in rounds" :key="index">
                <div class="history-content_body-info__bottom-item_top">
                    {{ item.name }}
                    <span v-if="index != 0 && tableInfo.table_freeze.turn_stake">
                        {{ formatChips(tableInfo.table_freeze.turn_stake[index - 1]) }} ¥
                    </span>
                </div>
                <div class="history-content_body-info__bottom-item_list">
                    <div class="user-move" v-for="move in filterOutput(index)" :key="move.id"
                        :class="(profileData.id == move.player_game_id) ? 'my' : ''">
                        <div class="user-move_img" v-if="move.player && profileData.id != move.player_game_id">
                            <img :src="move.player.image_medium" alt="">
                        </div>
                        <div class="user-move_img" v-else-if="profileData.id != move.player_game_id">
                            <img :src="defaultImg" alt="">
                        </div>
                        <div class="user-move_info-title"
                            v-if="profileData.id != move.player_game_id && winner.includes(move.action)">
                            {{ move.player_name }}
                        </div>
                        <div class="user-move_info">
                            <div class="user-move_info-title"
                                v-if="profileData.id != move.player_game_id && !winner.includes(move.action)">
                                {{ move.player_name }}
                            </div>
                            <div class="user-move_info-action"
                                v-if="!cards.includes(move.action) && !winner.includes(move.action)">
                                {{ actions.get(`${move.action}`) }}
                                &nbsp;
                                <span v-if="move.value != null">
                                    {{ formatChips(move.value) }} ¥
                                </span>
                            </div>
                            <div class="user-move_info-action" v-else-if="!winner.includes(move.action)">
                                <div v-for="card in move.additional_info.cards" :key="card">
                                    <img :src="require('@/assets/img/poker/carts/' + this.suitCards[card[1]] + '/' + this.rankCards[card[0]] + '.svg')"
                                        alt="">
                                </div>
                            </div>
                            <div class="user-move_winner" v-if="winner.includes(move.action)">
                                <div class="win-info">
                                    WINS
                                    {{ formatChips(move.value) }} ¥
                                </div>
                                <div v-for="card in move.additional_info.hand" :key="card">
                                    <img :src="require('@/assets/img/poker/carts/' + this.suitCards[card[1]] + '/' + this.rankCards[card[0]] + '.svg')"
                                        alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import emitter from '@/main';

import vPokerHistoryPlayers from './v-poker-history-players.vue';
import vPokerHistoryCenter from './v-poker-history-center.vue';

export default {
    name: 'v-poker-history-info',
    inject: ['currentUrl', 'suitCards', 'rankCards'],
    components: {
        vPokerHistoryPlayers,
        vPokerHistoryCenter
    },
    data() {
        return {
            defaultImg: this.currentUrl + '/media/default.jpeg',
            currentIndex: 0,
            tableInfo: [],
            profileData: {},
            actions: new Map([
                ['SMALLBLIND', 'SB'],
                ['BIGBLIND', 'BB'],
                ['PLAYERCALL', this.$t("poker.call")],
                ['PLAYERCHECK', this.$t("poker.check")],
                ['PLAYERRAISE', this.$t("poker.raise")],
                ['PLAYERFOLD', this.$t("poker.fold")],
                ['PLAYERISALLIN', this.$t("poker.all_in")]
            ]),
            winner: ['DECLAREFINISHEDWINNER', 'DECLAREPREMATUREWINNER'],
            cards: ['PLAYERREVEALCARDS', 'PUBLICCARDSHOW'],
            rounds: [
                { name: this.$t("poker.blinds") },
                { name: this.$t("poker.pre_flop") },
                { name: this.$t("poker.flop") },
                { name: this.$t("poker.turn") },
                { name: this.$t("poker.river") },
            ]
        }
    },
    methods: {
        formatChips(data) {
            if (data == 0) return 0;
            let balance = Number(data % 1000).toFixed(2);
            if (balance == 0) balance = ''
            let thousands = Math.floor(data / 1000);
            return (thousands > 0) ? thousands + 'k ' + balance : balance;
        },
        filterOutput(data) {
            return this.tableInfo.outputs.filter(item => item.turn_number == data)
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            emitter.on("setIndexHistory", index => {
                this.currentIndex = index
            });
            emitter.on("setTableInfo", data => {
                this.tableInfo = data[this.currentIndex]
                console.log(this.tableInfo)
            });
        })
    }
}
</script>