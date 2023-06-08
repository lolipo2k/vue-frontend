<template>
    <div class="user-bet" :class="{ act: animation }">
        <div class="user-bet_score">
            {{ $parent.bet }} ¥
        </div>
        <div class="user-bet_chips">
            <div v-if="$parent.chipsOne >= 1">
                <img v-for="i in $parent.chipsOne" :key="i" :style="'z-index:' + i + ';'"
                    src="@/assets/img/poker/chips/chips_one.svg" alt="">
            </div>
            <div v-if="$parent.chipsTen >= 1">
                <img v-for="i in $parent.chipsTen" :key="i" :style="'z-index:' + i + ';'"
                    src="@/assets/img/poker/chips/chips_ten.svg" alt="">
            </div>
            <div v-if="$parent.chipsHundred >= 1">
                <img v-for="i in $parent.chipsHundred" :key="i" :style="'z-index:' + i + ';'"
                    src="@/assets/img/poker/chips/chips_hundred.svg" alt="">
            </div>
            <div v-if="$parent.chipsThousand >= 1">
                <img v-for="i in $parent.chipsThousand" :key="i" :style="'z-index:' + i + ';'"
                    src="@/assets/img/poker/chips/chips_thousand.svg" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import emitter from '@/main';
export default {
    name: 'v-poker-bet',
    data() {
        return {
            animation: false
        }
    },
    mounted() {
        this.$nextTick(function () {
            emitter.on("animation", () => { this.animation = true });
        })
    }
}
</script>