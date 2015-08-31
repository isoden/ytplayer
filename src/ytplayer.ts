/// <reference path="../typings/bundle.d.ts"/>
/// <reference path="../node_modules/@isoden/eveemi/eveemi.d.ts"/>

// 依存モジュールをインポート
import {Promise} from 'es6-promise';
import {bindAll} from './utility';
import EveEmi    = require('@isoden/eveemi');

interface PlayerOptions {
  el      : string;
  videoId : string;
  width?  : number;
  height? : number;
  vars?   : YT.PlayerVars;
}

class YTPlayer extends EveEmi {
  protected el      : HTMLElement;
  protected player  : YT.Player;
  protected isReady : boolean = false;
  protected options : PlayerOptions;

  protected static queue: any = null;
  protected static default = {
    width  : 560,
    height : 315
  };

  static ready() {
    if (this.queue != null) return this.queue;

    let tag = document.createElement('script');
    let firstScriptTag = document.getElementsByTagName('script')[0];
    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    return this.queue = new Promise(resolve => (<any>window).onYouTubeIframeAPIReady = resolve);
  }

  constructor(options: PlayerOptions) {
    super();

    this.el      = document.getElementById(options.el);
    this.options = options;

    this._initialize();
  }

  /**
   * 初期化処理
   */
  protected _initialize() {
    // インスタンスメソッドのコンテキストを束縛
    bindAll(this, [
      '_setup',
      '_errorHandler',
      '_readyHandler',
      '_stateChangeHandler',
      '_playbackQualityChangeHandler'
    ]);

    // iframe_apiの読み込みを待ってセットアップを行う。
    YTPlayer.ready().then(this._setup);
  }

  /**
   * 動画を再生する
   */
  play(): void {
    if (!this.isReady) return;
    this.player.playVideo();
  }

  /**
   * 動画を一時停止する
   */
  pause(): void {
    if (!this.isReady) return;
    this.player.pauseVideo();
  }

  /**
   * 動画を停止する
   */
  stop(): void {
    if (!this.isReady) return;
    this.player.stopVideo();
  }

  /**
   * 指定秒数まで動画をシークする
   */
  seekTo(second: number, allowSeekAhead: boolean): void {
    if (!this.isReady) return;
    this.player.seekTo(second, allowSeekAhead);
  }

  /**
   * 表示をクリアする
   */
  clear() {
    if (!this.isReady) return;
    this.player.clearVideo();
  }

  /**
   * ボリュームのsetter/getter
   */
  volume(value?: number) {
    if (!this.isReady) return;

    if (typeof value === 'number') {
      return this.player.setVolume(value);
    };

    this.player.getVolume();
  }

  /**
   * 要素を含めてプレイヤーを削除する
   */
  destroy(): void {
    if (!this.isReady) return;
    // this.player.destroy();
  }

  /**
   * プレイヤーのインスタンスを生成する
   */
  protected _setup() {
    this.player = new YT.Player(this.el.id, {
      width      : this.options.width,
      height     : this.options.height,
      events     : this._getEventMap(),
      videoId    : this.options.videoId,
      playerVars : this.options.vars
    });

    this.isReady = true;
  }

  /**
   * 動画再生が出来る状態になったら呼ばれる
   */
  protected _readyHandler(...args) {
    this.trigger('ready', ...args);
  }

  /**
   * エラー発生時に呼ばれる
   */
  protected _errorHandler(...args) {
    this.trigger('error', ...args);
  }

  /**
   * 動画の画質を変更した時に呼ばれる
   */
  protected _playbackQualityChangeHandler(...args) {
    this.trigger('playbackqualitychange', ...args);
  }

  /**
   * 動画状態が変更したら呼ばれる
   */
  protected _stateChangeHandler(...args) {
    this.trigger('statechange', ...args);
  }

  /**
   * YT.Playerのオプションに渡すイベントマップ
   */
  protected _getEventMap() {
    return  {
      onError                : this._errorHandler,
      onReady                : this._readyHandler,
      onStateChange          : this._stateChangeHandler,
      onPlaybackQualityChange: this._playbackQualityChangeHandler
    };
  }
}

export = YTPlayer;
