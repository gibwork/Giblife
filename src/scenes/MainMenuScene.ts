import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Title
        const title = this.add.text(width / 2, height / 4, 'GibLife', {
            font: '64px Arial',
            color: '#ffffff'
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, height / 4 + 80, 'Web3 Freelancer Simulator', {
            font: '24px Arial',
            color: '#ffffff'
        });
        subtitle.setOrigin(0.5);

        // Start button
        const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
            font: '32px Arial',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive();

        // Button hover effects
        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#666666' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#444444' });
        });

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
} 