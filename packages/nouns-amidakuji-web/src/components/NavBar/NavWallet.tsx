import { ChainId, useEthers } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import classes from './NavWallet.module.css';
import { Dropdown } from 'react-bootstrap';
import WalletConnectModal from '../WalletConnectModal';
import clsx from 'clsx';
import navDropdownClasses from './NavBarDropdown.module.css';

export const useShortAddress = (address: string) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

interface NavWalletProps {
  address: string;
}

type Props = {
  onClick: (e: any) => void;
  value: string;
};

type RefType = number;

type CustomMenuProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  labeledBy?: string;
};

const NavWallet: React.FC<NavWalletProps> = (props) => {
  const { address } = props;

  const { account, deactivate, activateBrowserWallet, switchNetwork, chainId } =
    useEthers();
  const [check, setChecked] = useState(false);
  const [buttonUp, setButtonUp] = useState(false);
  const shortAddress = useShortAddress(address);

  useEffect(() => {
    activateBrowserWallet();
    setTimeout(() => {
      setChecked(true);
    }, 1000);
  }, [activateBrowserWallet]);

  useEffect(() => {
    if (check) {
      if (chainId !== ChainId.Polygon) {
        switchNetwork(ChainId.Polygon).then(() => {
          location.reload();
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [check, switchNetwork]);

  const disconectWalletHandler = () => {
    setButtonUp(false);
    deactivate();
  };

  const customDropdownToggle = React.forwardRef<RefType, Props>(
    function customDropdownToggle({ onClick, value }, ref) {
      return (
        <>
          <div
            className={clsx(
              navDropdownClasses.wrapper,
              buttonUp
                ? navDropdownClasses.whiteInfoSelected
                : navDropdownClasses.whiteInfo
            )}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
          >
            <div className={navDropdownClasses.button}>
              <div className={navDropdownClasses.dropdownBtnContent}>
                {shortAddress}
              </div>
            </div>
          </div>
        </>
      );
    }
  );

  const CustomMenu = React.forwardRef(function CustomMenu(
    props: CustomMenuProps,
    ref: React.Ref<HTMLDivElement>
  ) {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props.labeledBy}
      >
        <div>
          <div
            onClick={disconectWalletHandler}
            className={clsx(
              classes.dropDownBottom,
              navDropdownClasses.button,
              navDropdownClasses.whiteInfoSelectedBottom,
              classes.disconnectText
            )}
          >
            Disconnect
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {account === undefined ? (
        check ? (
          <WalletConnectModal />
        ) : (
          <></>
        )
      ) : (
        <Dropdown
          className={clsx(navDropdownClasses.nounsNavLink)}
          show={buttonUp}
          onToggle={() => setButtonUp(!buttonUp)}
        >
          <Dropdown.Toggle
            as={customDropdownToggle}
            id="dropdown-custom-components"
          />
          <Dropdown.Menu
            className={`${navDropdownClasses.desktopDropdown} `}
            as={CustomMenu}
          />
        </Dropdown>
      )}
    </>
  );
};

export default NavWallet;
