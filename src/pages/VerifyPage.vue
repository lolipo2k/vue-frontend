<template>
    <main class="verify">
        <h1> {{ $t("verify.success") }}</h1>
    </main>
</template>
<script>
import axios from 'axios';

export default {
    name: 'VerifyPage',
    inject: ['currentUrl'],
    methods: {
        accountActivate() {
            axios.get(this.currentUrl + `/user/account-activate/${this.$route.params.id}/${this.$route.params.hash}/`)
                .then((res) => {
                    console.log(res);
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.accountActivate();
        })
    }
}
</script>
<style scoped>
h1 {
    text-align: center;
    margin-top: 40px;
}

footer {
    display: none;
}
</style>
