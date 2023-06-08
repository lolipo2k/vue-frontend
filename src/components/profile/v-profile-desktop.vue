<template>
    <div class="row d-flex justify-content-between profile-header v-profile-desktop">
        <div class="col-3">
            <div class="profile-image">
                <div class="profile-image_upload" v-if="this.$parent.myProfile" @click="(uploadPhoto = true)">
                    <img src="../../assets/img/photo_upload.svg" class="icon-upload" alt="">
                    {{ $t('profile.upload_a_picture') }}
                </div>
                <img :src="this.currentUrl + this.profileData.image_large + '?' + new Date().getTime()" alt="">
            </div>
        </div>
        <div class="col-8">
            <div class="profile-name">
                <div class="profile-name_number">
                    {{ this.profileData.id }}
                </div>
                {{ this.profileData.username }}
                <span @click="changeProfile()">
                    <img src="@/assets/img/edit.svg" alt="">
                </span>
                <vProfileLogout></vProfileLogout>
            </div>
            <div v-if="!this.$parent.myProfile" class="profile-btn">
                <div class="btn-default">
                    {{ $t('profile.suggest_a_match') }}
                </div>
            </div>
            <vProfilePayment v-else :profileData="profileData"></vProfilePayment>
        </div>
        <vProfileHistoryPayment></vProfileHistoryPayment>
    </div>
    <vProfileUpload v-if="uploadPhoto"></vProfileUpload>
    <vProfileEdit></vProfileEdit>
</template>
<script>
import emitter from '@/main';

import vProfilePayment from "./payment/v-profile-payment";
import vProfileUpload from "./v-profile-upload";
import vProfileLogout from "./v-profile-logout";
import vProfileHistoryPayment from "./v-profile-history-payment.vue";
import vProfileEdit from "./v-profile-edit.vue";

export default {
    name: 'v-profile-desktop',
    components: {
        vProfilePayment,
        vProfileUpload,
        vProfileLogout,
        vProfileHistoryPayment,
        vProfileEdit
    },
    inject: ['currentUrl'],
    props: {
        profileData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            uploadPhoto: false,
        }
    },
    methods: {
        changeProfile() {
            emitter.emit("changeProfile", true);
        }
    }
}
</script>