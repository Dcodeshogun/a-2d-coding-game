export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionScene' });
  }

  preload() {
    
    this.load.spritesheet('ui', 'src/ui/instrucions.png', { 
      frameWidth: 800,   
      frameHeight: 550   
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

   this.anims.create({
  key: 'instructionsAnim',
  frames: this.anims.generateFrameNumbers('ui', { start: 0, end: 1 }), 
  frameRate: 2,
  repeat: -1
});

this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ui').play('instructionsAnim');


    
    this.input.on('pointerdown', () => {
        this.cameras.main.fadeOut(200, 0, 0, 0); 
        this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('BootScene');
      });
      
    });
  }
}
