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
    uint256[] lines;
    bool isHeld;
  }

  struct BeforeRevealGame {
    uint256 id;
    uint256 startTime;
    uint256 drawingStartTime;
    uint256 endTime;
    address[] players;
  }

  struct AfterRevealGame {
    uint256 id;
    uint256 startTime;
    uint256 endTime;
    uint256 atariPos;
    address winner;
    address[] players;
    uint256[] playersPos;
    uint256[] lines;
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

  // _setup (by first entry): ゲームの初期設定。あたりの場所をprivate変数に格納
  function _setup(uint256 _nonce) private returns (uint256) {
    currentGameId++;
    uint256 startTime = block.timestamp;
    address[] memory players;
    uint256[] memory playersPos;
    uint256[] memory lines;

    Game memory newGame = Game({
      id: currentGameId,
      startTime: startTime,
      maxPlayerCount: 6, // TODO 一旦6人まで
      atariPos: _randMod(_nonce, 6), // TODO 一旦AからFまで。 A:0 ~ F:5
      players: players,
      playersPos: playersPos,
      lines: lines,
      isHeld: true
    });

    _games[currentGameId] = newGame;
    return newGame.id;
  }

  function _calcWinner(uint256 _id) private view returns (address) {
    uint256 currentPos = _games[_id].atariPos;
    address winner;

    // 配列の後ろから逆算していく
    for (uint256 i = _games[_id].lines.length - 1; i >= 0; i--) {
      if (_games[_id].lines[i] == currentPos) {
        // 右へ移動
        currentPos = currentPos + 1;
      } else if (_games[_id].lines[i] + 1 == currentPos) {
        // 左へ移動
        currentPos = currentPos - 1;
      }
    }

    for (uint256 i = 0; i < _games[_id].playersPos.length; i++) {
      if (_games[_id].playersPos[i] == currentPos) {
        // playersPosとplayersの配列の添字は紐づいている
        winner = _games[_id].players[i];
      }
    }

    return winner;
  }

  // entry: ゲームへのエントリー（ゲームが開催されてなかったら作成される）
  // 3文字で名前を一緒に入力
  function entry(uint32 _pos) public returns (bool) {
    uint256 gameId = currentGameId;
    if (_games[currentGameId].isHeld == false) {
      // 基準時間方針にする JST AM9:00 PST PM5:00
      // 24h
      // ギリギリ参加勢も許容
      // 自分の位置
      gameId = _setup(uint256(keccak256(abi.encodePacked(block.timestamp))));
    }

    require(_games[gameId].startTime + entryTimeDuration > block.timestamp, "Ended entry time");

    // 重複参加のチェック
    for (uint256 i = 0; i < _games[gameId].players.length; i++) {
      require(_games[gameId].players[i] != msg.sender, "Already player exists");
    }

    // ポジションの重複チェック
    for (uint256 i = 0; i < _games[gameId].playersPos.length; i++) {
      require(_games[gameId].playersPos[i] != _pos, "Already pos exists");
    }

    _games[gameId].players.push(msg.sender);
    _games[gameId].playersPos.push(_pos);
    return true; // succeed
  }

  // draw: 線を引く。private領域へ情報を格納。参加人数と同じ回数線を引ける。
  // TODO 誰がどこに弾いたかを見れるようにする？
  // 一律一人２本引ける
  // A,C,E と 1~12奇数, B,D,Fが 2~12 の偶数
  function draw(uint256 _id, uint256 startPos) public returns (bool) {
    require(_games[_id].startTime + entryTimeDuration < block.timestamp, "Not Started drawing time");
    require(_games[_id].startTime + entryTimeDuration + drawTimeDuration > block.timestamp, "Ended drawing time");

    // 参加者チェック
    bool canDraw = false;
    for (uint256 i = 0; i < _games[_id].players.length; i++) {
      if (_games[_id].players[i] == msg.sender) {
        canDraw = true;
      }
    }
    require(canDraw, "Does not entry");

    require(startPos >= 0 && startPos <= 5, "Invalid Position"); // TODO 一旦 A:0 ~ E:4 をマッピング
    _games[_id].lines.push(startPos);
    return true;
  }

  // reveal (by owner): isHeldを変えるだけ。
  // publicにしている理由はゲーム参加者が誰も結果表示をしなかった場合誰でもrevealできるようにするため
  // TODO full on chain にするならこれの呼び出し方法も検討
  function reveal(uint256 _id) public {
    require(_games[_id].startTime + entryTimeDuration + drawTimeDuration <= block.timestamp, "Not Ended drawing time");
    _games[_id].isHeld = false;
    // TODO 報酬の分配をするか検討
  }

  // 勝った人が自分の意思でmintできる

  // result: ゲーム結果を得る
  function result(uint256 _id) public view returns (AfterRevealGame memory) {
    require(_games[_id].isHeld == false, "Not revealed");

    AfterRevealGame memory _game = AfterRevealGame({
      id: _games[_id].id,
      startTime: _games[_id].startTime,
      endTime: _games[_id].startTime + entryTimeDuration + drawTimeDuration,
      atariPos: _games[_id].atariPos,
      winner: _calcWinner(_id),
      players: _games[_id].players,
      playersPos: _games[_id].playersPos,
      lines: _games[_id].lines
    });
    return _game;
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
