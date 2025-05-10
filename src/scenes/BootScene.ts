import { Scene } from 'phaser';

export class BootScene extends Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Load any assets needed for the loading screen
        this.load.image('loading-background', 'assets/loading-background.png');
    }

    create(): void {
        this.scene.start('PreloadScene');
    }
} 