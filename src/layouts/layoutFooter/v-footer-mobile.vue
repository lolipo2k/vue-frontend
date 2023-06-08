<template>
    <footer class="v-footer-mobile">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <div class="footer-logo">
                        <img src="../../assets/img/logo.svg" alt="">
                    </div>
                    <div class="footer-menu">
                        <nav>
                            <ul>
                                <li><a href="#"> {{ $t("home.home") }} </a></li>
                                <li><a href="#"> {{ $t("home.players") }} </a></li>
                                <li><a href="#"> {{ $t("home.games") }} </a></li>
                            </ul>
                        </nav>
                    </div>
                    <div class="footer-copyright">
                        © {{ $t("home.rights_reserved") }}
                    </div>
                </div>
                <div class="col-6">
                    <div class="btn-default">
                        {{ $t("home.profile") }}
                    </div>
                </div>
            </div>
            <div class="footer-legal">
                {{ $t("home.legal_information") }}
            </div>
        </div>
    </footer>
</template>
<script>
export default {
    name: 'v-footer-mobile'
}
</script>