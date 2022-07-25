import { NextPage } from "next";

const Hero: NextPage<any> = ({
  register,
  remainingWL,
  walletConnected,
  becomeWhitelist,
  loading,
  walletAddress,
}) => {
  // Renders the section
  function renderSection() {
    if (!walletConnected) {
      return (
        <>
          <h1 className="text-4xl">You&apos;ve got to connect your wallet!</h1>
        </>
      );
    } else if (remainingWL === 0) {
      return (
        <>
          <h1 className="text-4xl">Whitelist sale is over!</h1>
          <p>Account address : {walletAddress}</p>
          <p>
            {remainingWL} whitelist spot{remainingWL !== 1 && "s"} remaining
          </p>
          <div className="space-x-6">
            <button disabled className="btn btn-primary">
              Register
            </button>
          </div>
        </>
      );
    } else if (register) {
      return (
        <>
          <h1 className="text-4xl">You have already registered!</h1>
          <p>Account address : {walletAddress}</p>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-4xl">You can still register for whitelist</h1>
          <p>Account address : {walletAddress}</p>
          <p>
            {remainingWL} whitelist spot{remainingWL !== 1 && "s"} remaining
          </p>
          <div className="space-x-6">
            {loading ? (
              <button className="btn loading">Loading</button>
            ) : (
              <button
                onClick={becomeWhitelist}
                disabled={remainingWL === 0}
                className="btn btn-primary"
              >
                Register
              </button>
            )}
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className="w-3/4 h-auto p-5 mx-auto pt-40">
        <div className="flex flex-col bg-base-100/80 rounded-2xl justify-center items-center p-12 backdrop-blur-lg shadow space-y-8">
          {renderSection()}
        </div>
      </div>
    </>
  );
};

export default Hero;
