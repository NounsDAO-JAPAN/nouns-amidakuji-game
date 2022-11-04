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
  string constant _yLineSVG =
    '<path d="M110 50h5v600h-5zM205 50h5v600h-5zM300 50h5v600h-5zM395 50h5v600h-5zM490 50h5v600h-5zM585 50h5v600h-5z" style="fill:#f3322c"/>';

  function _nameSVG(uint256 _x, string memory name) internal pure returns (string memory) {
    return string(abi.encodePacked('<text x="', Strings.toString(_x - 15), '" y="40" font-size="32">', name, "</text>"));
  }

  function _atariSVG(uint256 _x) internal pure returns (string memory) {
    return string(abi.encodePacked('<text x="', Strings.toString(_x), '" y="680" font-size="32">W</text>'));
  }

  function _xLineSVG(uint256 _x, uint256 _y) internal pure returns (string memory) {
    string memory svg = string(
      abi.encodePacked(
        '<path d="M',
        Strings.toString(_x + 210),
        ".01 ",
        Strings.toString(_y + 81),
        ".29v6.25h-37.44V",
        Strings.toString(_y + 68),
        ".77h-6.25v18.77h-37.55V",
        Strings.toString(_y + 68),
        ".77H",
        Strings.toString(_x + 110)
      )
    );

    svg = string(
      abi.encodePacked(
        svg,
        "v-6.25h18.77V",
        Strings.toString(_y + 49),
        ".99h37.55v12.53h6.25V",
        Strings.toString(_y + 49),
        ".99h37.44V",
        Strings.toString(_y + 49),
        '.99z" style="fill:#f3322c"/>'
      )
    );

    svg = string(
      abi.encodePacked(
        svg,
        '<path d="M',
        Strings.toString(_x + 203),
        ".85 ",
        Strings.toString(_y + 75),
        ".03v6.26h-12.51V",
        Strings.toString(_y + 56),
        '.26h12.51v18.77z"/>'
      )
    );

    svg = string(
      abi.encodePacked(
        svg,
        '<path d="M',
        Strings.toString(_x + 191),
        ".34 ",
        Strings.toString(_y + 75),
        ".03v6.26h-12.51V",
        Strings.toString(_y + 56),
        '.26h12.51v18.77z" style="fill:#fff"/>'
      )
    );

    svg = string(
      abi.encodePacked(
        svg,
        '<path d="M',
        Strings.toString(_x + 160),
        ".06 ",
        Strings.toString(_y + 75),
        ".03v6.26h-12.52V",
        Strings.toString(_y + 56),
        '.26h12.52v18.77z"/>'
      )
    );

    svg = string(
      abi.encodePacked(
        svg,
        '<path d="M',
        Strings.toString(_x + 147),
        ".54 ",
        Strings.toString(_y + 75),
        ".03v6.26h-12.51V",
        Strings.toString(_y + 56),
        '.26h12.51v18.77z" style="fill:#fff"/>'
      )
    );

    return svg;
  }

  function _generateSVG(uint256 _gameId) internal view returns (string memory) {
    ResultGame memory game = amidakujiContract.result(_gameId);

    string memory baseSVG = string(abi.encodePacked(SVGHeader, _yLineSVG));

    // TODO optimize
    // player name
    for (uint256 i = 0; i < game.playerPositions.length; i++) {
      baseSVG = string(abi.encodePacked(baseSVG, _nameSVG(uint256(game.playerPositions[i]) * 95, game.playerNames[i])));
    }

    // TODO optimize
    // line x
    for (uint256 i = 0; i < 6; i++) {
      for (uint256 j = 0; j < 12; j++) {
        if (game.amidaMap[i][j] == true) {
          baseSVG = string(abi.encodePacked(baseSVG, _xLineSVG(i * 95, j * 50)));
        }
      }
    }

    return string(abi.encodePacked(baseSVG, _atariSVG(uint256(game.atariPosition) * 95), SVGFooter));
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
