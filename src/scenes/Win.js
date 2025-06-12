class WinScene extends Phaser.Scene {
    constructor() {
        super('WinScene');
    }

    create() {
        // Set background color if you want (optional)
        this.cameras.main.setBackgroundColor('#000000');  // black screen

        // Display your win text
        this.add.text(480, 270, 'You Win!', {
            fontSize: '48px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Maybe a replay instruction
        this.add.text(480, 350, 'Press SPACE to Restart', {
            fontSize: '24px',
            fill: '#AAAAAA'
        }).setOrigin(0.5);

        // Add keyboard input to restart the game
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('Start');  // or whatever your main scene is called
        });
    }
}


