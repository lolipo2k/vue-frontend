<template>
    <div class="row d-flex justify-content-between align-items-center profile-header v-profile-mobile">
        <div class="col-5">
            <div class="profile-image" @click="(uploadPhoto = true)">
                <img :src="this.currentUrl + this.profileData.image_medium" alt="">
            </div>
        </div>
        <div class="col-7">
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
            <div class="profile-balance_info" v-if="this.$parent.myProfile">
                {{ $t('profile.your_balance') }}
                <span>
                    {{ this.profileData.chips }} ¥
                </span>
            </div>
        </div>
        <div class="col-12">
            <div v-if="!this.$parent.myProfile" class="profile-btn">
                <div class="btn-default">
                    {{ $t('profile.suggest_a_match') }}
                </div>
            </div>
            <vProfilePayment v-else :profileData="profileData"></vProfilePayment>
        </div>
    </div>
    <vProfileUpload v-if="uploadPhoto"></vProfileUpload>
    <vProfileEdit></vProfileEdit>
</template>
<script>
import emitter from '@/main';

import vProfilePayment from "./payment/v-profile-payment";
import vProfileUpload from "./v-profile-upload";
import vProfileLogout from "./v-profile-logout";
import vProfileEdit from "./v-profile-edit.vue";

export default {
    name: 'v-profile-mobile',
    components: {
        vProfilePayment,
        vProfileUpload,
        vProfileLogout,
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