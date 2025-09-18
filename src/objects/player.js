export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(1.2).setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);

    this.health = 140;
    this.maxHealth = 100;

    // Animations
    scene.anims.create({
      key: 'player-idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'player-walk',
      frames: scene.anims.generateFrameNumbers('walk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.play('player-idle');
  }
}
