import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Connect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            id="connect-button"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={() => {
                      openConnectModal();
                    }}
                  >
                    <b>Connect Wallet</b>
                  </button>
                );
              }
              return (
                <button
                  onClick={() => {
                    openAccountModal();
                  }}
                >
                  <b>{account.address}</b>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
