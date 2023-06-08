<template>
    <form v-on:submit.prevent="formLogin" class="v-login-form">
        <input v-model="bodyLogin.username" type="text" name="login" :placeholder="$t('home.login')">
        <input v-model="bodyLogin.password" type="password" name="password" :placeholder="$t('home.password')">
        <label class="checkbox-container">
            {{ $t("home.agree") }}
            <input type="checkbox" checked="checked" v-model="policy">
            <span class="checkmark"></span>
        </label>
        <div class="error">{{ error }}</div>
        <button class="btn-default">
            {{ $t("home.login") }}
        </button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: 'v-login-form',
    inject: ['currentUrl'],
    data() {
        return {
            bodyLogin: {
                username: '',
                password: '',
            },
            error: '',
            policy: true,
        }
    },
    methods: {
        formLogin() {

            if (!this.policy) {
                this.error = this.$t("home.privacy_policy_register");
                return;
            }

            axios.post(this.currentUrl + '/user/login/', this.bodyLogin)
                .then((res) => {
                    if (res.status == 200) {
                        localStorage.setItem('auth', res.data.data.token)

                        this.$parent.modalRegister = false

                        this.$parent.logIn = true;
                        this.$parent.userInfo();
                    }
                })
                .catch((error) => {
                    let data = error.response.data.data;
                    if (data) {
                        this.error = data
                    }
                    else {
                        this.error = this.$t("home.check_fields_register");
                    }
                });
        }
    }
}
</script>