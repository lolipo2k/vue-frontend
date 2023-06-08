<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-5 search-players">
                    <input type="text" v-model="search" v-on:keyup="searchPlayer(search)"
                        :placeholder="$t('players.enter_username')">
                    <div class="error" v-if="error != ''">{{ error }}</div>
                </div>
            </div>
            <vPlayersDesktop v-if="!checkMobile"></vPlayersDesktop>
            <vPlayersMobile v-else></vPlayersMobile>
        </div>
    </main>
</template>
<script>
import axios from 'axios';

import vPlayersDesktop from "../components/players/v-players-desktop";
import vPlayersMobile from "../components/players/v-players-mobile";

export default {
    name: 'PlayersPage',
    inject: ['currentUrl', 'checkMobile'],
    components: {
        vPlayersDesktop,
        vPlayersMobile
    },
    data() {
        return {
            players: [],
            playersData: [],
            search: '',
            error: '',
        }
    },
    methods: {
        playersList() {
            axios.get(this.currentUrl + '/user/list/')
                .then((res) => {
                    this.players = res.data.data;
                    this.playersData = res.data.data;
                });
        },
        searchPlayer(search) {
            this.error = ''
            this.players = this.playersData.filter(el => el.username.includes(search.trim()));
            if (this.players.length == 0) this.error = this.$t("players.no_results")
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.playersList();
        })
    }
}
</script>
<style lang="scss">
@import "../assets/scss/pages/players.scss";
</style>