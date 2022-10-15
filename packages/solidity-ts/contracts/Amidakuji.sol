pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Amidakuji is Ownable {
  uint256 public currentGameId;
  uint256 public entryTimeDuration = 1 days;
  uint256 public drawTimeDuration = 10 minutes;

  // TODO uint256 を最適化
  struct Game {
    uint256 id;
    uint256 startTime;
    uint256 maxPlayerCount;
    uint256 atariPos;
    address[] players;
    uint256[] playersPos;
    uint256[] line;
    bool revealed;
  }

  struct BeforeRevealGame {
    uint256 id;
    uint256 startTime;
    uint256 drawingStartTime;
    uint256 endTime;
    address[] players;
  }

  mapping(uint256 => Game) private _games;

  constructor() {
    currentGameId = 0;
  }

  function _indexOf(uint256[] memory arr, uint256 searchFor) private pure returns (uint256) {
    for (uint256 i = 0; i < arr.length; i++) {
      if (arr[i] == searchFor) {
        return i;
      }
    }
    revert("Not found");
  }

  // TODO oracleを使った方が安全
  function _randMod(uint256 _nonce, uint256 _modulus) private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nonce))) % _modulus;
  }

  // TODO 最新のチェックができるなら、誰でも叩けていい気がしている
  // setup (by owner): ゲームの初期設定。あたりの場所をprivate変数に格納
  function setup(uint256 _nonce) public onlyOwner returns (uint256) {
    // TODO 最新がrevealedになってるかどうかのチェック

    currentGameId++;
    uint256 startTime = block.timestamp;
    address[] memory players;
    uint256[] memory playersPos;
    uint256[] memory line;

    Game memory newGame = Game({
      id: currentGameId,
      startTime: startTime,
      maxPlayerCount: 6, // TODO 一旦6人まで
      atariPos: _randMod(_nonce, 6), // TODO 一旦AからFまで。 A:0 ~ F:6
      players: players,
      playersPos: playersPos,
      line: line,
      revealed: false
    });

    _games[currentGameId] = newGame;

    return newGame.id;
  }

  // entry: 自分の初期位置の設定（＆ゲームへのエントリー）
  function entry(uint256 _id, uint32 _pos) public returns (bool) {
    if (_games[_id].id == 0) revert("Not exists");
    if (_games[_id].startTime + entryTimeDuration < block.timestamp) revert("Ended entry time");

    // 重複参加のチェック
    for (uint256 i = 0; i < _games[_id].players.length; i++) {
      if (_games[_id].players[i] == msg.sender) {
        revert("Already exists");
      }
    }

    // ポジションの重複チェック
    for (uint256 i = 0; i < _games[_id].playersPos.length; i++) {
      if (_games[_id].playersPos[i] == _pos) {
        revert("Already exists");
      }
    }

    _games[_id].players.push(msg.sender);
    _games[_id].playersPos.push(_pos);
    return true; // succeed
  }

  // draw: 線を引く。private領域へ情報を格納。参加人数と同じ回数線を引ける。
  // TODO 誰がどこに弾いたかを見れるようにする？
  function draw(uint256 _id, uint256 startPos) public returns (bool) {
    if (_games[_id].startTime + entryTimeDuration > block.timestamp) revert("Not Started drawing time");
    if (_games[_id].startTime + entryTimeDuration + drawTimeDuration < block.timestamp) revert("Ended drawing time");

    // 参加者チェック
    bool canDraw = false;
    for (uint256 i = 0; i < _games[_id].players.length; i++) {
      if (_games[_id].players[i] == msg.sender) {
        canDraw = true;
      }
    }
    if (!canDraw) {
      revert("Does not entry");
    }

    if (startPos < 0 && startPos > 5) revert("Invalid Position"); // TODO 一旦 A:0 ~ E:5 をマッピング
    _games[_id].line.push(startPos);
    return true;
  }

  // TODO 誰でも叩けていい気がしている
  // reveal (by owner): revealedを変えるだけ。
  function reveal(uint256 _id) public onlyOwner {
    if (_games[_id].startTime + entryTimeDuration + drawTimeDuration > block.timestamp) revert("Not Ended drawing time");
    _games[_id].revealed = true;
    // TODO 報酬の分配
  }

  // result: ゲーム結果を得る（実態はリビールされたGame Structを返している）
  function result(uint256 _id) public view returns (Game memory) {
    if (_games[_id].revealed == false) revert("Not revealed");
    return _games[_id];
  }

  // reveal前のGameを返す
  function game(uint256 _id) public view returns (BeforeRevealGame memory) {
    BeforeRevealGame memory _game = BeforeRevealGame({
      id: _games[_id].id,
      startTime: _games[_id].startTime,
      drawingStartTime: _games[_id].startTime + entryTimeDuration,
      endTime: _games[_id].startTime + entryTimeDuration + drawTimeDuration,
      players: _games[_id].players
    });
    return _game;
  }
}
