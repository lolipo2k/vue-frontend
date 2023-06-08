<template>
    <div class="btn-default profile-logout v-profile-logout" @click="logout()">
        {{ $t("profile.logout") }}
    </div>
</template>

<script>
import axios from 'axios';
import emitter from '../../main';

export default {
    name: 'v-profile-logout',
    inject: ['currentUrl'],
    methods: {
        logout() {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/user/logout/', {},
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    localStorage.removeItem("auth");
                    localStorage.removeItem("profileInfo");

                    this.$router.push('/')
                    emitter.emit("logIn", false);
                });
        }
    },
}
</script>