const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    //配置端口号
    port: 8888,
    //配置代理
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        pathRewrite: {
          '^/api':''
        }
      }
    }
  }
})
