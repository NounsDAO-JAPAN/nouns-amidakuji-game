import { useMemo } from 'react';
import { Contract, utils } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import AmidakujiSBTAbi from '../abi/AmidakujiSBT.json';
import { Amidakuji, AmidakujiSBT } from '../../gen/types';
import { amidakujiContractAddr, amidakujiSBTContractAddr } from '../config';
import { useCall, useContractFunction, useEthers } from '@usedapp/core';

function useAmidakujiResult(id?: number) {
  const { account, library: provider } = useEthers();

  const amidakujiContract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiAbi.abi);
    return new Contract(
      amidakujiContractAddr,
      Interface,
      provider?.getSigner()
    ) as Amidakuji;
  }, [provider]);

  const amidakujiSBTContract = useMemo(() => {
    const Interface = new utils.Interface(AmidakujiSBTAbi.abi);
    return new Contract(
      amidakujiSBTContractAddr,
      Interface,
      provider?.getSigner()
    ) as AmidakujiSBT;
  }, [provider]);

  const { value: result, error: error1 } =
    useCall(
      account &&
        id && { contract: amidakujiContract, method: 'result', args: [id] }
    ) ?? {};

  const { value: image, error: error2 } =
    useCall(
      account &&
        id && {
          contract: amidakujiSBTContract,
          method: 'tokenImage',
          args: [id],
        }
    ) ?? {};

  const { send: mintItem } = useContractFunction(
    amidakujiSBTContract,
    'mintItem'
  );

  if (error1) {
    console.error(error1.message);
    return {};
  }

  if (error2) {
    console.error(error2.message);
    return {};
  }

  return {
    result: result?.[0] as Amidakuji.ResultGameStructOutput,
    image: image?.[0],
    mintItem,
  };
}

export default useAmidakujiResult;
