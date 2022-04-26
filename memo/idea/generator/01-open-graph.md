# Open Graph

* https://ogp.me/

## 分類

* `website`
	* `profile`
	* `article`
* `book`
* `video`
	* `movie`
	* `tv_show`
		* `episode`
	* `other`
* `music`
	* `album`
		* `song`
	* `playlist`
	* `radio_station`

　ひとつのHTML文書あたり、どれかひとつだけを選択する。未指定のときは`website`である。

## 記法

基本
```html
<head prefix="og: https://ogp.me/ns#">
    <meta property="og:type" content="website" />
    <meta property="og:title" content="タイトル" />
    <meta property="og:url" content="URL" />
    <meta property="og:image" content="画像URL" />
</head>
```

基本＋拡張
```html
<head prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
    <meta property="og:type" content="article" />
    <meta property="og:title" content="タイトル" />
    ...
    <meta property="article:author" content="著者名" />
    ...
</head>
```

　OpenGraphはひとつの文書あたり、どれかひとつの型`og:type`である。その型に沿ったメタデータをセットする。

### Basic

`property`|データ型|`content`
----------|--------|---------
`og:type`|列挙型|型（`website`, `profile`, `article`, `book`, `video.movie`, `video.tv_show`, `video.episode`, `video.other`, `music.song`, `music.album`, `music.playlist`, `music.rasio_station`）
`og:title`||
`og:url`||
`og:image`||
`og:audio`||
`og:description`||
`og:determiner`||
`og:locale`||
`og:locale:alternate`||
`og:site_name`||
`og:video`||

#### Basic-Image

`property`|データ型|`content`
----------|--------|---------
`og:image:url`||
`og:image:secure_url`||
`og:image:type`||
`og:image:width`||
`og:image:height`||
`og:image:alt`||

#### Basic-Video

`property`|データ型|`content`
----------|--------|---------
`og:video:secure_url`||
`og:video:type`||
`og:video:width`||
`og:video:height`||

#### Basic-Audio

`property`|データ型|`content`
----------|--------|---------
`og:audio:secure_url`||
`og:audio:type`||

　音声系は名前の統一性がない。`og:audio`なのに、`og:type`属性値は`music.song`である。`audio.song`,`audio.radio_station`のようにしてほしかった。

　ほかは統一されている。`og:video`における`og:type`は`video.movie`だし、`profile`における`og:type`は`profile`。このように一致している。

### Profile

`property`|データ型|`content`
----------|--------|---------
`profile:first_name`|文字列|通常、親または自己選択によって個人に付けられる名前。
`profile:last_name`|文字列|家族または結婚から継承され、個人が一般的に知られている名前。
`profile:username`|文字列|それらを識別するための短い一意の文字列。
`profile:gender`|列挙型(`male`,`female`)|性別。

