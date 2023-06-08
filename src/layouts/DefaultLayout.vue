<template>
    <vHeaderDesktop v-if="!checkMobile"></vHeaderDesktop>
    <vHeaderMobile v-else></vHeaderMobile>
    <slot />
    <vFooterDesktop v-if="!checkMobile"></vFooterDesktop>
    <vFooterMobile v-else></vFooterMobile>

    <vReconnectGame v-if="isReconnect && !this.$route.params.game && logIn"></vReconnectGame>

    <div class="modal-background" v-if="modalRegister">
        <div class="modal-body register">
            <div class="close" @click="(modalRegister = false)"></div>
            <div class="modal-body_title">
                <ul>
                    <li :class="{ act: loginRegister }" @click="(loginRegister = true)">
                        {{ $t("home.sign") }}
                    </li>
                    <li :class="{ act: !loginRegister }" @click="(loginRegister = false)">
                        {{ $t("home.register") }}
                    </li>
                </ul>
            </div>
            <div class="modal-body_form" v-if="!loginRegister">
                <vRegisterForm></vRegisterForm>
            </div>
            <div class="modal-body_form" v-else>
                <vLoginForm></vLoginForm>
            </div>
        </div>
    </div>
    <div class="modal-background" v-if="successRegistr">
        <div class="modal-body success">
            <div class="close" @click="(successRegistr = false)"></div>
            <div class="modal-body_title">
                <h2>{{ $t("home.email_confirm") }}</h2>
            </div>
        </div>
    </div>
    <vUserActivity></vUserActivity>
</template>
<script>
import axios from 'axios';
import emitter from '../main';
import { chaport } from '../chaport'

import vHeaderDesktop from "./layoutHeader/v-header-desktop";
import vHeaderMobile from "./layoutHeader/v-header-mobile";

import vFooterDesktop from "./layoutFooter/v-footer-desktop";
import vFooterMobile from "./layoutFooter/v-footer-mobile";

import vLoginForm from "./modal/v-login-form";
import vRegisterForm from "./modal/v-register-form";

import vUserActivity from './v-user-activity.vue';
import vReconnectGame from './modal/v-reconnect-game.vue';

export default {
    name: 'DefaultLayout',
    components: {
        vHeaderDesktop,
        vHeaderMobile,
        vFooterDesktop,
        vFooterMobile,
        vLoginForm,
        vRegisterForm,
        vUserActivity,
        vReconnectGame
    },
    inject: ['currentUrl', 'checkMobile'],
    data() {
        return {
            modalRegister: false,
            switchActive: false,
            loginRegister: false,
            logIn: false,
            successRegistr: false,
            isReconnect: localStorage.getItem('game_id') !== null,
        }
    },
    methods: {
        userInfo() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/user/currentuser/',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    emitter.emit("profileInfo", res.data.data);
                    localStorage.setItem('profileInfo', JSON.stringify(res.data.data))
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.detail) {
                        localStorage.setItem("auth", '')
                        this.logIn = false
                    }
                });
        },
    },
    mounted() {
        this.$nextTick(function () {
            chaport()
            if (localStorage.getItem("auth")) {
                this.logIn = true;
                this.userInfo();
            }
            emitter.on("modal-register", isOpen => { this.modalRegister = isOpen; });
            emitter.on("logIn", isLogIn => { this.logIn = isLogIn; });
            emitter.on("isReconnect", data => {
                this.isReconnect = data;
            });
        })
    }
}
</script>