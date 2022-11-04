import { useEffect, useMemo, useState } from 'react';
import { BigNumber, BigNumberish, Contract, utils } from 'ethers';
import AmidakujiAbi from '../abi/Amidakuji.json';
import { Amidakuji } from '../../gen/types';
import { amidakujiContractAddr } from '../config';
import {
  TransactionStatus,
  useCall,
  useContractFunction,
  useEthers,
} from '@usedapp/core';
import { PromiseOrValue } from '../../gen/types/common';

function useCurrentAmidakuji(): {
  game?: Amidakuji.PublicGameStructOutput;
  entry?: (
    _name: PromiseOrValue<string>,
    _pos: PromiseOrValue<BigNumberish>
  ) => {};
  draw?: (
    xStartPos: PromiseOrValue<BigNumberish>,
    y: PromiseOrValue<BigNumberish>
  ) => {};
  drawState?: TransactionStatus;
  entryState?: TransactionStatus;
} {
  const { library: provider, account } = useEthers();
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

  const [game, setGame] = useState<Amidakuji.PublicGameStructOutput>();
  useEffect(() => {
    if (id) {
      contract.game(id).then(setGame);
    }
  }, [id, contract]);

  const { send: entry, state: entryState } = useContractFunction(
    contract,
    'entry'
  );
  const { send: draw, state: drawState } = useContractFunction(
    contract,
    'draw'
  );

  useEffect(() => {
    const filter = contract.filters.msgEvent(account, null);
    const func = (address: any, msg: any) => {
      console.log(address, msg);
    };
    contract.on(filter, func);

    return () => {
      contract.off(filter, func);
    };
  }, [account, contract]);

  return {
    game: game && (game as Amidakuji.PublicGameStructOutput),
    entry,
    draw,
    entryState,
    drawState,
  };
}

export default useCurrentAmidakuji;
