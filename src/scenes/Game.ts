import { Scene } from 'phaser';

interface PlayerStats {
    work: number;
    food: number;
    energy: number;
    skills: {
        development: number;
        design: number;
        marketing: number;
    };
}

interface Task {
    title: string;
    reward: number;
    requiredSkill?: string;
    requiredLevel?: number;
}

interface ActiveTask {
    title: string;
    reward: number;
    progress: number;
    progressBar: Phaser.GameObjects.Graphics;
    progressText: Phaser.GameObjects.Text;
}

export class Game extends Scene {
    private playerStats: PlayerStats;
    private taskBoard!: Phaser.GameObjects.Container;
    private statsText!: Phaser.GameObjects.Text;
    private tasks: Task[] = [];
    private activeTasks: ActiveTask[] = [];
    private taskTimers: Phaser.Time.TimerEvent[] = [];
    private nextTaskBar!: Phaser.GameObjects.Graphics;
    private nextTaskText!: Phaser.GameObjects.Text;
    private nextTaskTime: number = 0;
    private nextTaskTotal: number = 0;
    private isGeneratingTask: boolean = false;

    private readonly POSSIBLE_TASKS: Task[] = [
        { title: 'Fix CSS Bug', reward: 50, requiredSkill: 'development', requiredLevel: 1 },
        { title: 'Design Logo', reward: 100, requiredSkill: 'design', requiredLevel: 1 },
        { title: 'Write Blog Post', reward: 75, requiredSkill: 'marketing', requiredLevel: 1 },
        { title: 'Debug Smart Contract', reward: 150, requiredSkill: 'development', requiredLevel: 2 },
        { title: 'Create UI Mockup', reward: 120, requiredSkill: 'design', requiredLevel: 2 },
        { title: 'Social Media Campaign', reward: 90, requiredSkill: 'marketing', requiredLevel: 2 },
        { title: 'Build DApp Frontend', reward: 200, requiredSkill: 'development', requiredLevel: 3 },
        { title: 'Design NFT Collection', reward: 180, requiredSkill: 'design', requiredLevel: 3 },
        { title: 'Community Management', reward: 150, requiredSkill: 'marketing', requiredLevel: 3 }
    ];

    constructor() {
        super({ key: 'Game' });
        this.playerStats = {
            work: 0,
            food: 100,
            energy: 100,
            skills: {
                development: 0,
                design: 0,
                marketing: 0
            }
        };
    }

    create(): void {
        // Add room background
        const background = this.add.image(0, 0, 'room-background');
        background.setOrigin(0);
        
        // Calculate scale to fit within the game area while maintaining aspect ratio
        const scaleX = this.cameras.main.width / background.width;
        const scaleY = this.cameras.main.height / background.height;
        const scale = Math.min(scaleX, scaleY);
        background.setScale(scale);

        // Center the background
        background.setPosition(
            (this.cameras.main.width - background.displayWidth) / 2,
            (this.cameras.main.height - background.displayHeight) / 2
        );

        // Add character at the center
        const character = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'character'
        );
        character.setOrigin(0.5);
        character.setScale(0.25);

        // Create task board
        this.createTaskBoard();

        // Create stats display
        this.createStatsDisplay();

        // Create UI buttons
        this.createUIButtons();

        // Create next task loading bar
        this.createNextTaskBar();

        // Start task generation
        this.startTaskGeneration();
    }

    private createNextTaskBar(): void {
        // Create loading bar background
       this.add.rectangle(1000, 50, 200, 20, 0x222222)
            .setOrigin(0, 0.5);
        
        // Create loading bar
        this.nextTaskBar = this.add.graphics();
        
        // Create text
        this.nextTaskText = this.add.text(1000, 30, 'Next task in: 0s', {
            font: '14px Arial',
            color: '#ffffff'
        });
    }

    private updateNextTaskBar(): void {
        if (this.nextTaskTime <= 0) return;

        const progress = 1 - (this.nextTaskTime / this.nextTaskTotal);
        
        // Update bar
        this.nextTaskBar.clear();
        this.nextTaskBar.fillStyle(0x00ff00, 1);
        this.nextTaskBar.fillRect(1000, 40, 200 * progress, 20);

        // Update text
        this.nextTaskText.setText(`Next task in: ${Math.ceil(this.nextTaskTime / 1000)}s`);
    }

    private createTaskBoard(): void {
        this.taskBoard = this.add.container(1000, 100);
        
        // Add title
        const titleText = this.add.text(0, 0, 'Available Tasks:', {
            font: '16px Arial',
            color: '#ffffff'
        });
        this.taskBoard.add(titleText);
    }

    private startTaskGeneration(): void {
        // Generate a new task every 5 seconds
        const generateTask = () => {
            if (this.tasks.length < 4 && !this.isGeneratingTask) { // Maximum 4 tasks at a time
                this.isGeneratingTask = true;
                this.addRandomTask();
                this.isGeneratingTask = false;
            }
            // Schedule next task generation
            this.nextTaskTotal = 5000; // Fixed 5 second interval
            this.nextTaskTime = this.nextTaskTotal;
            this.taskTimers.push(this.time.delayedCall(this.nextTaskTotal, generateTask));
        };

        // Start the first task generation immediately
        this.nextTaskTotal = 5000; // Start with 5 second interval
        this.nextTaskTime = this.nextTaskTotal;
        this.time.delayedCall(this.nextTaskTotal, generateTask);
    }

    private addRandomTask(): void {
        // Only add a new task if we have less than 4 tasks
        if (this.tasks.length >= 4) {
            return;
        }

        // Pick a random task from available ones
        const randomTask = this.POSSIBLE_TASKS[Phaser.Math.Between(0, this.POSSIBLE_TASKS.length - 1)];
        console.log(randomTask);
        this.tasks.push(randomTask);
        
        // Update the task board immediately after adding a new task
        this.updateTaskBoard();
    }

    private updateTaskBoard(): void {
        // Remove only text elements from the task board
        this.taskBoard.each((child: Phaser.GameObjects.GameObject) => {
            if (child instanceof Phaser.GameObjects.Text) {
                this.taskBoard.remove(child);
                child.destroy();
            }
        });
        
        // Add title
        const titleText = this.add.text(0, 0, 'Available Tasks:', {
            font: '16px Arial',
            color: '#ffffff'
        });
        this.taskBoard.add(titleText);
        
        if (!this.tasks.length) {
            // Add "No tasks available" text
            const noTasksText = this.add.text(0, 30, 'No tasks available', {
                font: '16px Arial',
                color: '#ffffff'
            });
            this.taskBoard.add(noTasksText);
        } else {
            // Add each task
            this.tasks.forEach((task, index) => {
                const taskY = 30 + index * 60;
                const taskText = this.add.text(0, taskY, `${task.title}\nReward: ${task.reward} Work`, {
                    font: '16px Arial',
                    color: '#ffffff'
                });
                this.taskBoard.add(taskText);

                // Make task clickable
                const taskArea = this.add.rectangle(0, taskY, 200, 50, 0x000000, 0.5)
                    .setOrigin(0)
                    .setInteractive();
                this.taskBoard.add(taskArea);

                taskArea.on('pointerdown', () => {
                    this.startTask(task.title, task.reward);
                });
            });
        }
    }

    private createStatsDisplay(): void {
        this.statsText = this.add.text(20, 20, '', {
            font: '16px Arial',
            color: '#ffffff'
        });
        this.updateStatsDisplay();
    }

    private updateStatsDisplay(): void {
        this.statsText.setText(
            `Work: ${this.playerStats.work}\n` +
            `Food: ${this.playerStats.food}\n` +
            `Energy: ${this.playerStats.energy}\n` +
            `Skills:\n` +
            `  Dev: ${this.playerStats.skills.development}\n` +
            `  Design: ${this.playerStats.skills.design}\n` +
            `  Marketing: ${this.playerStats.skills.marketing}`
        );
    }

    private createUIButtons(): void {
        // Store button
        this.add.image(100, 600, 'store-button')
            .setInteractive()
            .setScale(0.15)
            .on('pointerdown', () => {
                // TODO: Implement store
                console.log('Store clicked');
            });

        // Skills button
        this.add.image(250, 600, 'skills-button')
            .setInteractive()
            .setScale(0.15)
            .on('pointerdown', () => {
                // TODO: Implement skills menu
                console.log('Skills clicked');
            });
    }

    private startTask(title: string, reward: number): void {
        if (this.playerStats.energy < 20) {
            // Show "not enough energy" message
            return;
        }

        // Deduct energy
        this.playerStats.energy -= 20;
        
        // Remove the task from available tasks
        this.tasks = this.tasks.filter(t => t.title !== title);
        this.updateTaskBoard();

        // Create progress bar for the active task
        const progressBar = this.add.graphics();
        const progressText = this.add.text(20, 400 + (this.activeTasks.length * 60), `${title}`, {
            font: '14px Arial',
            color: '#ffffff'
        });

        // Add to active tasks
        this.activeTasks.push({
            title,
            reward,
            progress: 0,
            progressBar,
            progressText
        });

        // Update progress bar
        this.updateTaskProgress(title, 0);

        // Simulate task completion over 3 seconds
        const duration = 3000;
        const interval = 100;
        const steps = duration / interval;
        const progressPerStep = 100 / steps;

        let currentStep = 0;
        const timer = this.time.addEvent({
            delay: interval,
            callback: () => {
                currentStep++;
                const progress = Math.min(currentStep * progressPerStep, 100);
                this.updateTaskProgress(title, progress);

                if (progress >= 100) {
                    // Task completed
                    this.completeTask(title);
                    timer.remove();
                }
            },
            callbackScope: this,
            repeat: steps - 1
        });
    }

    private updateTaskProgress(title: string, progress: number): void {
        const task = this.activeTasks.find(t => t.title === title);
        if (!task) return;

        task.progress = progress;
        
        // Update progress bar
        task.progressBar.clear();
        task.progressBar.fillStyle(0x222222, 1);
        task.progressBar.fillRect(20, 420 + (this.activeTasks.indexOf(task) * 60), 200, 20);
        task.progressBar.fillStyle(0x00ff00, 1);
        task.progressBar.fillRect(20, 420 + (this.activeTasks.indexOf(task) * 60), 200 * (progress / 100), 20);

        // Update progress text
        task.progressText.setText(`${title} - ${Math.floor(progress)}%`);
    }

    private completeTask(title: string): void {
        const task = this.activeTasks.find(t => t.title === title);
        if (!task) return;

        // Add reward to work balance
        this.playerStats.work += task.reward;
        this.updateStatsDisplay();

        // Remove progress bar and text
        task.progressBar.destroy();
        task.progressText.destroy();

        // Remove from active tasks
        this.activeTasks = this.activeTasks.filter(t => t.title !== title);

        // If we were at max tasks, restart the timer
        if (this.tasks.length === 3) {
            this.nextTaskTime = this.nextTaskTotal;
        }
    }

    update(_: number, delta: number): void {
        // Update next task timer only if we have less than 4 tasks
        if (this.tasks.length < 4 && this.nextTaskTime > 0) {
            this.nextTaskTime -= delta;
            this.updateNextTaskBar();

            // Check if timer is complete
            if (this.nextTaskTime <= 0) {
                this.nextTaskTime = 0;
                this.updateNextTaskBar(); // Update one last time to show 0s
            }
        } else if (this.tasks.length >= 4) {
            // If we have 4 tasks, show "Maximum tasks reached" message
            this.nextTaskText.setText('Maximum tasks reached');
            this.nextTaskBar.clear();
            this.nextTaskBar.fillStyle(0xff0000, 1);
            this.nextTaskBar.fillRect(1000, 40, 200, 20);
        }
    }
} 