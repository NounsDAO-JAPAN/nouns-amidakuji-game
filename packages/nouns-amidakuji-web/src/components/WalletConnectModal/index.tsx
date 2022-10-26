import WalletButton from './WalletButton';
import { WALLET_TYPE } from './WalletButton';
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import modalClasses from './Modal.module.css';
import classes from './WalletConnectModal.module.css';

export const Backdrop: React.FC<{ onDismiss: () => void }> = (props) => {
  return <div className={modalClasses.backdrop} onClick={props.onDismiss} />;
};

const ModalOverlay: React.FC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}> = (props) => {
  const { title, content, onDismiss } = props;
  return (
    <div className={modalClasses.modal}>
      <button className={modalClasses.closeButton} onClick={onDismiss}>
        <img src="/x-icon.png" alt="Button to close modal" />
      </button>
      <h3>{title}</h3>
      <div className={modalClasses.content}>{content}</div>
    </div>
  );
};

const Modal: React.FC<{
  title?: React.ReactNode;
  content?: React.ReactNode;
  onDismiss: () => void;
}> = (props) => {
  const { title, content, onDismiss } = props;
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
      <Backdrop onDismiss={onDismiss} />
      <ModalOverlay title={title} content={content} onDismiss={onDismiss} />
    </div>
  );
};

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = (props) => {
  const { onDismiss } = props;
  const { activate } = useEthers();
  const supportedChainIds = [31337];

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
  return (
    <Modal
      title="Connect your wallet"
      content={wallets}
      onDismiss={onDismiss}
    />
  );
};
export default WalletConnectModal;
