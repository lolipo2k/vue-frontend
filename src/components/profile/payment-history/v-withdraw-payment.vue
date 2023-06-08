<template>
    <div class="profile-history_table-content">
        <div class="profile-history_table-content__item row" v-for="item in withdrawList" :key="item.id">
            <div class="col-4">
                {{ new Date(item.created_at).toLocaleDateString() }}
            </div>
            <div class="col-2">
                {{ item.id }}
            </div>
            <div class="col-2">
                <img :src="require('@/assets/img/profile-history/' + item.order_withdraw_status.toLowerCase() + '.svg')">
                {{ $parent.status.get(`${item.order_withdraw_status.toLowerCase()}`) }}
            </div>
            <div class="col-2">
                <img src="@/assets/img/coin.svg" alt=""> - {{ item.balance }} ¥
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'v-withdraw-payment',
    inject: ['currentUrl'],
    data() {
        return {
            withdrawList: [],
        }
    },
    methods: {
        getWithdraw() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/withdraw/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                this.withdrawList = this.withdrawList.concat(res.data.data);
            });
        },
        getWithdrawUsdt() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/withdraw-usdt/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                this.withdrawList = this.withdrawList.concat(res.data.data);
            });
        },
        getList() {
            this.getWithdraw()
            this.getWithdrawUsdt()
            this.withdrawList.sort(function (a, b) {
                return new Date(a.created_at) - new Date(b.created_at);
            });
        },
    },
    mounted() {
        this.$nextTick(function () {
            this.getList();
        })
    }
}
</script>