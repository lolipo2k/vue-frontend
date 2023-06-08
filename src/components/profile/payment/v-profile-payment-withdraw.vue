<template>
    <div class="modal-background">
        <div class="modal-body withdraw">
            <div class="close" @click="($parent.withdrawModal = false)"></div>
            <h2>
                {{ $t('profile.withdraw_money') }}
            </h2>
            <div class="modal-body_form withdraw">
                <label>{{ $t('profile.type') }}</label>
                <select v-model="isUsdt">
                    <option selected value="1">{{ $t('profile.crypto') }}</option>
                    <option value="0">{{ $t('profile.card') }}</option>
                </select>
            </div>
            <input type="text" :placeholder="$t('profile.amount_of_money') + ' (¥)'" v-model="withdrawhInfo.balance">
            <input type="text" v-if="this.isUsdt != '1'" :placeholder="$t('profile.card_number')"
                v-model="withdrawhInfo.card">
            <input type="text" v-if="this.isUsdt == '1'" :placeholder="$t('replenish.wallet')"
                v-model="withdrawhInfo.wallet">
            <div class="error">{{ error }}</div>
            <div class="btn-default" @click="withdrawCreate()">
                {{ $t('profile.pay') }}
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'v-profile-payment-withdraw',
    inject: ['currentUrl'],
    data() {
        return {
            withdrawhInfo: {
                balance: '',
                card: '',
                wallet: ''
            },
            isUsdt: '1',
            error: '',
        }
    },
    methods: {
        withdrawCreate() {
            let token = localStorage.getItem("auth");
            let url = (this.isUsdt == "1") ? '/order/withdraw-usdt/create' : '/order/withdraw/create'
            axios.post(this.currentUrl + url, this.withdrawhInfo,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.$parent.withdrawModal = false
                    this.$parent.successModal = true
                    this.error = ''
                })
                .catch(() => {
                    this.error = this.$t("home.check_fields_register")
                });
        },
    },
}
</script>