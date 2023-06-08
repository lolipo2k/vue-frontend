<template>
    <main>
        <div class="container">
            <section class="ticket-create">
                <h1>Create a new ticket</h1>
                <form action="">
                    <input type="text" placeholder="Ticket theme" v-model="dataTicket.title">
                    <textarea placeholder="Ticket description" v-model="dataTicket.description"></textarea>
                    <div class="btn-default" @click="createTicket">
                        Create a ticket
                    </div>
                    <div class="error" v-if="error != ''">{{ error }}</div>
                    <div class="info" v-if="info != ''">{{ info }}</div>
                </form>
            </section>
            <vCustomerDesktop v-if="!checkMobile"></vCustomerDesktop>
            <vCustomerMobile v-else></vCustomerMobile>
        </div>
    </main>
</template>
<script>
import axios from 'axios';

import vCustomerDesktop from "../components/customer/v-customer-desktop";
import vCustomerMobile from "../components/customer/v-customer-mobile";

export default {
    name: 'CustomerPage',
    inject: ['currentUrl', 'checkMobile'],
    components: {
        vCustomerDesktop,
        vCustomerMobile
    },
    data() {
        return {
            dataTicket: {
                title: '',
                description: '',
                priority: 'low',
            },
            error: '',
            info: '',
            tickets: []
        }
    },
    methods: {
        createTicket() {
            let token = localStorage.getItem("auth");
            if (this.dataTicket.description == '' || this.dataTicket.title == '') {
                this.error = 'fill in the data';
                return false;
            }
            axios.post(this.currentUrl + '/support/ticket/create/', this.dataTicket,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then(() => {
                    this.error = '';
                    this.info = 'Ticket created';
                    Object.keys(this.dataTicket).forEach(key => this.dataTicket[key] = '');
                    this.ticketList();
                })
                .catch((error) => {
                    this.error = (error.response.data.error) ? error.response.data.error : 'Check all data'
                }).finally(() => {
                    console.log('finish');
                });
        },
        ticketList() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/support/ticket/list/',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.tickets = []
                    this.tickets = res.data.data
                    this.tickets.forEach((element, index) => {
                        this.tickets[index].date_created = this.tickets[index].date_created.substr(0, 10);
                    });
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.ticketList();
        })
    }
}
</script>
<style lang="scss">
@import "../assets/scss/pages/ticket.scss";
</style>