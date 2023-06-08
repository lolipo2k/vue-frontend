<template>
    <form v-on:submit.prevent="formRegister" class="v-register-form">
        <input v-model="bodyRegister.username" type="text" name="login" :placeholder="$t('home.login')">
        <input v-model="bodyRegister.email" type="email" name="email" :placeholder="$t('home.email')">
        <input v-model="bodyRegister.password1" type="password" name="password" :placeholder="$t('home.password')">
        <input v-model="bodyRegister.password2" type="password" name="password_confirm"
            :placeholder="$t('home.confirm_password')">
        <label class="checkbox-container">
            {{ $t("home.agree") }}
            <input type="checkbox" checked="checked" v-model="policy">
            <span class="checkmark"></span>
        </label>
        <div class="error">{{ error }}</div>
        <button class="btn-default">
            {{ $t("home.register") }}
        </button>
    </form>
</template>
<script>
import axios from 'axios';

export default {
    name: 'v-register-form',
    inject: ['currentUrl'],
    data() {
        return {
            bodyRegister: {
                username: '',
                password1: '',
                password2: '',
                email: '',
            },
            error: '',
            policy: true,
        }
    },
    methods: {
        formRegister() {

            if (!this.policy) {
                this.error = this.$t("home.privacy_policy_register");
                return;
            }

            axios.post(this.currentUrl + '/user/register/', this.bodyRegister)
                .then(() => {
                    this.$parent.modalRegister = false;
                    this.$parent.successRegistr = true;
                })
                .catch((error) => {
                    let data = error.response.data.data;
                    let keys = Object.keys(data);
                    if (data[keys[0]][0]) {
                        this.error = (keys[0] == 'non_field_errors') ? data[keys[0]][0] : keys[0] + " " + data[keys[0]][0]
                    }
                    else {
                        this.error = this.$t("home.check_fields_register");
                    }
                });
        },
    }
}
</script>