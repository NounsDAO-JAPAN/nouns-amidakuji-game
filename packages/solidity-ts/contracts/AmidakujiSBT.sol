pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

struct ResultGame {
  uint256 id;
  uint256 startTime;
  uint8 atariPosition;
  address winner;
  address[] players;
  uint8[] playerPositions;
  string[] playerNames;
  uint8[] myLinesX;
  uint8[] myLinesY;
  bool[12][] amidaMap;
}

interface AmidakujiInterface {
  function result(uint256 _id) external view returns (ResultGame memory);
}

contract AmidakujiSBT is ERC721, ERC721Enumerable, Ownable {
  AmidakujiInterface amidakujiContract;

  constructor() ERC721("AmidakujiSBT", "AMIDA") {}

  function setAmidakujiContractAddress(address _address) external onlyOwner {
    amidakujiContract = AmidakujiInterface(_address);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    require(from == address(0), "Error: TOKEN is SOUL BOUND");
    return super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721) {
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mintItem(uint32 _gameId) public returns (uint32) {
    ResultGame memory game = amidakujiContract.result(_gameId);
    require(game.winner == msg.sender, "Error: Sender is not winner");
    require(_exists(_gameId) == false, "Error: Already minted");

    _safeMint(msg.sender, _gameId);
    return _gameId;
  }

  string constant SVGHeader = '<svg viewBox="0 0 700 700"  xmlns="http://www.w3.org/2000/svg">';
  string constant SVGFooter = "</svg>";

  function _nameSVG(uint256 _x, string memory name) internal pure returns (string memory) {
    return string(abi.encodePacked('<text x="', Strings.toString(_x), '" y="40" font-size="32">', name, "</text>"));
  }

  function _atariSVG(uint256 _x) internal pure returns (string memory) {
    return string(abi.encodePacked('<text x="', Strings.toString(_x), '" y="680" font-size="32">W</text>'));
  }

  function _yLineSVG(uint256 _x) internal pure returns (string memory) {
    return
      string(abi.encodePacked('<line x1="', Strings.toString(_x), '" y1="50" x2="', Strings.toString(_x), '" y2="650" stroke="#00FFFF" stroke-width="16"/>'));
  }

  function _xLineSVG(uint256 _x, uint256 _y) internal pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          '<line x1="',
          Strings.toString(_x),
          '" y1="',
          Strings.toString(_y),
          '" x2="',
          Strings.toString(_x + 100),
          '" y2="',
          Strings.toString(_y),
          '" stroke="#FF0000" stroke-width="16"/>'
        )
      );
  }

  function _generateSVG(uint256 _gameId) internal view returns (string memory) {
    ResultGame memory game = amidakujiContract.result(_gameId);

    string memory baseSVG = string(abi.encodePacked(SVGHeader, _yLineSVG(100), _yLineSVG(200), _yLineSVG(300), _yLineSVG(400), _yLineSVG(500), _yLineSVG(600)));

    // TODO optimize
    // player name
    for (uint256 i = 0; i < game.playerPositions.length; i++) {
      baseSVG = string(abi.encodePacked(baseSVG, _nameSVG(uint256(game.playerPositions[i]) * 100 - 30, game.playerNames[i])));
    }

    // TODO optimize
    // line x
    for (uint256 i = 0; i < 6; i++) {
      for (uint256 j = 0; j < 12; j++) {
        if (game.amidaMap[i][j] == true) {
          baseSVG = string(abi.encodePacked(baseSVG, _xLineSVG(i * 100 + 100, j * 50 + 50)));
        }
      }
    }

    return string(abi.encodePacked(baseSVG, _atariSVG(uint256(game.atariPosition) * 100 - 15), SVGFooter));
  }

  function tokenImage(uint256 _gameId) public view returns (string memory) {
    bytes memory image = bytes(_generateSVG(_gameId));
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(image)));
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_exists(_tokenId), "tokenURI is not exist");
    bytes memory image = bytes(_generateSVG(_tokenId));

    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                "Amidakuji",
                " #",
                Strings.toString(_tokenId),
                '","description":"',
                "this token is SBT of Nouns Amidakuji",
                '","attributes":[],"image":"data:image/svg+xml;base64,',
                Base64.encode(image),
                '"}'
              )
            )
          )
        )
      );
  }
}
