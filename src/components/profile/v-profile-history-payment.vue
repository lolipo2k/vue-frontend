<template>
    <div class="col-12">
        <div class="profile-history">
            <div class="profile-history_header">
                <div :class="{ act: isReplenish }" @click="isReplenish = true">
                    {{ $t("profile.replenish_history") }}
                </div>
                <div :class="{ act: !isReplenish }" @click="isReplenish = false">
                    {{ $t("profile.withdrawal_history") }}
                </div>
            </div>
            <div class="profile-history_table">
                <div class="profile-history_table-header">
                    <div class="row">
                        <div class="col-4">
                            {{ $t("profile.date") }}
                        </div>
                        <div class="col-2">
                            ID
                        </div>
                        <div class="col-2">
                            {{ $t("profile.status") }}
                        </div>
                        <div class="col-2">
                            {{ $t("profile.amount") }}
                        </div>
                    </div>
                </div>
                <vReplenishPayment v-if="isReplenish"></vReplenishPayment>
                <vWithdrawPayment v-if="!isReplenish"></vWithdrawPayment>
            </div>
        </div>
    </div>
</template>

<script>
import vReplenishPayment from './payment-history/v-replenish-payment.vue';
import vWithdrawPayment from './payment-history/v-withdraw-payment.vue';

export default {
    name: 'v-profile-history-payment',
    data() {
        return {
            isReplenish: true,
            status: new Map([
                ['waiting', this.$t("profile.history_waiting")],
                ['finished', this.$t("profile.history_finished")],
                ['decline', this.$t("profile.history_decline")],
            ]),
        }
    },
    components: {
        vReplenishPayment,
        vWithdrawPayment
    }
}
</script>