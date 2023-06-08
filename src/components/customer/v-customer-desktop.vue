<template>
    <section class="ticket-content v-customer-desktop">
        <h1>
            <span>{{ $t('game.or') }}</span>
            choose the required ticket
        </h1>
        <div class="row d-flex flex-nowrap">
            <div class="col-12 ticket-list">
                <div class="ticket-list_header row">
                    <div class="col-1">
                        Date
                    </div>
                    <div class="col-3">
                        Title
                    </div>
                </div>
                <div class="ticket-list_content">
                    <vCustomerItem v-for="ticket in this.$parent.tickets" :key="ticket.id" :ticket="ticket" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import vCustomerItem from "./v-customer-item";

export default {
    name: 'v-customer-desktop',
    components: {
        vCustomerItem
    },
}
</script>