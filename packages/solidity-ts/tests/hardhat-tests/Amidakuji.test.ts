import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { Amidakuji__factory, Amidakuji } from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('🚩 Challenge 0: Amidakuji', function () {
  this.timeout(180000);

  // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe('Amidakuji', function () {
    let amidaContract: Amidakuji;
    let gameId: BigNumber | undefined;

    before(async () => {
      const { deployer } = await getHardhatSigners(hre);
      const factory = new Amidakuji__factory(deployer);
      amidaContract = await factory.deploy();
    });

    beforeEach(async () => {
      // put stuff you need to run before each test here
    });

    describe('setup()', function () {
      it('Should be able to set a new game', async function () {
        gameId = (await amidaContract.setup()).value;
        expect(gameId).to.be.exist; // TODO make exact matcher
      });

      it('Should be able to can call by only owner', async function () {
        const { deployer } = await getHardhatSigners(hre);
        gameId = (await amidaContract.setup()).value;
        expect(amidaContract.deployTransaction.from).to.be.equal(deployer.address);
      });
    });

    describe('game()', function () {
      it('Should be able to return the game info by id', async function () {
        // if 'gameId' can be retrieved
        const gameId = 1; // TODO temporary
        expect(await amidaContract.game(gameId)).to.exist; // TODO make exact matcher
      });
    });

    describe('entry()', function () {
      it('Should be able to entry a user to the game', async function () {
        const result = await amidaContract.entry();
        expect(result).to.exist; // TODO make exact matcher
      });
    });

    describe('draw()', function () {
      it('Should be able to draw a line between kuji', async function () {
        const result = await amidaContract.draw(1, 3); // between 1 and 2 kuji and 3rd pos from top
        expect(result); // TODO make exact matcher
      });
    });

    describe('reveal()', function () {
      it('Should be able to move game data to public', async function () {
        const result = await amidaContract.reveal();
        expect(result); // TODO make exact matcher
      });
      // TODO check only owner can call
    });

    describe('result()', function () {
      it('Should be able to get game result (winner)', async function () {
        const result = await amidaContract.result();
        expect(result).to.exist; // TODO make exact matcher
      });
    });
  });
});
