export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background panel
    this.add.rectangle(0, 0, width, height, 0x0b0d0f, 1).setOrigin(0, 0);

    // Vignette overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.3)
      .setBlendMode('MULTIPLY');

    // Scanlines for sci-fi effect
    for (let i = 0; i < height; i += 3) {
      this.add.rectangle(width / 2, i, width, 1, 0x7ae2b3, 0.02);
    }

    // Main “End” message
    this.add.text(width / 2, height / 2 - 50, "YOU HAVE REACHED THE END", {
      fontFamily: 'Courier New',
      fontSize: '32px',
      color: '#7ae2b3',
      fontStyle: 'bold',
      shadow: { offsetX: 0, offsetY: 0, color: '#7ae2b3', blur: 8, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, "For now...", {
      fontFamily: 'Courier New',
      fontSize: '27px',
      color: '#7cc7d9',
      shadow: { offsetX: 0, offsetY: 0, color: '#7ae2b3', blur: 8, fill: true }
    }).setOrigin(0.5);

    // Button to return to Main Menu
    const buttonWidth = 250;
    const buttonHeight = 50;
    const buttonX = width / 2 - buttonWidth / 2;
    const buttonY = height / 2 + 80;

    const button = this.add.rectangle(width / 2, buttonY, buttonWidth, buttonHeight, 0x111416, 1)
      .setStrokeStyle(2, 0x7ae2b3, 1)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(width / 2, buttonY, "MAIN MENU", {
      fontFamily: 'Courier New',
      fontSize: '18px',
      color: '#7ae2b3'
    }).setOrigin(0.5);

    // Hover effects
    button.on('pointerover', () => {
      button.setFillStyle(0x1a1a1a);
      buttonText.setColor('#e4e4e4');
    });
    button.on('pointerout', () => {
      button.setFillStyle(0x111416);
      buttonText.setColor('#7ae2b3');
    });

    // Click to go back to Main Menu
    button.on('pointerdown', () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => {
        this.scene.start('MenuScene');
      });
    });
  }
}
