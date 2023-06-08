<template>
    <div class="free-seat" @click="seat(number, index)">
        <img src="@/assets/img/poker/poker-chair.svg" alt="">
    </div>
</template>

<script>
import emitter from '@/main';

export default {
    name: 'v-poker-seat',
    props: {
        number: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
    },
    methods: {
        seat(number, index) {
            let data = { number: number, index: index }
            this.$parent.inGame = true;
            emitter.emit("seat", data);
        },
    }
}
</script>