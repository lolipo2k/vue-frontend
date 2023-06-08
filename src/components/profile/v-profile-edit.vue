<template>
    <div class="modal-background v-profile-upload" v-if="changeProfile">
        <div class="modal-body change-password">
            <div class="close" @click="(this.changeProfile = false)"></div>
            <h2>
                {{ $t('profile.change') }}
            </h2>
            <div class="modal-body_form">
                <select v-model="editProfile">
                    <option selected value="1">{{ $t('profile.change_password') }}</option>
                    <option value="0">{{ $t('profile.change_nickname') }}</option>
                </select>
            </div>
            <vProfilePassword v-if="editProfile == 1"></vProfilePassword>
            <vProfileNickname v-if="editProfile == 0"></vProfileNickname>
        </div>
    </div>
    <vProfileSuccess v-if="successModal"></vProfileSuccess>
</template>

<script>
import emitter from '@/main';

import vProfilePassword from './edit/v-profile-password.vue';
import vProfileNickname from './edit/v-profile-nickname.vue';
import vProfileSuccess from './edit/v-profile-success.vue';

export default {
    name: 'v-profile-edit',
    components: {
        vProfilePassword,
        vProfileNickname,
        vProfileSuccess
    },
    data() {
        return {
            editProfile: 1,
            successModal: false,
            changeProfile: false,
        }
    },
    mounted() {
        this.$nextTick(function () {
            emitter.on("changeProfile", () => { this.changeProfile = true });
        })
    }
}
</script>