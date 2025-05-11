import { Scene } from 'phaser';

interface WalletConnectedEvent extends CustomEvent {
    detail: {
        address: string;
    };
}

export class MainMenuScene extends Scene {
    private startButton!: Phaser.GameObjects.Text;
    private walletText!: Phaser.GameObjects.Text;
    private isWalletConnected: boolean = false;

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

        // Wallet address text (initially hidden)
        this.walletText = this.add.text(width / 2, height / 2 - 50, '', {
            font: '16px Arial',
            color: '#ffffff'
        });
        this.walletText.setOrigin(0.5);
        this.walletText.setVisible(false);

        // Start/Connect button
        this.startButton = this.add.text(width / 2, height / 2, 'Connect Wallet', {
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
        this.startButton.setOrigin(0.5);
        this.startButton.setInteractive();

        // Button hover effects
        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ backgroundColor: '#666666' });
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setStyle({ backgroundColor: '#444444' });
        });

        this.startButton.on('pointerdown', () => {
            if (this.isWalletConnected) {
                this.scene.start('Game');
            } else {
                // Trigger wallet connection
                const walletButton = document.querySelector('.wallet-adapter-button');
                if (walletButton) {
                    (walletButton as HTMLElement).click();
                }
            }
        });

        // Listen for wallet connection changes
        window.addEventListener('walletConnected', ((event: WalletConnectedEvent) => {
            this.isWalletConnected = true;
            this.startButton.setText('Start Game');
            
            const walletAddress = event.detail.address;
            // Show shortened wallet address
            const shortAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
            this.walletText.setText(`Connected: ${shortAddress}`);
            this.walletText.setVisible(true);
        }) as EventListener);

        window.addEventListener('walletDisconnected', () => {
            this.isWalletConnected = false;
            this.startButton.setText('Connect Wallet');
            this.walletText.setVisible(false);
        });
    }
} 