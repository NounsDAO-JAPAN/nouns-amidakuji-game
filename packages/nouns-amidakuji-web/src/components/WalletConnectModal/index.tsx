import React from 'react';
import WalletButton from './WalletButton';
import { WALLET_TYPE } from './WalletButton';
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import modalClasses from './Modal.module.css';
import classes from './WalletConnectModal.module.css';

export const Backdrop: React.FC<{}> = () => {
  return <div className={modalClasses.backdrop} />;
};

const ModalOverlay: React.FC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
}> = (props) => {
  const { title, content } = props;
  return (
    <div className={modalClasses.modal}>
      <h3>{title}</h3>
      <div className={modalClasses.content}>{content}</div>
    </div>
  );
};

const Modal: React.FC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
}> = (props) => {
  const { title, content } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 100,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Backdrop />
      <ModalOverlay title={title} content={content} />
    </div>
  );
};

const WalletConnectModal: React.FC<{}> = () => {
  const { activate } = useEthers();
  // const supportedChainIds = [31337]; // TODO
  const supportedChainIds = [5]; // TODO

  const wallets = (
    <div className={classes.walletConnectModal}>
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activate(injected);
        }}
        walletType={WALLET_TYPE.metamask}
      />
    </div>
  );
  return <Modal title="Connect your wallet" content={wallets} />;
};
export default WalletConnectModal;
