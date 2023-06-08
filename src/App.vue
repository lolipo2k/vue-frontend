<template>
  <default-layout>
    <router-view></router-view>
  </default-layout>
</template>

<script>
import DefaultLayout from './layouts/DefaultLayout.vue';
import params from "@/params";
export default {
  name: 'App',
  components: {
    DefaultLayout,
  },
  data() {
    return {
      currentUrl: params.BASE_URL

    }
  },
  provide() {
    return {
      currentUrl: this.currentUrl,
      checkMobile: this.isMobile()
    }
  },
  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
