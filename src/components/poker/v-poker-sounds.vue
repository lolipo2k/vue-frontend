<template>
    <div class="fixed-center"></div>
    <audio ref="foldSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/fold.mp3" type="audio/mpeg">
    </audio>
    <audio ref="allInSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/All_in_sound.mp3" type="audio/mpeg">
    </audio>
    <audio ref="cardsStartSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/cardsStart.mp3" type="audio/mpeg">
    </audio>
    <audio ref="checkSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/Check_sound.mp3" type="audio/mpeg">
    </audio>
    <audio ref="chipsSoundRaise" preload="auto" style="display: none">
        <source src="@/assets/sounds/Chips_sound_raise.mp3" type="audio/mpeg">
    </audio>
    <audio ref="cardAddSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/Diller_add_card_on_the_table.mp3" type="audio/mpeg">
    </audio>
    <audio ref="winRoundSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/win_every_round.mp3" type="audio/mpeg">
    </audio>
    <audio ref="winLastGameSound" preload="auto" style="display: none">
        <source src="@/assets/sounds/win_whole_game_sound.mp3" type="audio/mpeg">
    </audio>
</template>

<script>
export default {
    name: 'v-poker-sounds',
}
</script>