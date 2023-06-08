<template>
    <main>
        <div class="container">
            <section class="replenish-upload">
                <h4>{{ $t("replenish.info") }}</h4>
                <div class="row">
                    <div class="col-9">
                        <div class="frame-upload">
                            <img v-if="imageUrl != ''" :src="this.currentUrl + '/media/' + this.imageUrl" alt="">
                            <div v-if="imageUrl == ''" class="btn-default" @click="this.$refs.uploadInput.click();">
                                {{ $t("replenish.select_photo") }}
                            </div>
                            <input type="file" @change="onFileChanged()" accept="image/*" ref="uploadInput">
                        </div>
                        <div class="replenish-btns" v-if="imageUrl != ''">
                            <div class="btn-default" @click="imageUrl = ''">{{ $t("replenish.change") }}</div>
                            <div class="btn-frame" @click="successModal = true">{{ $t("replenish.accept") }}</div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div v-if="this.$route.params.type == '2'">
                            <img :src="this.currentUrl + this.paymentInfo.qr_code" alt="">
                            <ul>
                                <li>
                                    <span>{{ $t("replenish.refill_amount") }}:</span> {{ this.$route.params.balance }}
                                </li>
                            </ul>
                        </div>
                        <div v-if="this.$route.params.type == '1'">
                            <img :src="this.currentUrl + this.paymentInfo.wallet.qr_code" alt="">
                            <ul>
                                <li>
                                    <span>{{ $t("replenish.wallet") }}:</span> {{ this.paymentInfo.wallet.adress }}
                                </li>
                                <li>
                                    <span>{{ $t("replenish.refill_amount") }}:</span> {{ this.$route.params.balance }}
                                </li>
                            </ul>
                        </div>
                        <div v-if="this.$route.params.type == '0'">
                            <ul>
                                <li>
                                    <span>{{ $t("replenish.bank") }}:</span> {{ paymentInfo.binificiary_bank }}
                                </li>
                                <li>
                                    <span>{{ $t("replenish.card_holder") }}:</span> {{ paymentInfo.card_holder }}
                                </li>
                                <li>
                                    <span>{{ $t("replenish.depositor_name") }}:</span> {{ paymentInfo.depositor_name }}
                                </li>
                                <li>
                                    <span>{{ $t("replenish.collection_account") }}:</span> {{ paymentInfo.card }}
                                </li>
                                <li>
                                    <span>{{ $t("replenish.refill_amount") }}:</span> {{ this.$route.params.balance }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
    <div v-if="successModal" class="modal-background">
        <div class="modal-body success">
            <h2>
                {{ $t("replenish.success") }}
            </h2>
            <div class="btn-default" @click="this.$router.push('/')">OK</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ReplenishPage',
    inject: ['currentUrl'],
    data() {
        return {
            imageUrl: '',
            successModal: false,
            paymentInfo: {
                wallet: {
                    qr_code: '',
                    adress: ''
                },
                qr_code: ''
            }
        }
    },
    methods: {
        onFileChanged() {
            let token = localStorage.getItem("auth");
            let url = '';
            switch (this.$route.params.type) {
                case '0':
                    url = '/order/refill/';
                    break;
                case '1':
                    url = '/order/refill-usdt/';
                    break;
                case '2':
                    url = '/order/refill-wechat/';
                    break;
            }
            axios.put(this.currentUrl + url + this.paymentInfo.order_refill_id + '/upload',
                {
                    screenshot: this.$refs.uploadInput.files.item(0),
                },
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    this.imageUrl = res.data.image
                });
        },
    },
    mounted() {
        this.$nextTick(function () {
            this.paymentInfo = JSON.parse(localStorage.getItem("payment"));
            console.log(this.paymentInfo.wallet.qr_code)
        })
    }
}
</script>

<style lang="scss">
@import "../assets/scss/pages/replenish.scss";
</style>