<template>
    <header class="v-header-desktop">
        <div class="container d-flex justify-content-between">
            <div class="header-left">
                <a @click="this.$router.push('/')" class="header-left__logo">
                    <img src="../../assets/img/logo.svg" alt="">
                </a>
                <div class="header-left__menu">
                    <nav>
                        <ul>
                            <li><a href="#" @click="this.$router.push('/game')"> <img src="../../assets/img/games_icon.svg"
                                        alt=""> {{ $t("home.games") }} </a>
                            </li>
                            <li><a href="#" @click="this.$router.push('/players')"> <img
                                        src="../../assets/img/players_icon.svg" alt=""> {{ $t("home.players") }}
                                </a></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="header-right">
                <div class="header-right__lang">
                    <img src="../../assets/img/china_lang.svg" alt="">
                    <div class="swap-lang" :class="{ active: this.$parent.switchActive }"
                        @click="($i18n.locale = ($i18n.locale == 'en') ? 'cn' : 'en'), (this.$parent.switchActive = !this.$parent.switchActive)">
                    </div>
                    <img src="../../assets/img/eng_lang.svg" alt="">
                </div>
                <div class="header-right__balance" v-if="this.$parent.logIn"
                    @click="this.$router.push('/profile/' + this.profileInfo.id)">
                    <img src="../../assets/img/coin.svg" alt="">
                    <div class="coins">
                        <p>
                            {{ $t("home.balance") }}
                        </p>
                        {{ this.profileInfo.chips }} ¥
                    </div>
                </div>
                <div v-if="!this.$parent.logIn" class="header-right__register">
                    <div class="btn-default" @click="(this.$parent.modalRegister = true)">{{ $t("home.login") }} / {{
                        $t("home.register")
                    }}</div>
                </div>
                <a href="#" @click="this.$router.push('/profile/' + this.profileInfo.id)" v-if="this.$parent.logIn"
                    class="header-right__user">
                    <div class="user-photo">
                        <img :src="this.currentUrl + this.profileInfo.image_medium + '?' + new Date().getTime()">
                    </div>
                    <div class="user-username">
                        {{ this.profileInfo.username }}
                    </div>
                </a>
            </div>
        </div>
    </header>
</template>
<script>
import emitter from '../../main';

export default {
    name: 'v-header-desktop',
    inject: ['currentUrl'],
    data() {
        return {
            profileInfo: {},
        }
    },
    mounted() {
        this.$nextTick(function () {
            emitter.on("profileInfo", profileInfo => {
                this.profileInfo = profileInfo;
            });
        })
    }
}
</script>