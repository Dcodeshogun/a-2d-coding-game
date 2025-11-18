export class Pod extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'pod');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.player = player;        // reference to player
    this.offsetX = 50;           // hover distance
    this.offsetY = -90;          // vertical offset
    this.lerpFactor = 0.07;      // smooth follow
    this.state = 'idle';          // current pod state: idle, walk, engage, fire
    this.podFireSfx = this.scene.sound.add('pod-fire', { volume: 0.45, loop: true });
    this.setScale(3).setCollideWorldBounds(true);

    this.createAnimations(scene);
    this.play('pod-idle');

    this.bullets = scene.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: true });
    this.isFiring = false;

    this.maxUses = 2;   
    this.currentUses = 0; 
  }

  createAnimations(scene) {
    if (!scene.anims.exists('pod-idle')) {
      scene.anims.create({
        key: 'pod-idle',
        frames: scene.anims.generateFrameNumbers('pod', { start: 0, end: 9 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('pod-walk')) {
      scene.anims.create({
        key: 'pod-walk',
        frames: scene.anims.generateFrameNumbers('pod-walk', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists('pod-engage')) {
      scene.anims.create({
        key: 'pod-engage',
        frames: scene.anims.generateFrameNumbers('pod-engage', { start: 0, end: 11 }),
        frameRate: 12,
        repeat: 0
      });
    }

    if (!scene.anims.exists('pod-fire')) {
      scene.anims.create({
        key: 'pod-fire',
        frames: scene.anims.generateFrameNumbers('pod-fire', { start: 0, end: 11 }),
        frameRate: 16,
        repeat: -1
      });
    }
  }

  engageFire(scene) {
    if (this.currentUses >= this.maxUses) {
      console.log('Pod charge empty! Solve quiz questions to recharge.');
      return;
    }

    if (this.state === 'engage' || this.state === 'fire') return;

    this.currentUses++; 
    console.log(`Pod used (${this.currentUses}/${this.maxUses})`);

    this.engage();
    this.once('animationcomplete-pod-engage', () => {
      this.fire();

      if (!this.podFireSfx.isPlaying) {
        this.podFireSfx.play(); 
      }

      if (this.isDead) return;
      this.startFiring(scene);

      scene.time.delayedCall(5400, () => {
        this.stopFiring();
        this.idle();
      });
    });
  }

  startFiring(scene) {
    if (this.isFiring) return;
    this.isFiring = true;

    this.fireEvent = scene.time.addEvent({
      delay: 100,
      callback: () => {
        let bullet = this.bullets.get(this.x, this.y, 'bullet'); 
        if (bullet) {
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.body.enable = true;
          bullet.body.allowGravity = false;   
          bullet.setVelocityX(this.flipX ? -900 : 900);
          bullet.setX(this.x + (this.flipX ? -50 : 50) - 40);
          bullet.setY(this.y);
          bullet.setScale(3);

          scene.physics.add.overlap(bullet, scene.punchEnemies, (b, enemy) => {
            enemy.takeDamage(3.8);              
            b.destroy();              
                
            const spark = scene.add.sprite((b.x) + 145, b.y + 40, 'spark');
            spark.setScale(0.98);
            spark.play('spark-anim');
            spark.once('animationcomplete', () => spark.destroy());
          });

          scene.physics.add.overlap(bullet, scene.enemies, (b, enemy) => {
            if (!enemy.isDead) {
              enemy.die();       
              b.destroy();       
              const spark = scene.add.sprite((b.x) + 150, b.y + 40, 'spark');
              spark.setScale(0.7);
              spark.play('spark-anim');
              spark.once('animationcomplete', () => spark.destroy());
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

    if (this.podFireSfx && this.podFireSfx.isPlaying) {
      this.podFireSfx.stop();
    }

    this.state = 'idle';
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.player) return;

    let dynamicOffsetX = this.player.flipX ? -this.offsetX : this.offsetX;
    let targetX = this.player.x + dynamicOffsetX;
    let targetY = this.player.y + this.offsetY;
    this.flipX = this.player.flipX;

    switch (this.state) {
      case 'idle':
      case 'walk':
        this.x = Phaser.Math.Linear(this.x, targetX, this.lerpFactor);
        this.y = Phaser.Math.Linear(this.y, targetY, this.lerpFactor);
        break;

      case 'engage':
      case 'fire':
        this.x = targetX - 55;
        this.y = Math.min(targetY, 339);
        break;
    }
  }

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
