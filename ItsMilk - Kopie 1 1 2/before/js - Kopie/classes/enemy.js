let movingRight = false;

class Enemy extends Sprite {
  constructor({
    collisionBlocks = [],
    imageSrc,
    frameRate,
    animations,
    patrolRange = { start: 200, end: 800 }, // The range in which the enemy patrols
  }) {
    super({ imageSrc, frameRate, animations });

    const xPos =
      Math.random() * (patrolRange.end - patrolRange.start) + patrolRange.start;

    this.position = {
      x: xPos,
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
    this.patrolRange = patrolRange;
    this.movingRight = true; // The direction in which the enemy is currently moving
  }

  update() {
    // Check if the enemy has reached the end of its patrol range
    if (this.position.x + this.width > this.patrolRange.end) {
      this.movingRight = false;
      this.switchSprite("runLeft");
    } else if (this.position.x < this.patrolRange.start) {
      this.movingRight = true;
      this.switchSprite("runRight");
    }

    // Update the enemy's velocity based on its direction of movement
    this.velocity.x = this.movingRight ? 1 : -1;

    // Update the enemy's position
    this.position.x += this.velocity.x;
    this.updateHitbox();

    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();

    this.checkForVerticalCollisions();
  }

  switchSprite(name) {
    console.log(name);
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
        x: this.position.x + 58,
        y: this.position.y + 34,
      },
      width: 50,
      height: 53,
      
    };

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
          break;
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
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
          this.movingRight = false;
          this.switchSprite("runLeft");
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
}
// Rest of your methods...
