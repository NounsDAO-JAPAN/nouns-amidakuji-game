import { useEffect, useMemo, useState } from 'react';
import { Contract, utils, providers } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import AmidakujiSBTAbi from '../abi/AmidakujiSBT.json';
import { Amidakuji, AmidakujiSBT } from '../../gen/types';
import { amidakujiContractAddr, amidakujiSBTContractAddr } from '../config';
import { useContractFunction, useEthers } from '@usedapp/core';
import dayjs from 'dayjs';

function useAmidakujiResult(id?: number) {
  const { account, library: provider } = useEthers();

  const amidakujiContract = useMemo(() => {
    if (account) {
      const Interface = new utils.Interface(AmidakujiAbi.abi);
      return new Contract(
        amidakujiContractAddr,
        Interface,
        provider?.getSigner(account)
      ) as Amidakuji;
    } else {
      return;
    }
  }, [account, provider]);

  const amidakujiSBTContract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiSBTAbi.abi);
    return new Contract(
      amidakujiSBTContractAddr,
      Interface,
      provider?.getSigner()
    ) as AmidakujiSBT;
  }, [provider]);

  const [result, setResult] = useState<Amidakuji.ResultGameStructOutput>();
  useEffect(() => {
    if (id) {
      amidakujiContract?.game(id).then((game) => {
        const now = dayjs();
        if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0) {
          amidakujiContract?.result(id).then(setResult);
        }
      });
    }
  }, [id, amidakujiContract]);

  const [currentGameId, setCurrentGameId] = useState<number>();
  useEffect(() => {
    if (id) {
      amidakujiContract
        ?.currentGameId()
        .then((id) => setCurrentGameId(id.toNumber()));
    }
  }, [id, amidakujiContract]);

  const [image, setImage] = useState<string>();
  useEffect(() => {
    if (id) {
      amidakujiContract?.game(id).then((game) => {
        const now = dayjs();
        if (dayjs.unix(game.endTime.toNumber()).diff(now, 'seconds') < 0) {
          amidakujiSBTContract?.tokenImage(id).then(setImage);
        }
      });
    }
  }, [id, amidakujiContract, amidakujiSBTContract]);

  const { send: mintItem, state: mintState } = useContractFunction(
    amidakujiSBTContract,
    'mintItem'
  );

  return {
    result: result && (result as Amidakuji.ResultGameStructOutput),
    image: image,
    mintItem,
    mintState,
    currentGameId,
  };
}

export default useAmidakujiResult;
