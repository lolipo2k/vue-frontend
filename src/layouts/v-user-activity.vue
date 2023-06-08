<template>
    <div class="activity-users">
        {{ count }}
        <img src="@/assets/img/activity.svg" alt="">
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'v-user-activity',
    inject: ['currentUrl'],
    data() {
        return {
            count: 0,
        }
    },
    methods: {
        getActivity() {
            let token = localStorage.getItem("auth");
            axios.get(this.currentUrl + '/user/user-activity/',
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                    }
                })
                .then((res) => {
                    console.log(res);
                    this.count = res.data.count
                });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.getActivity();
        })
    }
}
</script>