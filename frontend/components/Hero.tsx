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
          <h1 className="text-4xl text-center">
            You&apos;ve got to connect your wallet!
          </h1>
        </>
      );
    } else if (remainingWL === 0) {
      return (
        <>
          <h1 className="text-4xl lg:text-5xl text-center">
            Whitelist sale is over!
          </h1>
          <p className="text-xs md:text-base text-center">
            Account address : {walletAddress}
          </p>
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
          <h1 className="text-4xl text-center">You have already registered!</h1>
          <p className="text-xs md:text-base text-center">
            Account address : {walletAddress}
          </p>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-3xl text-center">
            You can still register for whitelist
          </h1>
          <p className="text-xs md:text-base text-center">
            Account address : {walletAddress}
          </p>
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
      <div className="md:w-3/4 h-auto w-full p-5 mx-auto md:pt-20 lg:pt-40">
        <div className="flex flex-col bg-base-100/80 rounded-2xl justify-center items-center p-5 md:p-12 backdrop-blur-lg shadow-md border-2 border-primary/30 space-y-8">
          {renderSection()}
        </div>
      </div>
    </>
  );
};

export default Hero;
