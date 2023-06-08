<template>
    <ul v-if="cards.length != 0">
        <li v-for="card in cards" :key="card">
            <img :src="require('@/assets/img/poker/carts/' + this.suitCards[card[1]] + '/' + this.rankCards[card[0]] + '.svg')"
                alt="">
        </li>
    </ul>
</template>

<script>
export default {
    name: 'v-poker-history-center',
    inject: ['suitCards', 'rankCards'],
    props: ['cards']
}
</script>