export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionScene' });
  }

  preload() {
    // load your instructions spritesheet
    this.load.spritesheet('ui', 'src/ui/instrucions.png', { 
      frameWidth: 800,   // adjust to your actual frame width
      frameHeight: 550   // adjust to your actual frame height
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

   this.anims.create({
  key: 'instructionsAnim',
  frames: this.anims.generateFrameNumbers('ui', { start: 0, end: 1 }), // adjust range
  frameRate: 2,
  repeat: -1
});

this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ui').play('instructionsAnim');


    // Click anywhere to continue
    this.input.on('pointerdown', () => {
        this.cameras.main.fadeOut(200, 0, 0, 0); // 500ms fade, black
        this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('BootScene');
      });
      
    });
  }
}
