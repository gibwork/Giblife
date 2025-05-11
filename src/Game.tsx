import { useEffect } from "react";
import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { Game as GameScene } from "./scenes/Game";
import { useWallet } from "@solana/wallet-adapter-react";

const Game = () => {
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey) {
      // Dispatch wallet disconnected event
      window.dispatchEvent(new Event("walletDisconnected"));
      return;
    }

    console.log(publicKey.toBase58());
    // Dispatch wallet connected event with the address
    const event = new CustomEvent("walletConnected", {
      detail: { address: publicKey.toBase58() },
    });
    window.dispatchEvent(event);
  }, [publicKey]);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: "game-container",
      backgroundColor: "#000000",
      scene: [BootScene, PreloadScene, MainMenuScene, GameScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div></div>;
};

export default Game;
