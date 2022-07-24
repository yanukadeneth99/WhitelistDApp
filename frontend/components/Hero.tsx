import { NextPage } from "next";

const Hero: NextPage = () => {
  function renderSection() {
    if (false) {
      return <h1 className="text-4xl">The whitelist is over!</h1>;
    } else {
      return (
        <>
          <h1 className="text-4xl">You can still register for whitelist</h1>
          <div className="space-x-6">
            <button className="btn btn-primary">Register</button>
            {false && <button className="btn btn-primary">Withdraw</button>}
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className="w-3/4 h-3/4 p-5 mx-auto pt-12">
        <div className="flex flex-col bg-base-100/80 rounded-2xl justify-center items-center p-12 backdrop-blur-lg shadow space-y-8">
          {renderSection()}
        </div>
      </div>
    </>
  );
};

export default Hero;
