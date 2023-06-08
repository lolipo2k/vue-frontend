<template>
    <div class="profile-balance v-profile-payment">
        <div class="profile-balance_info desktop">
            {{ $t('profile.your_balance') }}
            <span>
                {{ this.profileData.chips }} ¥
            </span>
        </div>
        <div class="profile-balance_btns">
            <div class="btn-default" @click="(replenishModal = true)">
                {{ $t('profile.replenish_balance') }}
            </div>
            <div class="btn-frame" @click="(withdrawModal = true)">
                {{ $t('profile.withdraw_money') }}
            </div>
        </div>
    </div>
    <vProfilePaymentReplenish v-if="replenishModal"></vProfilePaymentReplenish>
    <vProfilePaymentWithdraw v-if="withdrawModal"></vProfilePaymentWithdraw>
    <vProfilePaymentSuccess v-if="successModal"></vProfilePaymentSuccess>
</template>
<script>
import vProfilePaymentReplenish from "./v-profile-payment-replenish.vue";
import vProfilePaymentWithdraw from "./v-profile-payment-withdraw.vue";
import vProfilePaymentSuccess from "./v-profile-payment-success.vue";

export default {
    name: 'v-profile-payment',
    components: {
        vProfilePaymentReplenish,
        vProfilePaymentWithdraw,
        vProfilePaymentSuccess
    },
    props: {
        profileData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            replenishModal: false,
            withdrawModal: false,
            successModal: false,
        }
    },
}
</script>