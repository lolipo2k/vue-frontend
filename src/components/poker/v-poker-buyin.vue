<template>
    <div class="v-poker-buyin">
        <div v-if="!inGame" class="buyin-info">
            <div class="buyin-info_text">
                {{ $t('poker.your_buyin') }} <span>{{ chipsBuyin }}</span>
            </div>
            <div class="buyin-info_btn">
                <div class="btn-default" @click="(isOpen = true)">
                    {{ $t('poker.change_buyin') }}
                </div>
            </div>
        </div>
        <div class="modal-background" v-if="isOpen && !inGame">
            <div class="modal-body buyin-range">
                <div class="close" @click="(isOpen = false)"></div>
                <h2>
                    {{ $t('poker.change_buyin') }}
                </h2>
                <div class="buyin-range_content">
                    <div class="buyin-range_content-value">
                        <input type="number" v-model.number="chipsBuyin" :max="min(dataBuyin.max, profileData.chips)"
                            :min="dataBuyin.min">
                    </div>
                    <div class="buyin-range_content-slider">
                        <input type="range" step="1" v-model="chipsBuyin" :max="min(dataBuyin.max, profileData.chips)"
                            :min="dataBuyin.min">
                    </div>
                </div>
                <div class="btn-default" @click="(isOpen = false)">
                    {{ $t('poker.choose') }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import emitter from '@/main';

export default {
    name: 'v-poker-buyin',
    inject: ['currentUrl'],
    data() {
        return {
            chipsBuyin: 0,
            isOpen: false,
            dataBuyin: {
                min: 0,
                max: 0
            },
            inGame: false,
            profileData: {},
        }
    },
    methods: {
        min(a, b) {
            a = Number(a)
            b = Number(b)
            return (a < b) ? a : b;
        },
        seat(data) {
            this.inGame = true;
            emitter.emit("playerBalance", this.chipsBuyin);
            this.$parent.socket.send({
                'type': 'seat',
                'data': {
                    'action': 'seat',
                    'params': {
                        "seat_class": data.number,
                        "seat_index": data.index,
                        "buy_in": Number(this.chipsBuyin)
                    }
                }
            });
        },
        gameDetail() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + `/game/game/poker/${this.$route.params.game}/detail`,
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    this.dataBuyin.min = Number(res.data.min_buyin)
                    this.dataBuyin.max = Number(res.data.max_buyin)
                    this.chipsBuyin = Number(res.data.min_buyin)
                    emitter.emit("gameDetail", this.dataBuyin);
                    emitter.emit("maxSeats", res.data.max_seats);
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.gameDetail()
            emitter.on("seat", data => {
                this.seat(data)
            });
            emitter.on("statusGame", data => {
                this.inGame = data
            });
            this.profileData = JSON.parse(localStorage.getItem("profileInfo"));
        })
    }
}
</script>