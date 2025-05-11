import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Game from "./Game";

function App() {
  return (
    <>
      <WalletMultiButton />
      <Game />
    </>
  );
}

export default App;
