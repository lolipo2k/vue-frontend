<template>
    <input type="text" :placeholder="$t('profile.change_nickname')" v-model="changeData.username">
    <div class="error">{{ error }}</div>
    <div class="btn-default" @click="changeNickname()">
        {{ $t('replenish.change') }}
    </div>
</template>

<script>
import axios from 'axios';
import emitter from '@/main';

export default {
    name: 'v-profile-nickname',
    inject: ['currentUrl'],
    data() {
        return {
            changeData: {
                username: ''
            },
            error: '',
            profileData: {},
        }
    },
    methods: {
        changeNickname() {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/user/user-change-username', this.changeData,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.$parent.changeProfile = false
                    this.$parent.successModal = true
                    this.error = ''
                    this.profileData.username = this.changeData.username;
                    emitter.emit("profileInfo", this.profileData);
                })
                .catch(() => {
                    this.error = this.$t("profile.error_nickname")
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
            this.changeData.username = this.profileData.username;
        })
    }
}
</script>