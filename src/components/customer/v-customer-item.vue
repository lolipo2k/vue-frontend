<template>
    <div class="ticket-item row v-customer-item">
        <div class="col-1 d-flex align-items-center justify-content-center">
            <div class="ticket-item_date">
                {{ ticket.date_created }}
            </div>
        </div>
        <div class="col-3 d-flex align-items-center justify-content-center">
            <div class="ticket-item_title">
                {{ ticket.title }}
            </div>
        </div>
        <div class="col-8 d-flex align-items-center justify-content-center">
            <div class="btn-default" @click="this.$router.push('/customer/' + ticket.id)">
                View Ticket
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-customer-item',
    props: {
        ticket: {
            type: Object,
            required: true
        }
    }
}
</script>