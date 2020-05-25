module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  pwa: {
    name: 'Pomodoro Timer',
    themeColor: '#ffffff',
    manifestOptions: {
      background_color: '#ffffff',
    },
  },
};
