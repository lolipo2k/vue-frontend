<template>
    <main>
        <div class="container">
            <section class="ticket-detail">
                <h1>
                    {{ dataTicket.title }}
                    <span>
                        {{ dataTicket.date_created }}
                    </span>
                </h1>
                <p>
                    {{ dataTicket.description }}
                </p>
            </section>
            <section class="ticket-create">
                <textarea placeholder="Message" v-model="dataCreate.message"></textarea>
                <div class="btn-default" @click="answerCreate">Send answer</div>
                <div class="error" v-if="error != ''">{{ error }}</div>
                <div class="info" v-if="info != ''">{{ info }}</div>
            </section>
            <section class="ticket-list">
                <div class="ticket-list_item" v-for="answer in this.answers" :key="answer.id">
                    <div class="ticket-list_item__name">
                        {{ answer.sender }} <span>{{ answer.date_created }}</span>
                    </div>
                    <div class="ticket-list_item__message">
                        {{ answer.message }}
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>
<script>
import axios from 'axios';

export default {
    name: 'TicketPage',
    inject: ['currentUrl', 'checkMobile'],
    data() {
        return {
            dataTicket: {},
            dataCreate: {
                message: '',
                id: this.$route.params.id
            },
            answers: [],
            error: '',
            info: '',
        }
    },
    methods: {
        getTicket() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/support/ticket/' + this.$route.params.id + '/detail/',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.dataTicket = res.data.data
                    this.dataTicket.date_created = this.dataTicket.date_created.substr(0, 10);
                });
        },
        answerList() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/support/ticket/' + this.$route.params.id + '/answer/list',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.answers = []
                    this.answers = res.data.data
                    this.answers.forEach((element, index) => {
                        this.answers[index].date_created = this.answers[index].date_created.substr(0, 10);
                    });
                });
        },
        answerCreate() {
            let token = localStorage.getItem("auth");
            axios.post(this.currentUrl + '/support/ticket/' + this.$route.params.id + '/answer/create/', this.dataCreate,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.error = '';
                    this.info = 'Answer created';
                    this.dataCreate.message = '';
                    this.answerList()
                })
                .catch((error) => {
                    this.error = (error.response.data.error) ? error.response.data.error : 'Check all data'
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.getTicket();
            this.answerList();
        })
    }
}
</script>
<style lang="scss">
@import "../assets/scss/pages/ticket-page.scss";
</style>