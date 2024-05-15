@echo off
 
rem 「for」コマンドを使った一定回数のループ
for /l %%n in (1,1,1000) do (
 
  rem 「%%n」の中身をコマンドプロンプト画面に出力
  echo Create '%%n'
  mkdir %%n
  rem type nul > %%n\.gitkeep
)