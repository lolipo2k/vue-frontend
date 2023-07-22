<template>
    <header class="v-header-mobile">
        <div class="container d-flex justify-content-between align-items-center">
            <div class="header-menu__mobile" @click="(this.menuOpen = true)">
                <img src="../../assets/img/menu.svg" alt="">
            </div>
            <div class="header-logo__mobile" @click="this.$router.push('/')">
                <img src="../../assets/img/logo.svg" alt="">
            </div>
            <div class="header-user__mobile"
                @click="(this.$parent.logIn) ? this.$router.push('/profile/' + this.profileInfo.id) : this.$parent.modalRegister = true">
                <img src="../../assets/img/user.svg" alt="">
            </div>
        </div>
        <div class="mobile-menu" v-if="menuOpen">
            <div class="container">
                <div class="mobile-menu_top d-flex justify-content-between align-items-center">
                    <div class="close" @click="(this.menuOpen = false)"></div>
                    <div class="header-right__lang">
                        <img src="../../assets/img/china_lang.svg" alt="">
                        <div class="swap-lang" :class="{ active: switchActive }"
                            @click="($i18n.locale = ($i18n.locale == 'en') ? 'cn' : 'en'), (switchActive = !switchActive)">
                        </div>
                        <img src="../../assets/img/eng_lang.svg" alt="">
                    </div>
                </div>
                <div class="mobile-menu_list">
                    <nav>
                        <ul>
                            <li><a href="#" @click="(this.$router.push('/game')), (this.menuOpen = false)"> <img
                                        src="../../assets/img/games_icon.svg" alt=""> {{ $t("home.games") }} </a>
                            </li>
                            <li><a href="#" @click="(this.$router.push('/players')), (this.menuOpen = false)"> <img
                                        src="../../assets/img/players_icon.svg" alt=""> {{ $t("home.players") }}
                                </a></li>
                        </ul>
                    </nav>
                </div>
                <div class="mobile-menu_bottom d-flex justify-content-between align-items-center">
                    <div v-if="!this.$parent.logIn" class="btn-default"
                        @click="(this.$parent.modalRegister = true), (this.menuOpen = false)">{{
                            $t("home.login")
                        }} /
                        {{ $t("home.register") }}</div>
                    <div class="balance-mobile" v-if="this.$parent.logIn"
                        @click="this.$router.push('/profile/' + this.profileInfo.id), (this.menuOpen = false)">
                        <img src="../../assets/img/coin.svg" alt="">
                        <div class="coins">
                            <p>
                                {{ $t("home.balance") }}
                            </p>
                            {{ this.profileInfo.chips }} ¥
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
import emitter from '../../main';

export default {
    name: 'v-header-mobile',
    data() {
        return {
            menuOpen: false,
            profileInfo: {},
            switchActive: true,
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