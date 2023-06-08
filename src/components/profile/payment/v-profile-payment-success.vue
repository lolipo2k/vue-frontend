<template>
    <div class="modal-background">
        <div class="modal-body success">
            <div class="close" @click="($parent.successModal = false)"></div>
            <h2>
                {{ $t('profile.application_accepted') }}
            </h2>
        </div>
    </div>
</template>
<script>
export default {
    name: 'v-profile-payment-success',
    mounted() {
        this.$nextTick(function () {
            console.log('132');
        })
    }
}
</script>