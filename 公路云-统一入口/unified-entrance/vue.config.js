const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部,
  // 例如 https://www.my-app.com/
  // 如果你的应用部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如将你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 '/my-app/'
  // 基本路径 baseURL已经过时
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  // compiler: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"))
      .set("utils", resolve("src/utils"));
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      const plugins = [];
      //生产环境去掉 console.log
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: true,
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ["console.log"] //移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       assets: "@/assets",
  //       components: "@/components",
  //       views: "@/views",
  //       utils: "@/utils"
  //     }
  //   }
  // },
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/css/mixin.scss";
        `
      },
      less: {
        javascriptEnabled: true
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    // modules: false
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0", //如果是真机测试，就使用这个IP
    port: 8080,
    https: false,
    hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    // proxy: "http://192.168.20.22", // 设置代理
    // prot:"80"
    // before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
