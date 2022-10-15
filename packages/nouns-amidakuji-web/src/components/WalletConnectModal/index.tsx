// import WalletButton from '../WalletButton';
// import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import config, { CHAIN_ID } from '../../config';
import classes from './WalletConnectModal.module.css';

export const Backdrop: React.FC<{ onDismiss: () => void }> = (props) => {
  return <div className={classes.backdrop} onClick={props.onDismiss} />;
};

// const ModalOverlay: React.FC<{
//   title?: React.ReactNode;
//   content?: React.ReactNode;
//   onDismiss: () => void;
// }> = props => {
//   const { title, content, onDismiss } = props;
//   return (
//     <div className={classes.modal}>
//       <button className={classes.closeButton} onClick={onDismiss}>
//         <img src={xIcon} alt="Button to close modal" />
//       </button>
//       <h3>{title}</h3>
//       <div className={classes.content}>{content}</div>
//     </div>
//   );
// };
//
// const Modal: React.FC<{
//   title?: React.ReactNode;
//   content?: React.ReactNode;
//   onDismiss: () => void;
// }> = props => {
//   const { title, content, onDismiss } = props;
//   return (
//     <>
//       {ReactDOM.createPortal(
//         <Backdrop onDismiss={onDismiss} />,
//         document.getElementById('backdrop-root')!,
//       )}
//       {ReactDOM.createPortal(
//         <ModalOverlay title={title} content={content} onDismiss={onDismiss} />,
//         document.getElementById('overlay-root')!,
//       )}
//     </>
//   );
// };

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = (props) => {
  const { onDismiss } = props;
  const { activate } = useEthers();
  const supportedChainIds = [CHAIN_ID];

  // const wallets = (
  //   <div className={classes.walletConnectModal}>
  //     <WalletButton
  //       onClick={() => {
  //         const injected = new InjectedConnector({
  //           supportedChainIds,
  //         });
  //         activate(injected);
  //       }}
  //       walletType={WALLET_TYPE.metamask}
  //     />
  //     <WalletButton
  //       onClick={() => {
  //         const fortmatic = new FortmaticConnector({
  //           apiKey: 'pk_live_60FAF077265B4CBA',
  //           chainId: CHAIN_ID,
  //         });
  //         activate(fortmatic);
  //       }}
  //       walletType={WALLET_TYPE.fortmatic}
  //     />
  //     <WalletButton
  //       onClick={() => {
  //         const walletlink = new WalletConnectConnector({
  //           supportedChainIds,
  //           chainId: CHAIN_ID,
  //           rpc: {
  //             [CHAIN_ID]: config.app.jsonRpcUri,
  //           },
  //         });
  //         activate(walletlink);
  //       }}
  //       walletType={WALLET_TYPE.walletconnect}
  //     />
  //     <WalletButton
  //       onClick={() => {
  //         const walletlink = new WalletLinkConnector({
  //           appName: 'Nouns.WTF',
  //           appLogoUrl: 'https://nouns.wtf/static/media/logo.cdea1650.svg',
  //           url: config.app.jsonRpcUri,
  //           supportedChainIds,
  //         });
  //         activate(walletlink);
  //       }}
  //       walletType={WALLET_TYPE.coinbaseWallet}
  //     />
  //     <WalletButton
  //       onClick={() => {
  //         const injected = new InjectedConnector({
  //           supportedChainIds,
  //         });
  //         activate(injected);
  //       }}
  //       walletType={WALLET_TYPE.brave}
  //     />
  //     <WalletButton
  //       onClick={() => {
  //         const trezor = new TrezorConnector({
  //           chainId: CHAIN_ID,
  //           url: config.app.jsonRpcUri,
  //           manifestAppUrl: 'http://test.com',
  //           manifestEmail: 'test@example.com',
  //         });
  //         activate(trezor);
  //       }}
  //       walletType={WALLET_TYPE.trezor}
  //     />
  //     <div
  //       className={clsx(classes.clickable, classes.walletConnectData)}
  //       onClick={() => localStorage.removeItem('walletconnect')}
  //     >
  //       Clear WalletConnect Data
  //     </div>
  //   </div>
  // );
  return (
    // <Modal
    //   title={'Connect your wallet'}
    //   content={wallets}
    //   onDismiss={onDismiss}
    // />
    <div>TODO</div>
  );
};
export default WalletConnectModal;
