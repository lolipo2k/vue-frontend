<template>
    <div class="modal-background">
        <div class="modal-body replenish">
            <div class="close" @click="($parent.replenishModal = false)"></div>
            <div class="modal-body_title">
                <h2>
                    {{ $t('profile.replenish_the_balance') }}
                </h2>
            </div>
            <div class="modal-body_form replenish">
                <label>{{ $t('profile.type') }}</label>
                <select v-model="paymentMethod">
                    <option selected value="1">{{ $t('profile.crypto') }}</option>
                    <option value="0">{{ $t('profile.card') }}</option>
                    <option value="2">{{ $t('profile.wechat') }}</option>
                </select>
            </div>
            <div class="modal-body_form replenish" v-if="paymentMethod == '0'">
                <label>{{ $t('profile.bank') }}</label>
                <select v-model="bank">
                    <option v-for="item in bankList.data" :value="item.id" :key="item.id">
                        {{ item.title }}
                    </option>
                </select>
            </div>
            <div class="modal-body_form replenish">
                <label>{{ $t('profile.amount') }}</label>
                <select v-model="replenishInfo.balance" v-if="paymentMethod != '1'">
                    <option v-for="amount in optionsAmount.data" :value="amount.id" :key="amount.id">
                        {{ amount.balance_option }}
                    </option>
                </select>
                <select v-model="replenishInfo.balance" v-else>
                    <option v-for="amount in optionsAmountUsdt.data" :value="amount.id" :key="amount.id">
                        {{ amount.balance_option }}
                    </option>
                </select>
            </div>
            <div class="modal-body_form replenish" v-if="paymentMethod == '0'">
                <label>{{ $t('profile.replenish_name') }}</label>
                <input type="text" v-model="name">
            </div>
            <div class="error">{{ error }}</div>
            <div class="btn-default" @click="refillCreate()">
                {{ $t('profile.pay') }}
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'v-profile-payment-replenish',
    inject: ['currentUrl'],
    data() {
        return {
            replenishInfo: {
                balance: 1
            },
            error: '',
            paymentMethod: '1',
            optionsAmount: 1,
            optionsAmountUsdt: 1,
            bankList: [],
            bank: 1,
            name: '',
        }
    },
    methods: {
        refillUsdt() {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/order/refill-usdt/create', this.replenishInfo,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.$parent.replenishModal = false
                    localStorage.setItem("payment", JSON.stringify(res.data.data));

                    let index = this.optionsAmountUsdt.data.findIndex(element => element.id == this.replenishInfo.balance);
                    let balance = this.optionsAmountUsdt.data[index].balance_option;

                    this.$router.push('/replenish/1/' + balance)
                })
                .catch(() => {
                    this.error = this.$t("home.check_fields_register")
                });
        },
        refillWeChat() {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/order/refill-wechat/create', this.replenishInfo,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.$parent.replenishModal = false
                    localStorage.setItem("payment", JSON.stringify(res.data.data));

                    let index = this.optionsAmount.data.findIndex(element => element.id == this.replenishInfo.balance);
                    let balance = this.optionsAmount.data[index].balance_option;

                    this.$router.push('/replenish/2/' + balance)
                })
                .catch(() => {
                    this.error = this.$t("home.check_fields_register")
                });
        },
        refillCard() {
            this.replenishInfo.benificiary_bank = this.bank;
            this.replenishInfo.depositor_name = this.name;

            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/order/refill/create', this.replenishInfo,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.$parent.replenishModal = false
                    localStorage.setItem("payment", JSON.stringify(res.data.data));

                    let index = this.optionsAmount.data.findIndex(element => element.id == this.replenishInfo.balance);
                    let balance = this.optionsAmount.data[index].balance_option;

                    this.$router.push('/replenish/0/' + balance)
                })
                .catch(() => {
                    this.error = this.$t("home.check_fields_register")
                });
        },
        refillCreate() {
            switch (this.paymentMethod) {
                case '0':
                    this.refillCard()
                    break;
                case '1':
                    this.refillUsdt()
                    break;
                case '2':
                    this.refillWeChat()
                    break;
            }
        },
        payOptions() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/pay-options/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }).then((res) => {
                    this.optionsAmount = res.data
                });
        },
        payOptionsUsdt() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/pay-options-usdt/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }).then((res) => {
                    this.optionsAmountUsdt = res.data
                });
        },
        binBanksList() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/order/bin-banks/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }).then((res) => {
                    this.bankList = res.data
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.payOptions();
            this.payOptionsUsdt();
            this.binBanksList();
        })
    }
}
</script>