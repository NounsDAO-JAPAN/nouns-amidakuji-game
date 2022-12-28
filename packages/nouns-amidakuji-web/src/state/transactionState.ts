import { atom } from 'recoil';
import { TransactionState } from '@usedapp/core/src/model/TransactionStatus';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export const transactionState = atom<{
  state?: TransactionState;
  transaction?: TransactionResponse;
}>({
  key: 'transactionState',
  default: { state: undefined, transaction: undefined },
});
