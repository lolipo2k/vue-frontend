<template>
    <section class="faq v-home-faq">
        <h1>{{ $t("home.faq") }}</h1>
        <div class="faq-item" v-for="(faq, index) in faqs" v-bind:key="faq" :class="{ act: faq.status }">
            <div class="faq-item_title" @click="faqOpen(index)">
                {{ $t("home.faq_title_" + (index + 1)) }} <i class="arrow"
                    :class="{ up: faq.status, down: !faq.status }"></i>
            </div>
            <div class="faq-item_content">
                {{ $t("home.faq_content_" + (index + 1)) }}
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'v-home-faq',
    data() {
        return {
            faqs: [
                {
                    'title': this.$t("home.faq_title_1"),
                    'text': this.$t("home.faq_content_1"),
                    status: false
                },
                {
                    'title': this.$t("home.faq_title_2"),
                    'text': this.$t("home.faq_content_2"),
                    status: false
                },
                {
                    'title': this.$t("home.faq_title_3"),
                    'text': this.$t("home.faq_content_3"),
                    status: false
                },
                {
                    'title': this.$t("home.faq_title_4"),
                    'text': this.$t("home.faq_content_4"),
                    status: false
                }
            ]
        }
    },
    methods: {
        faqOpen(index) {
            this.faqs[index].status = !this.faqs[index].status;
        }
    },
} 
</script>