<template>
    <div class="history-content_body-list" v-if="tableInfo.length != 0">
        <div class="history-content_body-list__close">
            <div class="close" @click="closeHistory()"></div>
        </div>
        <div class="history-content_body-list__top">
            <div class="row">
                <div class="col-4 history-content_body-list__top-item">
                    {{ $t('poker.my_cards') }}
                </div>
                <div class="col-4 history-content_body-list__top-item">
                    {{ $t('poker.winner') }}
                </div>
                <div class="col-4 history-content_body-list__top-item">
                    {{ $t('poker.pot') }}
                </div>
            </div>
        </div>
        <div class="history-content_body-list__body">

            <div class="history-content_body-list__body-item" v-for="(item, index) in tableInfo" :key="index"
                :class="(index == currentIndex) ? 'act' : ''" @click="setIndex(index)">
                <div class="row align-items-center" v-if="item.table_freeze">
                    <div class="col-4">
                        <div class="history-content_body-list__body-item_img">
                            <div v-for="card in getCards(item.table_freeze.players)" :key="card">
                                <img v-if="card[0] != null"
                                    :src="require('@/assets/img/poker/carts/' + this.suitCards[card[1]] + '/' + this.rankCards[card[0]] + '.svg')"
                                    alt="">
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="history-content_body-list__body-item_name">
                            {{ getWinnerName(item.table_freeze.winners[0].player_id, item.table_freeze.players) }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="history-content_body-list__body-item_pot">
                            {{ formatChips(item.table_freeze.winners[0].money_won) }} ¥
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import emitter from '@/main';

export default {
    name: 'v-poker-history-list',
    inject: ['suitCards', 'rankCards'],
    data() {
        return {
            currentIndex: 0,
            tableInfo: [],
            profileData: {},
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
        closeHistory() {
            emitter.emit("closeHistory");
        },
        getWinnerName(id, data) {
            let index = data.findIndex(element => element.player_game_id == id);
            return data[index].player_name
        },
        getCards(data) {
            let index = data.findIndex(element => element.player_game_id == this.profileData.id);
            return (index != -1) ? data[index].cards : ''
        },
        setIndex(index) {
            this.currentIndex = index;
            emitter.emit("setIndexHistory", index);
            emitter.emit("setTableInfo", this.tableInfo);
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            emitter.on("setTableInfo", data => {
                this.tableInfo = data
            });
        })
    }
}
</script>