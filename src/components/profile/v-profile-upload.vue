<template>
    <div class="modal-background v-profile-upload">
        <div class="modal-body upload-photo">
            <div class="close" @click="(this.$parent.uploadPhoto = false)"></div>
            <h2>
                {{ $t('profile.upload_a_photo') }}
            </h2>
            <div class="frame-upload" v-if="!cropShow">
                <div class="btn-default" @click="this.$refs.uploadInput.click();">{{ $t('profile.select_photo') }}</div>
                <div v-if=" error != '' " class="error">
                    {{ error }}
                </div>
                <input type="file" @change=" onFileChanged() " accept="image/*" ref="uploadInput">
            </div>
            <div class="picture-cropping" v-if=" cropShow ">
                <VuePictureCropper
                    :boxStyle=" { width: '100%', height: '300px', backgroundColor: '#f8f8f8', margin: 'auto', } "
                    :img=" this.inputImgUrl " :options=" { viewMode: 1, dragMode: 'crop', aspectRatio: 4 / 4, } " />
                <div class="picture-cropping_btns">
                    <div class="btn-default" @click=" uploadResults() ">{{ $t('profile.upload') }}</div>
                    <div class="btn-default cancel" @click=" cropShowChange() ">{{ $t('profile.cancel') }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'
import axios from 'axios';
import emitter from '../../main';

const getObjectURL = (file) => {
    let url
    if (window.createObjectURL) {
        url = window.createObjectURL(file)
    } else if (window.URL) {
        url = window.URL.createObjectURL(file)
    } else if (window.webkitURL) {
        url = window.webkitURL.createObjectURL(file)
    }
    return url
}

export default {
    name: 'v-profile-upload',
    inject: ['currentUrl'],
    components: {
        VuePictureCropper
    },
    data() {
        return {
            error: '',
            inputImgUrl: '',
            cropShow: false,
            dataImg: '',
        }
    },
    methods: {
        cropShowChange() {
            this.cropShow = !this.cropShow;
        },
        uploadResults() {
            if (!cropper) return
            this.cropShowChange();
            cropper.getBlob().then(response => {
                this.dataImg = response
                this.sendFile()
            });
        },
        sendFile() {
            let token = localStorage.getItem("auth");
            axios.put(this.currentUrl + '/user/upload/img/',
                {
                    image: this.dataImg,
                },
                {
                    headers: {
                        'Authorization': 'Token ' + token,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    this.$parent.uploadPhoto = false;
                    this.error = '';

                    let image = res.data.image.split('media');
                    let url = '/media' + image[1] + '?' + new Date().getTime()
                    this.$parent.profileData.image_large = url

                    let profile = JSON.parse(localStorage.getItem("profileInfo"));
                    profile.image_medium = url
                    emitter.emit("profileInfo", profile);
                })
                .catch(() => {
                    this.error = this.$t("profile.upload_error")
                });
        },
        onFileChanged() {
            this.inputImgUrl = getObjectURL(this.$refs.uploadInput.files.item(0));
            this.cropShowChange();
        }
    },
}
</script>