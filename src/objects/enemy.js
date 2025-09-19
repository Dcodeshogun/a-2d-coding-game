export  class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'suicide-enemy-walk'); // start with walk sprite

    this.scene = scene;
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    ///SCALE SPRITES
    this.walkScale = 2.5     // walk sprite scale
    this.explodeScale = 4;   // explode sprite scale
    this.deathScale = 2.8   // death sprite scale

    this.setOrigin(0.5, 1);       // bottom-aligned origin
    this.setScale(this.walkScale); 
    this.y = 433;                  // place on ground
    this.body.setAllowGravity(false); // prevent falling


    this.speed = 180
    this.explodeRange = 5;
    this.isDead = false;
    this.state = 'walk'; // 'walk', 'explode', 'dead'

    this.createAnimations(scene);
    this.play('enemy-walk');
  }

  createAnimations(scene) {
    // Walk
    if (!scene.anims.exists('enemy-walk')) {
      scene.anims.create({
        key: 'enemy-walk',
        frames: scene.anims.generateFrameNumbers('suicide-enemy-walk', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // Explode
    if (!scene.anims.exists('enemy-explode')) {
      scene.anims.create({
        key: 'enemy-explode',
        frames: scene.anims.generateFrameNumbers('suicide-enemy-explode', { start: 0, end: 6 }),
        frameRate: 12,
        repeat: 0
      });
    }

    // Death
    if (!scene.anims.exists('enemy-death')) {
      scene.anims.create({
        key: 'enemy-death',
        frames: scene.anims.generateFrameNumbers('suicide-enemy-death', { start: 0, end: 17 }),
        frameRate: 12,
        repeat: 0
      });
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.isDead) return;

    if (this.state === 'walk') {
      // Move toward player
      this.scene.physics.moveToObject(this, this.player, this.speed);

      // Face player
      this.flipX = this.body.velocity.x > 0;

      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
      if (dist < this.explodeRange) {
        this.explode();
      }
    }
  }

  explode() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = 'explode';

    this.setVelocity(0, 0);
    this.setScale(this.explodeScale); // scale explode sprite
    this.y = 433;                      
    this.play('enemy-explode');

    // Damage player
    this.player.emit('hitByEnemy');

    this.once('animationcomplete', () => this.destroy());
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = 'dead';

    this.setVelocity(0, 0);
    this.setScale(this.deathScale); // scale death sprite
    this.y = 433;                      
    this.play('enemy-death');

    this.once('animationcomplete', () => this.destroy());
  }
}
