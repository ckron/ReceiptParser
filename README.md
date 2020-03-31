# ReceiptParser
Receipt parse program.(GAS)
サンプル
```
Order ID B12AC
6/20/2018 12:00 AM
1x        Product_A        ￥2000
opt_A        ￥150             
opt_B        ￥50
1x        Product_B        ￥1500        
opt_A        ￥150
opt_C        ￥50
Sales        ￥3900
Promotion        (￥20)
```
### 説明
サンプルのデータを
B12AC,Product_A,1,1,0,20(ID,商品名,オプションA有無,オプションB有無,オプションC有無,プロモーション金額)
に分けてセル挿入する

### 導入
1. Google spreadsheetを作成.
2. 画面上部の ツール > スクリプトエディタを選択
3. 無題のプロジェクトが開くので、 `ReceiptParser.gs` のコードをコピペ
4. 画面上部の 実行 > 関数を実行 > `ReceiptParser` を選択
5. 色々、許可を聞かれるのですべて許可する
6. 終了

### 動作
1. A1にコピペされたデータを3つに分解(header,body,footer)
2. それぞれから必要なデータを取得(Acquire???)
3. 最後の行に取得したデータを挿入
4. A1のデータを削除