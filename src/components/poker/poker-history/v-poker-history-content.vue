<template>
    <div class="history-content">
        <div class="history-content_body">
            <div class="row">
                <div class="col-8 p-0">
                    <vPokerHistoryInfo></vPokerHistoryInfo>
                </div>
                <div class="col-4 p-3">
                    <vPokerHistoryList></vPokerHistoryList>
                </div>
            </div>
            <div class="loader" v-if="isLoad">loading</div>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';
import axios from 'axios';

import vPokerHistoryInfo from './v-poker-history-info.vue';
import vPokerHistoryList from './v-poker-history-list.vue';

export default {
    name: 'v-poker-history-content',
    inject: ['currentUrl'],
    data() {
        return {
            isLoad: true,
        }
    },
    components: {
        vPokerHistoryInfo,
        vPokerHistoryList
    },
    methods: {
        getHistoryInfo() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + `/game/game/poker/history?id=` + this.$route.params.game,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.isLoad = false
                    console.log(res)
                    console.log(res.data.data)
                    emitter.emit("setTableInfo", res.data.data);
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.getHistoryInfo();
        })
    }
}
</script>