// Define a class called "Player"
class Player extends Sprite {
  constructor({
    collisionBlocks = [],
    imageSrc, // Define an optional parameter for the constructor called "collisionBlocks" with a default value of an empty array
    frameRate,
    animations,
    scale = 0.3,
  }) {
    super({ imageSrc, frameRate, animations, scale });
    // Set the initial position and size of the player object
    this.position = {
      x: 200,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };

    // Calculate the position of the bottom side of the player object
    this.sides = {
      bottom: this.position.y + this.height, // Add a sides property to keep track of the bottom side of the player object
    };
    this.collisionBlocks = collisionBlocks; // Assign the value of collisionBlocks to a property called "collisionBlocks" of the current object
    // Set the gravity value for the player object
    this.gravity = 1.3; // Set the value of gravity for the player object
    this.isJumping = false; // Set isJumping boolean flag to false initially
    this.runningSpeed = 3; // Set running speed to 5 for the player object
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y - 100,
      },
      width: 200,
      height: 200,
    }
  }

  // Update the position of the player object
  update() {

    /*c.fillStyle = 'rgba(255, 0, 0, 0.5)';
    c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height);*/
    this.updateCamerabox()
    // Change the position of the player object by its velocity in the y direction
    this.position.x += this.velocity.x;
    this.updateHitbox();

    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();

    this.checkForVerticalCollisions();

    if (this.velocity.y < 0) {
      this.shouldPanCameraDown({camera, canvas})
    }
    else if (this.velocity.y >0) {
      this.shouldPanCameraUp({camera, canvas})
    }

  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return
    this.currentFrame = 0
    this.image = this.animations[name].image
    this.frameRate = this.animations[name].frameRate
    this.frameBuffer = this.animations[name].frameBuffer
    this.loop = this.animations[name].loop
    this.currentAnimation = this.animations[name]
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 8,
        y: this.position.y + 5,
      },
      width: 15,
      height: 22,
    };

    /*c.fillStyle = 'rgba(255, 0, 0, 0.5)';
    c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);*/
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
          this.shouldPanCameraDown({canvas, camera})
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
            
          break;
        }

        if (this.velocity.y > 0) {
          this.shouldPanCameraUp({canvas, camera})
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


  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 80,
        y: this.position.y - 20,
      },
      width: 200,
      height: 80,
    }


  }


  shouldPanCameraToTheLeft({ canvas, camera }) {

    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
    const scaledDownCanvasWidth = canvas.width / 4

  

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
    
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraToTheRight({ canvas, camera }) {

    if (this.camerabox.position.x <= 0) { return }

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x

    }

  }

  shouldPanCameraDown({ canvas, camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y
    }
  }

  shouldPanCameraUp({ canvas, camera }) {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      432
    )
      return

    const scaledCanvasHeight = canvas.height / 4

    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y
    }
  }

}
