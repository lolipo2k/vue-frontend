<template>
    <div class="ticket-item_mobile v-customer-item-mobile">
        <div class="row">
            <div class="col-6">
                <div class="ticket-item_mobile__date">
                    {{ ticket.date_created }}
                </div>
                <div class="ticket-item_mobile__title">
                    {{ ticket.title }}
                </div>
            </div>
            <div class="col-12">
                <div class="btn-default" @click="this.$router.push('/customer/' + ticket.id)">
                    View Ticket
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-customer-item-mobile',
    props: {
        ticket: {
            type: Object,
            required: true
        }
    }
}
</script>