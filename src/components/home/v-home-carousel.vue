<template>
    <div class="v-home-carousel">
        <div v-if="!checkMobile">
            <Carousel>
                <Slide v-for="slide in 5" :key="slide">
                    <div class="carousel__item"><img src="../../assets/img/baner.png" alt=""></div>
                </Slide>
                <template #addons>
                    <Pagination />
                </template>
            </Carousel>
        </div>
        <div v-else>
            <Carousel>
                <Slide v-for="slide_mobile in 5" :key="slide_mobile">
                    <div class="carousel__item"><img src="../../assets/img/baner_mobile.svg" alt=""></div>
                </Slide>
                <template #addons>
                    <Pagination />
                </template>
            </Carousel>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
    name: 'v-home-carousel',
    inject: ['checkMobile'],
    components: {
        Carousel,
        Slide,
        Pagination,
    }
})
</script>