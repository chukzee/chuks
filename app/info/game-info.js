
"use strict";

var Base = require('../base');


class GameInfo extends   Base {

    constructor(sObj) {
        super(sObj);

    }
    get gameId() {
        return this._gameId;
    }

    set gameId(gameId) {
        this._gameId = gameId;
    }

    get whitePlayer() {
        return this._whitePlayer;
    }

    /**for games such as scrabble, ludo
     * 
     * @param players
     */
    set players(players) {
        this._players = players;
    }

    set whitePlayer(whitePlayer) {
        this._whitePlayer = whitePlayer;
    }

    get blackPlayer() {
        return this._blackPlayer;
    }

    set blackPlayer(blackPlayer) {
        this._blackPlayer = blackPlayer;
    }

    get players() {
        return this._players;
    }

    get score() {
        return this._score;
    }

    set score(score) {
        this._score = score;
    }

    get timeBegin() {
        return this._timeBegin;
    }

    set timeBegin(timeBegin) {
        this._timeBegin = timeBegin;
    }

    get timeEnd() {
        return timeEnd;
    }

    set timeEnd(timeEnd) {
        this._timeEnd = timeEnd;
    }

    get winner() {
        return this._winner;
    }

    set winner(winner) {
        this._winner = winner;
    }

    
}

module.exports = GameInfo;

