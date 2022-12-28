import { useEffect, useMemo, useState } from 'react';
import { Contract, utils } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import AmidakujiSBTAbi from '../abi/AmidakujiSBT.json';
import { Amidakuji, AmidakujiSBT } from '../../gen/types';
import { amidakujiContractAddr, amidakujiSBTContractAddr } from '../config';
import { useContractFunction, useEthers } from '@usedapp/core';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';
import { transactionState } from '../state/transactionState';

function useAmidakujiResult(id?: number) {
  const { account, library: provider } = useEthers();
  const signer = useMemo(() => {
    return account ? provider?.getSigner(account) : undefined;
  }, [account, provider]);

  const amidakujiContract = useMemo(() => {
    if (account && signer) {
      const Interface = new utils.Interface(AmidakujiAbi.abi);
      return new Contract(
        amidakujiContractAddr,
        Interface,
        signer
      ) as Amidakuji;
    } else {
      return;
    }
  }, [account, signer]);

  const amidakujiSBTContract = useMemo(() => {
    if (account && signer) {
      const Interface = new utils.Interface(AmidakujiSBTAbi.abi);
      return new Contract(
        amidakujiSBTContractAddr,
        Interface,
        signer
      ) as AmidakujiSBT;
    }
  }, [account, signer]);

  const [result, setResult] = useState<Amidakuji.ResultGameStructOutput>();
  const [resultCheck, setResultCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !resultCheck) {
      setResultCheck(true);
      amidakujiContract?.result(id).then(setResult);
    }
  }, [id, amidakujiContract, signer, resultCheck]);

  const [isHeld, setIsHeld] = useState(false);
  const [isHeldCheck, setIsHeldCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !isHeldCheck) {
      setIsHeldCheck(true);
      amidakujiContract?.isHeld().then(setIsHeld);
    }
  }, [id, amidakujiContract, signer, isHeldCheck]);

  const [currentGameId, setCurrentGameId] = useState<number>();
  const [gameIdCheck, setGameIdCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !gameIdCheck) {
      setGameIdCheck(true);
      amidakujiContract
        ?.currentGameId()
        .then((id) => setCurrentGameId(id.toNumber()));
    }
  }, [id, amidakujiContract, signer, currentGameId, gameIdCheck]);

  const [image, setImage] = useState<string>();
  const [imageCheck, setImageCheck] = useState(false);
  useEffect(() => {
    if (id && signer && !imageCheck) {
      setImageCheck(true);
      amidakujiContract?.game(id).then((game) => {
        const now = dayjs();
        if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0) {
          amidakujiSBTContract?.tokenImage(id).then(setImage);
        }
      });
    }
  }, [id, amidakujiContract, amidakujiSBTContract, signer, imageCheck]);

  const { send: mintItem, state: mintState } = useContractFunction(
    amidakujiSBTContract,
    'mintItem'
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
    if (mintState.status === 'Fail' || mintState.status === 'Exception') {
      if (
        mintState.errorMessage === 'execution reverted: Error: Already minted'
      ) {
        alert('Already minted');
      } else {
        alert('Error');
        location.reload();
      }
    } else if (mintState.status !== 'None') {
      setTransactionState({
        state: mintState.status,
        transaction: mintState.transaction,
      });
    } else if (mintState.status === 'None') {
      setTransactionState({
        state: undefined,
        transaction: undefined,
      });
    }
  }, [mintState, setTransactionState]);

  return {
    result: result && (result as Amidakuji.ResultGameStructOutput),
    image: image,
    mintItem,
    currentGameId,
    isHeld,
  };
}

export default useAmidakujiResult;
