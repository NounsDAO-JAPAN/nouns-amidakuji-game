# Nouns Amidakuji

## プロジェクト概要（提出内容）
■概要：毎日1回だけ開催される、フルオンチェーンあみだくじゲーム

■ Originality
資本によるガバナンスモデルの脱却
Nouns DAOモデルを改造し、資本家がよりNFT（ガバナンス権）を購入しやすいモデルから、ゲーム好きがゲームをプレイするという”活動”を通じてよりSBT（ガバナンス権）を獲得しやすいモデルを実現。

■ Technicality
①”フル”オンチェーンゲーム：当該プロジェクトは、NFTだけでなくゲームロジックもブロックチェーン上に実装し、日本では珍しい”フル”オンチェーンゲームとしている点（多くのプロジェクトがNFTやNRC20の部分だけをオンチェーン化）
②オンチェーンSVG SBT：ゲームの過程で生成されたあみだくじをアートとしてオンチェーンでSVGを生成し、WinnerがそのSVGに基づくSBTをMINTできるようにしている点
③オープンソース：フルオンチェーンゲームとして、オープンソース化することで、クライアントサイドは自由にだれでも実装が可能な点。また、誰でもフォークして、毎日1回だけ開催される、フルオンチェーン◯◯ゲームを作ることが可能。

■ Practicality
テストネットで必要機能はすべて実装済み。ハッカソン後にテストネットで運用後、フィードバックに基づき微調整をしてメインネットで公開予定。オープンソース化。

■ Usability (UI/UX/DX)
シンプルかつ、Nouns DAOのUI/UXを参考にすることで、無駄がないが繊細でわかりやすいUI/UXとしている。

■ WOW factor
自立分散型で運営され、未来永劫止まることのないフルオンチェーンゲーム

## Tech Stack

### Common

- Solidity
- TypeScript

### App

- Electron
- hardhat

### UI

- Next.js
   - React
- Bootstrap

### others

- ethers

## Blockchain

- Goerli (Ethereum Testnet)

## URL
https://nouns-amidakuji-game.vercel.app/

## Contracts

### Etherscan

- https://goerli.etherscan.io/token/0xceda107cd2766833c29e7fb8d861f2fb511251df

### OpenSea

- https://testnets.opensea.io/ja/collection/amidakujisbt-fgo7pbqqtp

## How to use

1. nouns-amidakuji-gameをClone
2. `yarn install` && `yarn create-config`
3. `yarn chain` でローカル上にhardhatを起動
4. 別ターミナルで `cd packages/nouns-amidakuji-web` （デフォルトではtestnetに繋がっている）
5. `yarn:typechain:generate` && `yarn dev` でWeb Frontが起動、http://localhost:3000 にアクセス
6. Contractは `packages/solidity-ts/contracts/` の `Amidakuji.sol` と `AmidakujiSBT.sol`
