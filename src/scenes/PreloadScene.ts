import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(): void {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading progress events
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load game assets
        this.loadAssets();
    }

    private loadAssets(): void {
        // Load room assets
        this.load.image('room-background', 'assets/room-background.png');
        this.load.image('character', 'assets/character.png');

        // Load UI assets
        this.load.image('task-board', 'assets/task-board.png');
        this.load.image('store-button', 'assets/store-button.png');
        this.load.image('skills-button', 'assets/skills-button.png');
    }

    create(): void {
        this.scene.start('MainMenuScene');
    }
} 