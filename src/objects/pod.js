export class Pod extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'pod');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.player = player;        // reference to player
    this.offsetX = 50;           // hover distance
    this.offsetY = -90;          // vertical offset
    this.lerpFactor = 0.05;      // smooth follow
    this.state = 'idle';          // current pod state: idle, walk, engage, fire

    this.setScale(3).setCollideWorldBounds(true);

    this.createAnimations(scene);
    this.play('pod-idle');
    // --- BULLET SETUP ---
    this.bullets = scene.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: true });
    this.isFiring = false;
  }

  createAnimations(scene) {
    // Idle
    scene.anims.create({
      key: 'pod-idle',
      frames: scene.anims.generateFrameNumbers('pod', { start: 0, end: 9 }),
      frameRate: 8,
      repeat: -1
    });

    // Walk
    scene.anims.create({
      key: 'pod-walk',
      frames: scene.anims.generateFrameNumbers('pod-walk', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    // Engage
    scene.anims.create({
      key: 'pod-engage',
      frames: scene.anims.generateFrameNumbers('pod-engage', { start: 0, end: 11 }),
      frameRate: 12,
      repeat: 0
    });

    // Fire
    scene.anims.create({
      key: 'pod-fire',
      frames: scene.anims.generateFrameNumbers('pod-fire', { start: 0, end: 11 }),
      frameRate: 16,
      repeat: -1
    });
  }
  engageFire(scene) {
    if (this.state === 'engage' || this.state === 'fire') return;

    this.engage();
    this.once('animationcomplete-pod-engage', () => {
      this.fire();
      this.startFiring(scene);

      // Stop firing after 4seconds and return to idle
      scene.time.delayedCall(4000, () => {
        this.stopFiring();
        this.idle();               
      });
    });
  }

  startFiring(scene) {
    if (this.isFiring) return;
    this.isFiring = true;

    this.fireEvent = scene.time.addEvent({
      delay: 100, // bullet spawn rate
      callback: () => {
        let bullet = this.bullets.get(this.x, this.y, 'bullet'); // replace with your bullet sprite key
        if (bullet) {
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.body.enable = true;
          bullet.body.allowGravity = false;   
          bullet.setVelocityX(this.flipX ? -900 : 900);
          bullet.setX(this.x + (this.flipX ? -50 : 50));
          bullet.setY(this.y);
          bullet.setScale(3);

         /* //  Add yellow glow effect
                let glow = scene.add.image(bullet.x, bullet.y, 'bullet')
                    .setScale(3)         // bigger than bullet
                    .setAlpha(0.3)       // transparent
                    .setTint(0xFFFF00);  // yellow

                // Make glow follow the bullet
                scene.tweens.add({
                    targets: glow,
                    alpha: 0.6,
                    yoyo: true,
                    repeat: -1,
                    duration: 200
                });

                //  stop glow when stopped firing
                bullet.on('destroy', () => glow.destroy()); */
          // Collision with PunchEnemies
             scene.physics.add.overlap(bullet, scene.punchEnemies, (b, enemy) => {
                enemy.takeDamage(5);              // Pod bullet does 3 damage
                b.destroy();              // destroy bullet on hit
            });




           // Collision with enemies
                scene.physics.add.overlap(bullet, scene.enemies, (b, enemy) => {
                    if (!enemy.isDead) {
                        enemy.die();       // trigger enemy death
                        b.destroy();       // remove bullet
                    }
                }, null, scene);
        }
      },
      loop: true
    });
  }

  stopFiring() {
    if (!this.isFiring) return;
    this.isFiring = false;
    if (this.fireEvent) this.fireEvent.remove();
    this.bullets.clear(true, true);
  }

 preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.player) return;

    // Dynamic offset based on player flip
    let dynamicOffsetX = this.player.flipX ? -this.offsetX : this.offsetX;
    let targetX = this.player.x + dynamicOffsetX;
    let targetY = this.player.y + this.offsetY;

    // Flip pod same as player
    this.flipX = this.player.flipX;

    switch (this.state) {
        case 'idle':
        case 'walk':
            // Smooth lerp behind player
            this.x = Phaser.Math.Linear(this.x, targetX, this.lerpFactor);
            this.y = Phaser.Math.Linear(this.y, targetY, this.lerpFactor);
            break;

        case 'engage':
        case 'fire':
            // Direct follow X, clamp Y so Pod never goes below ground
            this.x = targetX + -55;
            this.y = Math.min(targetY, 339); 
            break;
    }
}


  // Animation methods with state changes
  idle() {
    this.state = 'idle';
    this.play('pod-idle', true);
  }

  walk() {
    this.state = 'walk';
    this.play('pod-walk', true);
  }

  engage() {
    this.state = 'engage';
    this.play('pod-engage', true);
  }

  fire() {
    this.state = 'fire';
    this.play('pod-fire', true);
  }
}
