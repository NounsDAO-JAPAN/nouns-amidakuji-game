import { useEffect, useMemo, useState } from 'react';
import { BigNumber, BigNumberish, Contract, utils } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import { Amidakuji } from '../../gen/types';
import { amidakujiContractAddr } from '../config';
import { useContractFunction, useEthers } from '@usedapp/core';
import { PromiseOrValue } from '../../gen/types/common';
import { useRecoilState } from 'recoil';
import { transactionState } from '../state/transactionState';

function useCurrentAmidakuji(): {
  game?: Amidakuji.PublicGameStructOutput;
  isHeld: boolean;
  entry?: (
    _name: PromiseOrValue<string>,
    _pos: PromiseOrValue<BigNumberish>
  ) => {};
  draw?: (
    xStartPos1: PromiseOrValue<BigNumberish>,
    y1: PromiseOrValue<BigNumberish>,
    xStartPos2: PromiseOrValue<BigNumberish>,
    y2: PromiseOrValue<BigNumberish>
  ) => {};
} {
  const { library: provider, account } = useEthers();
  const signer = useMemo(() => {
    return account ? provider?.getSigner(account) : undefined;
  }, [account, provider]);
  const [id, setId] = useState<BigNumber>();

  const contract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiAbi.abi);
    if (account) {
      return new Contract(
        amidakujiContractAddr,
        Interface,
        signer
      ) as Amidakuji;
    } else {
      return;
    }
  }, [account, signer]);

  const [idCheck, setIdCheck] = useState(false);
  useEffect(() => {
    if (contract && signer && !idCheck) {
      setIdCheck(true);
      (contract as Amidakuji).currentGameId().then((id) => {
        setId(id);
      });
    }
  }, [contract, idCheck, provider, signer]);

  const [game, setGame] = useState<Amidakuji.PublicGameStructOutput>();
  const [gameCheck, setGameCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !gameCheck) {
      setGameCheck(true);
      contract?.game(id).then(setGame);
    }
  }, [id, contract, signer, gameCheck]);

  const [isHeld, setIsHeld] = useState(false);
  const [isHeldCheck, setIsHeldCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !isHeldCheck) {
      setIsHeldCheck(true);
      contract?.isHeld().then(setIsHeld);
    }
  }, [id, contract, signer, isHeldCheck]);

  const { send: entry, state: entryState } = useContractFunction(
    contract,
    'entry'
  );
  const { send: draw, state: drawState } = useContractFunction(
    contract,
    'draw'
  );

  const [tState, setTransactionState] = useRecoilState(transactionState);
  useEffect(() => {
    if (tState.state === 'Success') {
      setTimeout(() => {
        location.reload();
      }, 10000);
    }
  }, [tState.state]);
  useEffect(() => {
    if (
      drawState.status === 'Fail' ||
      entryState.status === 'Fail' ||
      entryState.status === 'Exception' ||
      drawState.status === 'Exception'
    ) {
      alert('Error');
      location.reload();
    } else if (drawState.status !== 'None') {
      setTransactionState({
        state: drawState.status,
        transaction: drawState.transaction,
      });
    } else if (entryState.status !== 'None') {
      setTransactionState({
        state: entryState.status,
        transaction: entryState.transaction,
      });
    } else if (drawState.status === 'None' && entryState.status === 'None') {
      setTransactionState({
        state: undefined,
        transaction: undefined,
      });
    }
  }, [entryState, drawState, setTransactionState]);

  return {
    game: game && (game as Amidakuji.PublicGameStructOutput),
    entry,
    draw,
    isHeld,
  };
}

export default useCurrentAmidakuji;
