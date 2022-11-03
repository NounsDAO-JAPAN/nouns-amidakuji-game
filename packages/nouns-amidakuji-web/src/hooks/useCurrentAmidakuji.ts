import { useEffect, useMemo, useState } from 'react';
import { BigNumber, Contract, utils } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import { Amidakuji } from '../../gen/types';
import { amidakujiContractAddr } from '../config';
import { useCall, useContractFunction, useEthers } from '@usedapp/core';

function useCurrentAmidakuji() {
  const { account, library: provider } = useEthers();
  const [id, setId] = useState<BigNumber>();

  const contract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiAbi.abi);
    return new Contract(
      amidakujiContractAddr,
      Interface,
      provider?.getSigner()
    ) as Amidakuji;
  }, [provider]);

  useEffect(() => {
    (contract as Amidakuji).currentGameId().then((id) => {
      setId(id);
    });
  }, [contract]);

  const { value, error } =
    useCall(
      account && id?.toNumber() && { contract, method: 'game', args: [id] }
    ) ?? {};
  const { send: entry } = useContractFunction(contract, 'entry');
  const { send: draw } = useContractFunction(contract, 'draw');

  if (error) {
    console.error(error.message);
    return {};
  }

  return { game: value?.[0] as Amidakuji.PublicGameStructOutput, entry, draw };
}

export default useCurrentAmidakuji;
