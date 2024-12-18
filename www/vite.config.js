import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import data from "./src/js/json/setting.json" assert { type: "json" };
import { createHtmlPlugin } from "vite-plugin-html";

// ************************************ HTMLファイル(複数ページ設定) ************************************

//HTML上で出し分けたい各ページごとの情報を設定
const pageData = data.setting[0];

//htmlの複数出力を自動化する記述
import fs from "fs";
import path from "path";
import { title } from "process";

const files = [];
function readDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // componentsディレクトリを除外する
      if (item === "components") {
        continue;
      }

      readDirectory(itemPath);
    } else {
      // htmlファイル以外を除外する
      if (path.extname(itemPath) !== ".html") {
        continue;
      }

      // nameを決定する
      let name;
      if (dirPath === path.resolve(__dirname, "src")) {
        name = path.parse(itemPath).name;
      } else {
        const relativePath = path.relative(
          path.resolve(__dirname, "src"),
          dirPath
        );
        const dirName = relativePath.replace(/\//g, "_");
        name = `${dirName}_${path.parse(itemPath).name}`;
      }

      // pathを決定する
      const relativePath = path.relative(
        path.resolve(__dirname, "src"),
        itemPath
      );
      const filePath = `/${relativePath}`;

      files.push({ name, path: filePath });
    }
  }
}
readDirectory(path.resolve(__dirname, "src"));
const inputFiles = {};
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  inputFiles[file.name] = resolve(__dirname, "./src" + file.path);
}

// ************************************ ネットワーク 設定 ************************************

//CSSとJSファイルに更新パラメータを追加
const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      // npm run build のときのみ動作させる
      if (process.env.NODE_ENV !== "production") {
        return;
      }

      //更新パラメータ作成
      const date = new Date();
      const param =
        date.getFullYear() +
        date.getMonth() +
        date.getDate() +
        date.getHours() +
        date.getMinutes() +
        date.getSeconds();

      // CSSファイルにパラメータを追加（httpsから始まる外部リンクは除外）
      let setParamHtml = html
        .replace(
          // crossorigin属性を削除
          /<link\s+([^>]*)\s+crossorigin(="[^"]*")?/g,
          (match, attrs) => {
            return `<link ${attrs.trim()}`; // crossorigin属性を削除
          }
        )
        .replace(
          // ./assets/css/配下のCSSまたはSCSSにmedia="all"を追加
          /<link\s+([^>]*href="\.\/assets\/css\/[^"]*\.(css|scss)"[^>]*)>/g,
          (match, attrs) => {
            // media="all" を追加
            if (!attrs.includes('media="all"')) {
              return `<link ${attrs} media="all">`;
            }
            return match;
          }
        )
        // コメントアウトされたPHPタグを有効化
        .replace(
          /<!--\s*(<\?php[\s\S]*?\?>)\s*-->/g,
          (match, phpCode) => phpCode.trim() //コメントタグを除去
        );

      return setParamHtml;

      // JSファイルにパラメータを追加して変更内容を返す（httpsから始まる外部リンクは除外）
      // return setParamHtml.replace(
      //   /(?=.*<script)(?=.*js)(?!.*https).*$/gm,
      //   (match) => {
      //     // return match.replace(/\.js/, ".js?" + param);
      //     return match.replace(/\.js/, ".js");
      //   }
      // );
    },
  };
};

// ************************************ vite.config 設定 ************************************

export default defineConfig({
  // *******↓ Network設定を有効化してIPアドレスを発行する ↓*******
  server: {
    host: true, //IPアドレスを有効化
    watch: {
      usePolling: true,
    },
  },
  // *******↑ Network設定を有効化してIPアドレスを発行する ↑*******
  base: "./",
  root: "./src", //開発ディレクトリ設定
  build: {
    outDir: "../dist", //出力場所の指定
    rollupOptions: {
      //ファイル出力設定
      output: {
        //ファイルを分けて書き出す際には「manualChunks」内で記述すること
        manualChunks: (id) => {
          //CSSを分けて分けて書き出し
          const baseName = path.basename(id);
          let textBox = baseName.split(".");
          let fileType = baseName.split(".")[textBox.length - 1];

          console.log(fileType);

          if (fileType === "scss") {
            if (id.includes("reset.scss")) return `reset.min.css`;
            if (id.includes("common.scss")) return `common.min.css`;
            if (id.includes("style.scss")) return `style.css`;
          }
        },
        //ファイルを圧縮して書き出す際には「assetFileNames」内で記述すること
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".")[1];
          //Webフォントファイルの振り分け
          if (/ttf|otf|eot|woff|woff2/i.test(extType)) {
            extType = "fonts";
          }
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          //CSSを圧縮して書き出し
          // if (extType === "css") {
          //   return `assets/css/style.css`;
          // }
          if (extType === "min") {
            return `assets/css/[name][extname]`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        //jsファイルの名前を固定する際は、[name]の箇所を書き換える
        chunkFileNames: "assets/js/[name].js",
        entryFileNames: "assets/js/[name].js",
      },
      input: inputFiles,
    },
  },
  //プラグインの設定
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "./src/components"),
      //各ページ情報の読み込み
      context(pagePath) {
        return pageData[pagePath];
      },
    }),
    htmlPlugin(),
    createHtmlPlugin({
      minify: false, //HTMLコード改行なし：true
    }),
  ],
});
