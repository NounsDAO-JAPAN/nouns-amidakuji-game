pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "./StringUtils.sol";

contract NounsAmidakuji is Ownable {
  using StringUtils for string;

  event msgEvent(address indexed from, string msg);

  uint256 public currentGameId;
  uint256 public baseStartTime;
  uint256 public startTimeDuration = 1 days; // 86400s

  struct PrivateGame {
    uint256 id;
    uint256 startTime;
    uint256 endTime;
    uint8 atariPosition; // A->1 ~ F->6
    address[] players;
    uint8[] playerPositions; // playersと同じindexに格納
    string[] playerNames; // playersと同じindexに格納
    address[] linePlayers;
    uint8[] linesX; // linePlayersと同じindexに格納
    uint8[] linesY; // linePlayersと同じindexに格納
  }

  struct PublicGame {
    uint256 id;
    uint256 startTime;
    uint256 endTime;
    address[] players;
    string[] playerNames;
    uint8[] playerPositions;
    uint8[] myLinesX;
    uint8[] myLinesY;
  }

  struct ResultGame {
    uint256 id;
    uint256 startTime;
    uint256 endTime;
    uint8 atariPosition;
    address winner;
    address[] players;
    uint8[] playerPositions;
    string[] playerNames;
    uint8[] myLinesX;
    uint8[] myLinesY;
    bool[12][] amidaMap;
  }

  mapping(uint256 => PrivateGame) private _games;

  constructor() {
    currentGameId = 0;
    baseStartTime = 1672185600; // 2022-12-28 09:00:00 (JST)
  }

  function _randMod(uint256 _nonce, uint256 _modulus) private view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _nonce))) % _modulus;
  }

  // _setup (by first entry): ゲームの初期設定。あたりの場所をprivate変数に格納
  function _setup(uint256 _nonce) private returns (uint256) {
    uint256 beforeGameStartTime = _games[currentGameId].startTime;
    if (beforeGameStartTime == 0) {
      beforeGameStartTime = baseStartTime;
    }

    // 前回の開始日からの日付差分
    // 暫定で300年くらいプレイされなくても大丈夫
    uint256 beforeGameDiffDate;
    for (uint256 i = 1; i < 100000; i++) {
      if (beforeGameStartTime + (startTimeDuration * (i + 1)) > block.timestamp) {
        beforeGameDiffDate = i;
        break;
      }
    }

    currentGameId++;
    _games[currentGameId].id = currentGameId;
    // YYYY/MM/DD 09:00:00(JST)
    _games[currentGameId].startTime = beforeGameStartTime + (beforeGameDiffDate * startTimeDuration);
    _games[currentGameId].endTime = beforeGameStartTime + (beforeGameDiffDate * startTimeDuration) + startTimeDuration;
    _games[currentGameId].atariPosition = uint8(_randMod(_nonce, 6) + 1);

    return currentGameId;
  }

  function _myLines(uint256 _id) private view returns (uint8[] memory, uint8[] memory) {
    uint8[] memory myLinesX = new uint8[](2);
    uint8[] memory myLinesY = new uint8[](2);

    uint8 count = 0;
    for (uint256 i = 0; i < _games[_id].linePlayers.length; i++) {
      if (_games[_id].linePlayers[i] == msg.sender) {
        myLinesX[count] = _games[_id].linesX[i];
        myLinesY[count] = _games[_id].linesY[i];
        count++;
      }
    }

    return (myLinesX, myLinesY);
  }

  function _lineToMap(uint256 _id) private view returns (bool[12][] memory) {
    bool[12][] memory map = new bool[12][](6);

    // mapping
    for (uint256 i = 0; i < _games[_id].linePlayers.length; i++) {
      uint8 lineX = _games[_id].linesX[i];
      uint8 lineY = _games[_id].linesY[i];
      if (lineX != 0 && lineY != 0) {
        map[lineX - 1][lineY - 1] = true;
      }
    }

    return map;
  }

  function _calcWinner(uint256 _id) private view returns (address) {
    uint256 currentPos = _games[_id].atariPosition;
    address winner;
    // アクセスするときは添字が逆になるのに注意
    bool[12][] memory map = _lineToMap(_id);

    // // 配列の後ろから逆算していく
    for (uint256 i = 12; i > 0; i--) {
      if (map[currentPos - 1][i - 1] == true) {
        // 終点とマッチ
        currentPos = currentPos + 1;
      } else if (currentPos >= 2) {
        if (map[currentPos - 2][i - 1] == true) {
          // 始点とマッチ
          currentPos = currentPos - 1;
        }
      }
    }

    for (uint256 i = 0; i < _games[_id].playerPositions.length; i++) {
      if (_games[_id].playerPositions[i] == currentPos) {
        // playerPositionsとplayersの配列の添字は紐づいている
        winner = _games[_id].players[i];
      }
    }

    return winner;
  }

  // entry: ゲームへのエントリー（ゲームが開催されてなかったら作成される）
  function entry(string memory _name, uint8 _pos) public returns (bool) {
    uint256 gameId = currentGameId;

    if (_games[gameId].startTime + startTimeDuration < block.timestamp) {
      gameId = _setup(uint256(keccak256(abi.encodePacked(block.timestamp))));
    }

    // 重複参加のチェック
    for (uint256 i = 0; i < _games[gameId].players.length; i++) {
      require(_games[gameId].players[i] != msg.sender, "Already player exists");
    }

    // ポジションの重複チェック
    for (uint256 i = 0; i < _games[gameId].playerPositions.length; i++) {
      require(_games[gameId].playerPositions[i] != _pos, "Already pos exists");
    }

    // name check
    // Feature: 英数字チェック
    require(_name.strlen() >= 0 && _name.strlen() <= 3, "Name is invalid");
    require(_pos >= 1 && _pos <= 6, "Invalid x Position");

    _games[gameId].players.push(msg.sender);
    _games[gameId].playerPositions.push(_pos);
    _games[gameId].playerNames.push(_name);

    emit msgEvent(msg.sender, "DONE");
    return true; // succeed
  }

  // draw: 2本の線を引く。private領域へ情報を格納。1人２本引ける
  // xStartPosはA,C,Eが1~12の奇数, B,Dが2~12の偶数
  function draw(
    uint8 xStartPos1,
    uint8 y1,
    uint8 xStartPos2,
    uint8 y2
  ) public returns (bool) {
    uint256 gameId = currentGameId;
    require(_games[gameId].startTime + startTimeDuration > block.timestamp, "Game is not started");

    // 参加チェック
    bool canDraw = false;
    for (uint256 i = 0; i < _games[gameId].players.length; i++) {
      if (_games[gameId].players[i] == msg.sender) {
        canDraw = true;
      }
    }
    require(canDraw, "Does not entry");

    // A:1 ~ E:5
    require(xStartPos1 >= 1 && xStartPos1 <= 5, "Invalid x Position");
    require(y1 >= 1 && y1 <= 12, "Invalid y1 Position");
    require(xStartPos2 >= 1 && xStartPos2 <= 5, "Invalid x Position");
    require(y2 >= 1 && y2 <= 12, "Invalid y2 Position");

    // 奇数偶数チェック
    // A,C,E
    if (xStartPos1 == 1 || xStartPos1 == 3 || xStartPos1 == 5) {
      require(y1 % 2 == 1, "Invalid y1 position");
    } else {
      require(y1 % 2 == 0, "Invalid y1 position");
    }
    if (xStartPos2 == 1 || xStartPos2 == 3 || xStartPos2 == 5) {
      require(y2 % 2 == 1, "Invalid y2 position");
    } else {
      require(y2 % 2 == 0, "Invalid y2 position");
    }

    // 1人2本チェック
    uint8 count;
    for (uint256 i = 0; i < _games[gameId].linePlayers.length; i++) {
      if (_games[gameId].linePlayers[i] == msg.sender) {
        count++;
      }
    }
    require(count < 2, "Already drawing 2 positions");

    _games[gameId].linesX.push(xStartPos1);
    _games[gameId].linesY.push(y1);
    _games[gameId].linesX.push(xStartPos2);
    _games[gameId].linesY.push(y2);
    _games[gameId].linePlayers.push(msg.sender);
    _games[gameId].linePlayers.push(msg.sender);

    emit msgEvent(msg.sender, "DONE");
    return true;
  }

  // 勝った人が自分の意思でmintできる
  // result: ゲーム結果を得る
  function result(uint256 _id) public view returns (ResultGame memory) {
    require(_games[_id].startTime + startTimeDuration < block.timestamp, "Game is not ended");
    (uint8[] memory myLinesX, uint8[] memory myLinesY) = _myLines(_id);

    ResultGame memory _game = ResultGame({
      id: _games[_id].id,
      startTime: _games[_id].startTime,
      endTime: _games[_id].endTime,
      atariPosition: _games[_id].atariPosition,
      winner: _calcWinner(_id),
      players: _games[_id].players,
      playerPositions: _games[_id].playerPositions,
      playerNames: _games[_id].playerNames,
      myLinesX: myLinesX,
      myLinesY: myLinesY,
      amidaMap: _lineToMap(_id)
    });
    return _game;
  }

  // BeforeRevealGameのGameを返す
  function game(uint256 _id) public view returns (PublicGame memory) {
    (uint8[] memory myLinesX, uint8[] memory myLinesY) = _myLines(_id);

    PublicGame memory _game = PublicGame({
      id: _games[_id].id,
      startTime: _games[_id].startTime,
      endTime: _games[_id].endTime,
      players: _games[_id].players,
      playerNames: _games[_id].playerNames,
      playerPositions: _games[_id].playerPositions,
      myLinesX: myLinesX,
      myLinesY: myLinesY
    });
    return _game;
  }

  function isHeld() public view returns (bool) {
    uint256 gameId = currentGameId;
    return _games[gameId].startTime + startTimeDuration >= block.timestamp;
  }
}
