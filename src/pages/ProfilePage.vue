<template>
    <main class="profile-page">
        <div class="container">
            <vProfileDesktop v-if="!checkMobile" :profileData="profileData"></vProfileDesktop>
            <vProfileMobile v-else :profileData="profileData"></vProfileMobile>
        </div>
    </main>
</template>
<script>
import vProfileDesktop from "../components/profile/v-profile-desktop";
import vProfileMobile from "../components/profile/v-profile-mobile";

import axios from 'axios';

export default {
    name: 'ProfilePage',
    inject: ['currentUrl', 'checkMobile'],
    components: {
        vProfileDesktop,
        vProfileMobile
    },
    data() {
        return {
            myProfile: false,
            profileData: {}
        }
    },
    methods: {
        getProfileInfo() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/user/userprofile/' + this.$route.params.id + '/',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                }).catch(() => {
                    this.$router.push('/')
                }).then((res) => {
                    this.profileData = res.data.data;
                });
        },
    },
    mounted() {
        this.$nextTick(function () {
            let profile = JSON.parse(localStorage.getItem("profileInfo"));
            if (profile && (profile.id == this.$route.params.id)) {
                this.myProfile = true
                this.profileData = profile
            }
            else {
                this.getProfileInfo();
            }
        })
    }
}
</script>
<style lang="scss">
@import "../assets/scss/pages/profile.scss";
</style>