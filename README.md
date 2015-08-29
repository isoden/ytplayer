YTPlayer
===

Wrapper for YouTube iframe API

## Installation

```
$ npm install ytplayer --save
```

## Usage

```html
<div id="yt-player"></div>
<script src="path/to/ytplayer.js"></script>
```

```js
var player = new YTPlayer({
  el     : 'yt-player',
  videoId: 'JWSRqWpWPzE',
  vars   : {
    rel: 0
  }
});

player.on('ready', function () {
  player.play()
});
```
