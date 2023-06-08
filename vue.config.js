const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/style.scss";`
      }
    }
  },
    devServer: {
      proxy: 'http://backend:8000'
    }
})
