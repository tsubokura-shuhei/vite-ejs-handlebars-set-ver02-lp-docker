【起動手順】

1.docker-compose.yml ディレクトリ内で「docker compose build」コマンドを実施

2.docker-compose.yml ディレクトリ内で「docker compose up -d」コマンドを実施

3.docker-compose.yml ディレクトリ内で「docker compose exec node-js bash」コマンドを実施(docker のコンテナ内に接続する)

4.docker コンテナ内の作業ディレクトリは以下になります。
※cd コマンドで以下のディレクトリに移動する
/var/www

5.「npm i」コマンドで node モジュールをインストールする

6.「npm run dev」コマンドで vite を起動する
