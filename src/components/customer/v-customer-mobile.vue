<template>
    <section class="ticket-content_mobile v-customer-mobile">
        <h1>
            <span>{{ $t('game.or') }}</span>
            choose the required ticket
        </h1>
        <div class="row d-flex flex-nowrap">
            <div class="col-12 ticket-list">
                <div class="ticket-list_content__mobile">
                    <vCustomerItemMobile v-for="ticket in this.$parent.tickets" :key="ticket.id" :ticket="ticket" />
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import vCustomerItemMobile from "./v-customer-item-mobile";

export default {
    name: 'v-customer-mobile',
    components: {
        vCustomerItemMobile
    },
}
</script>