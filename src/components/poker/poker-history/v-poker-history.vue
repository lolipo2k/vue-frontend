<template>
    <div class="history-open" @click="isOpen = true">
        <img src="@/assets/img/poker-history/history-open.svg" alt="">
    </div>

    <vPokerHistoryContent v-if="isOpen"></vPokerHistoryContent>
</template>

<script>
import emitter from '@/main';

import vPokerHistoryContent from './v-poker-history-content.vue'

export default {
    name: 'v-poker-history',
    components: {
        vPokerHistoryContent
    },
    data() {
        return {
            isOpen: false
        }
    },
    mounted() {
        this.$nextTick(function () {
            emitter.on("closeHistory", () => {
                this.isOpen = false
            });
        })
    }
}
</script>