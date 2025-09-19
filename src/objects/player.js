export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    

    this.setScale(1.2).setCollideWorldBounds(true);
    this.setOrigin(0.5,1);

   // player hitbox 
    this.setSize(40, 40);      // collision box size
    this.setOffset(40, 80);  // shift collision box inside sprite

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

    // slash animation
    scene.anims.create({
      key: 'player-slash',
      frames: scene.anims.generateFrameNumbers('slash', { start: 0, end: 7 }),
      frameRate: 16,
      repeat: 0
    });

    this.play('player-idle');

    // Flag to prevent movement during attack
    this.isAttacking = false;

    // Reset to idle after slash finishes
    this.on('animationcomplete', (anim) => {
      if (anim.key === 'player-slash') {
        this.isAttacking = false;
        this.setScale(1);
        this.play('player-idle');
      }
    });

  }

  // Call  when  SPACE
 /* attack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.setScale(1.1);
      this.play('player-slash');
    } 
  }*/
 attack() {
    if (!this.isAttacking) {
        this.isAttacking = true;

        // hide player
        this.setVisible(false);

        // spawn slash sprite
        let slash = this.scene.add.sprite(this.x, this.y - 20, 'slash'); 
        slash.play('player-slash');
        slash.flipX = this.flipX;
        slash.setOrigin(0.5, 0.89);
        //SCALE
        slash.setScale(1.11)

          // Enable physics on the slash so it can detect enemies
        this.scene.physics.add.existing(slash);
        slash.body.setSize(slash.width, slash.height); // match hitbox to sprite
        slash.body.allowGravity = false;

        // Overlap check with enemies
        let overlapCollider = this.scene.physics.add.overlap(slash, this.scene.enemies, (slashObj, enemy) => {
            enemy.die(); // trigger enemy death
        });


        // destroy slash and show player again
        slash.on('animationcomplete', () => {
            slash.destroy();
            this.setVisible(true);
            this.isAttacking = false;
        });
    } 
}


}
  

