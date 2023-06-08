<template>
    <div class="rotate-mobile v-poker-rotate" v-if="rotateMobile">
        <div>
            <img src="@/assets/img/poker/rotate.png" alt="">
            <p>
                {{ poker.rotate_screen }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'v-poker-rotate',
    data() {
        return {
            rotateMobile: false,
        }
    },
    methods: {
        infoMobile() {
            if (document.documentElement.clientWidth <= 650) {
                this.rotateMobile = true;
            }
            else {
                this.rotateMobile = false;
            }
        },
    },
    mounted() {
        this.$nextTick(function () {
            window.addEventListener('load', this.infoMobile);
            window.addEventListener('resize', this.infoMobile);
        })
    }
}
</script>