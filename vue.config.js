const path = require('path');

module.exports = {
    publicPath: './',
    productionSourceMap: false,
    outputDir:"../support-app/support-app-assessment/target/classes/META-INF/resources",
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        compress: true,
        disableHostCheck: true,
        // proxy: "http://172.16.190.141:30806",
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.ts',
            // 模板来源
            // template: 'src/template.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '111',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            // chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
    },
    configureWebpack: (config) => {
      config.module.rules.push(
        {
          test: path.resolve(__dirname, 'node_modules/leader-line/'),
          use: [{
            loader: 'skeleton-loader',
            options: {procedure: content => `${content}export default LeaderLine`}
          }]
        }
      )
    },    
}