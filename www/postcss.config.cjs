const { default: autoprefixer } = require("autoprefixer");

module.exports = {
  plugins: {
    "postcss-normalize-charset": {},
    autoprefixer: {},
    "postcss-sort-media-queries": {},
    "css-declaration-sorter": { order: "smacss" },
    // *********↓ 通常は使用不可（未使用スタイルの削除設定）↓*********
    // "@fullhuman/postcss-purgecss": {
    //   content: ["./src/**/*.html", "./src/js/**/*.js"],
    //   //除外設定　https://purgecss.com/safelisting.html
    //   safelist: ["hoge"],
    // },
    // *********↑ 通常は使用不可（未使用スタイルの削除設定）↑*********
  },
};
