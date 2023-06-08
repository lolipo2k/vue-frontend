<template>
    <div class="profile-history_table-content">
        <div class="profile-history_table-content__item row" v-for="item in refillList" :key="item.id">
            <div class="col-4">
                {{ new Date(item.created_at).toLocaleDateString() }}
            </div>
            <div class="col-2">
                {{ item.id }}
            </div>
            <div class="col-2">
                <img :src="require('@/assets/img/profile-history/' + item.order_refill_status.toLowerCase() + '.svg')">
                {{ $parent.status.get(`${item.order_refill_status.toLowerCase()}`) }}
            </div>
            <div class="col-2">
                <img src="@/assets/img/coin.svg" alt=""> + {{ payList[item.balance] }} ¥
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'v-replenish-payment',
    inject: ['currentUrl'],
    data() {
        return {
            refillList: [],
            payList: [],
        }
    },
    methods: {
        getRefill() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/refill/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                this.refillList = this.refillList.concat(res.data.data);
            });
        },
        getRefillUsdt() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/refill-usdt/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                this.refillList = this.refillList.concat(res.data.data);
            });
        },
        getRefillWechat() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/refill-wechat/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                this.refillList = this.refillList.concat(res.data.data);
            });
        },
        getList() {
            this.getRefill()
            this.getRefillUsdt()
            this.getRefillWechat()
            this.refillList.sort(function (a, b) {
                return new Date(a.created_at) - new Date(b.created_at);
            });
        },
        payOptions() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/pay-options/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }
            ).then((res) => {
                res.data.data.forEach(element => {
                    this.payList[element.id] = element.balance_option
                });
            });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.getList();
            this.payOptions();
        })
    }
}
</script>