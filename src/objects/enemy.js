export  class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, player) {
    super(scene, x, y, 'suicide-enemy-walk'); 

    this.scene = scene;
    this.player = player;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    
    this.walkScale = 2.5     
    this.explodeScale = 4;   
    this.deathScale = 2.8   

    this.setOrigin(0.5, 1);       
    this.setScale(this.walkScale); 
    this.y = 433;                  
    this.body.setAllowGravity(false); 
    
    this.body.setSize(15, 60);   
    this.body.setOffset(25, 5);  


    this.speed = 230
    this.explodeRange = 5;
    this.isDead = false;
    this.state = 'walk'; 

    this.createAnimations(scene);
    this.play('enemy-walk');
  }

  createAnimations(scene) {
    
    if (!scene.anims.exists('enemy-walk')) {
      scene.anims.create({
        key: 'enemy-walk',
        frames: scene.anims.generateFrameNumbers('suicide-enemy-walk', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }

    
    if (!scene.anims.exists('enemy-explode')) {
      scene.anims.create({
        key: 'enemy-explode',
        frames: scene.anims.generateFrameNumbers('suicide-enemy-explode', { start: 0, end: 6 }),
        frameRate: 12,
        repeat: 0
      });
    }

    
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
        
        this.setTint(0x999999); 

        
        this.scene.physics.moveToObject(this, this.player, this.speed);

        
        this.flipX = this.body.velocity.x > 0;

        const dist = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        if (dist < this.explodeRange) {
            this.explode();
        }
    } else {
        
        this.clearTint();
    }
}


  explode() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = 'explode';

    this.setVelocity(0, 0);
    this.setScale(this.explodeScale); 
    this.y = 433;                      
    this.play('enemy-explode');
    
    
    const offsetX = this.flipX ? 37 : -37; 
    this.x += offsetX;
    
      
    this.scene.cameras.main.shake(250, 0.01); 

    
    this.player.emit('hitByEnemy');

    this.once('animationcomplete', () => this.destroy());
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.state = 'dead';

    this.setVelocity(0, 0);
    this.setScale(this.deathScale); 
    this.y = 433;                      
    this.play('enemy-death');

    this.once('animationcomplete', () => this.destroy());
  }
}
