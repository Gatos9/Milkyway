class Enemy extends Sprite {
  constructor({
    collisionBlocks = [],
    imageSrc,
    frameRate,
    animations,
    scale = 0.3
  }) {
    super({ imageSrc, frameRate, animations });

    this.scale = scale
    this.position = {
      x: 60,
      y: 200,
    };
    this.velocity = {
      x: 1, // The enemy always moves horizontally
      y: 0,
    };

    this.sides = {
      bottom: this.position.y + this.height,
    };
    this.collisionBlocks = collisionBlocks;
    this.gravity = 1;

    this.movingRight = false; // The direction in which the enemy is currently moving
  }

  update() {
    // Update the enemy's velocity based on its direction of movement
    this.velocity.x = this.movingRight ? 1 : -1;
    this.movingRight ? this.switchSprite("runRight") : this.switchSprite("runLeft");
    // Update the enemy's position
    this.position.x += this.velocity.x;
    
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
    this.checkForEdges();
    this.checkForPlayerCollisions()
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 1,
        y: this.position.y + 5,
      },
      width: 28,
      height: 23,

    };

     /*c.fillStyle = 'rgba(255, 0, 0, 0.5)';
    c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height); */

  }

  checkForPlayerCollisions() {
    if (this.hitbox.position.x <=
      player.hitbox.position.x + player.hitbox.width &&
      this.hitbox.position.x + this.hitbox.width >=
      player.hitbox.position.x &&
      this.hitbox.position.y + this.hitbox.height >=
      player.hitbox.position.y &&
      this.hitbox.position.y <=
      player.hitbox.position.y + player.hitbox.height
    ) { for (let i = 0; i < collisionsLevel3.length; i++) {
      if (platformCollisionsLevel3[i] === 202) {
        collisionsLevel3[i] = 202;
      } } console.log(collisionsLevel3);}

    else { console.log('miss') }

  }


  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // if a collision exists
      if (
        this.hitbox.position.x <=
        collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
        collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
        collisionBlock.position.y &&
        this.hitbox.position.y <=
        collisionBlock.position.y + collisionBlock.height
      ) {
        // collision on x axis going to the left
        if (this.velocity.x < -0) {
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          this.movingRight = true;

          break;
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          this.movingRight = false;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // if a collision exists
      if (
        this.hitbox.position.x <=
        collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
        collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
        collisionBlock.position.y &&
        this.hitbox.position.y <=
        collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;


          break;
        }

        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          this.isJumping = false;
          break;
        }
      }
    }
  }

  // Method to check if there is a ground in front of the enemy's direction
  checkForEdges() {
    const nextX = this.movingRight ? this.hitbox.position.x + this.hitbox.width + 1 : this.hitbox.position.x - 1;
    const nextY = this.hitbox.position.y + this.hitbox.height + 1;

    let isGroundInFront = false;

    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        nextX >= collisionBlock.position.x &&
        nextX <= collisionBlock.position.x + collisionBlock.width &&
        nextY >= collisionBlock.position.y &&
        nextY <= collisionBlock.position.y + collisionBlock.height
      ) {
        isGroundInFront = true;
        break;
      }
    }

    // If there is no ground in front, change the direction
    if (!isGroundInFront) this.movingRight = !this.movingRight;
  }


}
// Rest of your methods...
