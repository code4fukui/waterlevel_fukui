# 福井県河川水位オープンデータ (Fukui River Water Level Open Data)

このプロジェクトは、福井県の災害情報ウェブサイトから河川水位データを自動的にスクレイピングし、オープンなCSV形式に変換して、リアルタイムの可視化を提供します。

## ライブデモ

- **[マップビュー](https://code4fukui.github.io/waterlevel_fukui/)**: 各センサーの最新水位を公式の警戒ステータスに応じた色分けで表示するインタラクティブマップ。
- **[グラフビュー](https://code4fukui.github.io/waterlevel_fukui/graph.html)**: 各センサーの最近の水位の推移を、危険水位に対するシンプルな棒グラフとして可視化するマップ。

## 特徴

- **自動データ収集**: GitHub Actionsが1時間ごとに実行され、最新のデータを取得します。
- **CSV形式のオープンデータ**: すべてのセンサーのメタデータと時系列データは、使いやすいCSVファイルとして保存されます。
- **インタラクティブな可視化**: 状況と推移の分析を一目で確認できる2種類のウェブベースのマップ。
- **地理空間API**: 任意の地理座標から最も近い水位センサーを検索できるJavaScriptモジュールが含まれています。

## オープンデータ (CSV)

- **[sensors.csv](https://code4fukui.github.io/waterlevel_fukui/sensors.csv)**: 全観測所のマスターリスト。ID、観測所名、河川名、位置情報（Geo3x3）、および公式の警戒水位の閾値（例: 氾濫注意水位、避難判断水位など）が含まれます。
- **[日次データディレクトリ](https://github.com/code4fukui/waterlevel_fukui/tree/main/data)**: `yyyy-mm-dd.csv` という形式のファイル名で日次の時系列データが保存されています。各ファイルには、その日の全センサーの観測値が含まれます。

## 仕組み

1. GitHub Actionsのワークフロー（`.github/workflows/scheduled-fetch.yml`）が1時間ごとにトリガーされます。
2. ワークフローがDenoスクリプト `makeData.js` を実行します。
3. このスクリプトが福井県の河川情報マップからHTMLをスクレイピングします。
4. 取得した生のHTMLを解析し、各センサーの最新の水位データを抽出します。
5. 新しいデータは、`/data` ディレクトリ内の当日のCSVファイルに追記されます。
6. 更新されたデータファイルは、自動的にこのリポジトリにコミットおよびプッシュされます。

## 開発者向けの使い方

### 前提条件

- [Deno](https://deno.land/) (v1.x)

### ローカルでの実行

手動でデータを1回取得するには、リポジトリをクローンして以下のコマンドを実行します:
```sh
deno run -A makeData.js
```

### 最寄りのセンサーの検索

ご自身のプロジェクトで `getNearest.js` モジュールを使用すると、指定した緯度・経度に最も近い水位センサーとその最新の観測値を検索できます。

```javascript
import { getNearest } from "https://code4fukui.github.io/waterlevel_fukui/getNearest.js";

// 例: 現在位置から最も近いセンサーを検索
const nearestSensor = await getNearest(35.943, 136.188);

console.log(nearestSensor);
/*
センサーのメタデータと最新の水位観測値を含むオブジェクトを出力します:
{
  id: "1",
  観測所名: "九十九橋",
  河川名: "足羽川",
  // ... その他のセンサーメタデータ
  geo3x3: "E9138735961882",
  distance: 2453.9, // メートル単位の距離
  日時: "2023-09-14T10:10",
  河川水位:
```
