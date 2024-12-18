    【node.jsのバージョン】
    v16.16.0 以上を推奨

    【実行コマンド説明】

    ・通常のビルド実行コマンド
    "build": "vite build",

    ・ビルド書き出し後のdistフォルダの実行コマンド
    "preview": "vite preview",

    ・通常のビルド実行コマンド　＆　HTMLのコード整形コマンド
    "builds": "vite build && html-beautify dist/**/*.html",

    ・通常のビルド実行コマンド　＆　HTMLのコード整形コマンド　＆　「public/assets/js」内のjsファイル圧縮コマンド
    "builds-js": "vite build && html-beautify dist/**/*.html && esbuild src/public/assets/js/*.js --bundle --minify --outdir=dist/assets/js/"


    【詳細な記事は以下を参考】
    https://coding-memo.work/development/1274/


    【補足について】
    ・main.jsのファイルのみ①の階層に配置すること、main.js以外のjsファイルは②に配置する
    ① /src/js/  ← main.jsを配置する
    ② /src/public/assets/js/　← main.js以外のファイルを配置する（common.js、app.jsなど）
