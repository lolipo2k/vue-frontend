<template>
    <input type="password" :placeholder="$t('profile.old_password')" v-model="changeData.old_password">
    <input type="password" :placeholder="$t('profile.new_password')" v-model="changeData.new_password">
    <input type="password" :placeholder="$t('profile.password_repeat')" v-model="changeData.password_repeat">
    <div class="error">{{ error }}</div>
    <div class="btn-default" @click="changePassword()">
        {{ $t('replenish.change') }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'v-profile-password',
    inject: ['currentUrl'],
    data() {
        return {
            changeData: {
                old_password: '',
                new_password: '',
                password_repeat: '',
            },
            error: '',
        }
    },
    methods: {
        changePassword() {
            if(this.changeData.new_password != this.changeData.password_repeat) return this.error = this.$t("profile.repeat_error");
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/user/user-change-passwd', this.changeData,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.$parent.changeProfile = false
                    this.$parent.successModal = true
                    this.error = ''
                })
                .catch((error) => {
                    this.error = (error.response.data.new_password != null) ? error.response.data.new_password[0] : this.$t("profile.password_wrong");
                });
        }
    },
}
</script>