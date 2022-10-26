import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

// @ts-expect-error
import { time } from '@openzeppelin/test-helpers';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Amidakuji__factory, Amidakuji } from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

chai.use(chaiAsPromised);

describe('🚩 Challenge 0: Amidakuji', function () {
  this.timeout(180000);

  // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe('Amidakuji', function () {
    let amidaContract: Amidakuji;

    async function setupGame(): Promise<void> {
      try {
        await revealGame();
      } catch (e) {}
      const { user1, user2 } = await getHardhatSigners(hre);
      await amidaContract.connect(user1).entry(1);
      await amidaContract.connect(user2).entry(2);
    }

    async function revealGame(): Promise<void> {
      await time.increase(time.duration.hours(25));
      const gameId = await amidaContract.currentGameId();
      await amidaContract.reveal(gameId);
    }

    before(async () => {
      const { deployer } = await getHardhatSigners(hre);
      const factory = new Amidakuji__factory(deployer);
      amidaContract = await factory.deploy();
    });

    beforeEach(async () => {
      // put stuff you need to run before each test here
    });

    describe('entry()', function () {
      it('Should start a new game if game is not started', async function () {
        const { user1 } = await getHardhatSigners(hre);
        const gameId = await amidaContract.currentGameId();
        expect(gameId.toNumber()).to.be.equal(0);

        await expect(amidaContract.connect(user1).entry(1)).to.be.not.rejected;
        expect(await amidaContract.currentGameId()).to.be.equal(1);
        await revealGame();
      });

      it('Should be able to entry a user to the game', async function () {
        const { user1, user2 } = await getHardhatSigners(hre);
        await expect(amidaContract.connect(user1).entry(1)).to.be.not.rejected;
        await expect(amidaContract.connect(user2).entry(2)).to.be.not.rejected;
        const gameId = await amidaContract.currentGameId();
        const game = await amidaContract.game(gameId);
        expect(game.players.length).to.equal(2);
      });

      it('Should be not able to entry a user to the game if pos is already exist', async function () {
        const { user3 } = await getHardhatSigners(hre);
        await expect(amidaContract.connect(user3).entry(1)).to.be.rejected;
      });

      it('Should be not able to entry a user to the game from duplicate address', async function () {
        const { user1 } = await getHardhatSigners(hre);
        await expect(amidaContract.connect(user1).entry(3)).to.be.rejected;
      });

      it('Should be not able to entry a user to the game if entry time ended', async function () {
        const { user4 } = await getHardhatSigners(hre);
        await time.increase(time.duration.hours(24));
        await expect(amidaContract.connect(user4).entry(4)).to.be.rejected;
      });
    });

    describe('draw()', function () {
      it('Should be not able to draw a line if not drawing time started', async function () {
        const { user1 } = await getHardhatSigners(hre);
        await setupGame();
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.connect(user1).draw(gameId, 1)).to.be.rejected;
      });

      it('Should be able to draw a line', async function () {
        const { user1, user2 } = await getHardhatSigners(hre);
        await time.increase(time.duration.hours(24));
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.connect(user1).draw(gameId, 3)).to.be.not.rejected; // draw line to 3 to 4
        await expect(amidaContract.connect(user2).draw(gameId, 1)).to.be.not.rejected; // draw line to 1 to 2
        await expect(amidaContract.connect(user2).draw(gameId, 1)).to.be.not.rejected; // draw line to 1 to 2
      });

      it('Should be not able to draw a line if not entry', async function () {
        const { user5 } = await getHardhatSigners(hre);
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.connect(user5).draw(gameId, 1)).to.be.rejected;
      });

      it('Should be not able to draw a line if drawing time is ended', async function () {
        const { user5 } = await getHardhatSigners(hre);
        const gameId = await amidaContract.currentGameId();
        await time.increase(time.duration.minutes(11));
        await expect(amidaContract.connect(user5).draw(gameId, 1)).to.be.rejected;
      });
    });

    describe('reveal()', function () {
      it('Should be not able to reveal if not ended reveal time', async function () {
        await setupGame();
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.reveal(gameId)).to.be.rejected;
      });

      // it('Should be not able to reveal if not owner', async function () {
      //   const { user1 } = await getHardhatSigners(hre);
      //   const gameId = await amidaContract.currentGameId();
      //   await time.increase(time.duration.hours(25));
      //   await expect(amidaContract.connect(user1).reveal(gameId)).to.be.rejected;
      // });

      it('Should be not able to reveal by owner', async function () {
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.reveal(gameId)).to.be.not.rejected;
      });
    });

    describe('result()', function () {
      it('Should be not able to get game result if not revealed', async function () {
        await setupGame();
        const gameId = await amidaContract.currentGameId();
        await expect(amidaContract.result(gameId)).to.be.rejected;
      });

      it('Should be able to get game result', async function () {
        await setupGame();
        const { user1 } = await getHardhatSigners(hre);
        const gameId = await amidaContract.currentGameId();
        await time.increase(time.duration.hours(25));
        await amidaContract.reveal(gameId);
        const result = await amidaContract.connect(user1).result(gameId);
        expect(result).to.exist;
      });

      // TODO winnerの計算
    });

    describe('game()', function () {
      it('Should be able to return the game info by id', async function () {
        await setupGame();
        const gameId = await amidaContract.currentGameId();
        expect(await amidaContract.game(gameId)).to.exist;
      });
    });
  });
});
