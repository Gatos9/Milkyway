// The following line gets the canvas element from the document
const canvas = document.querySelector("canvas");

// The following line gets a 2D rendering context for the canvas
const c = canvas.getContext("2d");

// Set the width and height of the canvas
canvas.width = 64 * 16;
canvas.height = 64 * 14;

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
};

let parsedCollisions;
let collisionBlocks;
let backgroundLayer1;
let backgroundLayer2;
let backgroundLayer3;
let backgroundLayer4;
let backgroundLayer5;
let background;
let doors;
let enemysTocreate = 1;
let enemys = [];
let speedLayer1 = 0.8;
let speedLayer2 = 0.5;
let speedLayer3 = 0.3;
let speedLayer4 = 0.1;
let speedLayer5 = 0.05;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// Create a new instance of the Player class
const player = new Player({
  imageSrc: "./img/character/idleRight.png",
  frameRate: 2,
  frameBuffer: 20,
  animations: {
    idleRight: {
      frameRate: 2,
      frameBuffer: 15,
      loop: true,
      imageSrc: "./img/character/idleRight.png",
    },
    idleLeft: {
      frameRate: 2,
      frameBuffer: 15,
      loop: true,
      imageSrc: "./img/character/idleLeft.png",
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: "./img/character/walkRight.png",
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: "./img/character/walkLeft.png",
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: "./img/character/idleRight.png",
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            console.log("hello");
            level++;
            if (level === 4) level = 1;
            levels[level].init();
            player.switchSprite("idleRight");
            player.preventInput = false;
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
  },
});

for (let i = 0; i < enemysTocreate; i++) {
  enemys.push(
    new Enemy({
      imageSrc: "./img/cowenemy/walkRight.png",
      frameRate: 5,
      animations: {
        runRight: {
          frameRate: 5,
          frameBuffer: 20,
          loop: true,
          imageSrc: "./img/cowenemy/walkRight.png",
        },
        runLeft: {
          frameRate: 5,
          frameBuffer: 20,
          loop: true,
          imageSrc: "./img/cowenemy/walkLeft.png",
        },
      },
    })
  );
}

let level = 3;
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      background = new Sprite({
        frameRate: 1,
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./img/backgroundLevel1.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D();

      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 772;
      player.position.y = 500;

      if (player.currentAnimation) player.currentAnimation.isActive = false;

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./img/backgroundLevel2.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 772.0,
            y: 500,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      for (let i = 0; i < 180; i++) {
        collisionBlocks.push(
          new CollisionBlock({
            position: {
              x: collisionBlocks[collisionBlocks.length - 1].position.x + 16,
              y: collisionBlocks[collisionBlocks.length - 1].position.y,
            },
          })
        );
      }

      player.collisionBlocks = collisionBlocks;

      player.position.x = 150;
      player.position.y = 100;
      if (player.currentAnimation) player.currentAnimation.isActive = false;

      backgroundLayer1 = new Layer({
        speedModifier: 1,
        imageSrc: "./img/ground.png",
        position: {
          x:0,
          y:0,
        }        
      });
      backgroundLayer2= new Layer({
        speedModifier: 0.5,
        imageSrc: "./img/HugeTree.png",
        position: {
          x:0,
          y:0,
        }        
      });

      doors = [
        new Sprite({
          scale: 0.25,
          position: {
            x: 460,
            y: 372,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
};

// Declare variables `msPrev`, `fps`, `msPerFrame` and `frames`
let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0;

const overlay = {
  opacity: 0,
};

const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: 0,
  },
};

// Define the `animate()` function to animate the game scene
function animate() {
  // Call the `animate()` function recursively using requestAnimationFrame()
  window.requestAnimationFrame(animate);

  const msNow = window.performance.now();
  const msPassed = msNow - msPrev;

  // If time passed between the current frame and the previous frame is less than the desired frame rate, return
  if (msPassed < msPerFrame) return;

  const excessTime = msPassed % msPerFrame;
  msPrev = msNow - excessTime;

  c.save();
  c.scale(4, 4);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.translate(camera.position.x, camera.position.y);

  backgroundLayer1.update({
    x: backgroundLayer1.position.x -= player.velocity.x,
    y:backgroundImageHeight - backgroundLayer1.height +64,
  });
  backgroundLayer1.draw();

  backgroundLayer2.update({
    x: backgroundLayer1.position.x -= player.velocity.x,
    y:backgroundImageHeight - backgroundLayer1.height -100,
  });
  backgroundLayer2.draw();

  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });
  doors.forEach((collisionBlock) => {
    collisionBlock.draw();
  });
  player.update();
  player.draw();

  player.collisionBlocks = collisionBlocks;
  enemys.forEach((enemy, index) => {
    enemy.number = index;
    enemy.collisionBlocks = collisionBlocks;
    enemy.draw();
    enemy.update();
  });

  if (keys.w.isPressed) {
    jump();
  }
  if (keys.a.isPressed && keys.d.isPressed) {
    stopMovement();
  } else if (keys.a.isPressed) {
    moveLeft(), player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (keys.d.isPressed) {
    moveRight(), player.shouldPanCameraToTheLeft({ canvas, camera });
  }
  c.restore();
  frames++;
}

// Log the number of frames per second in the console every second using the `setInterval()` method
setInterval(() => {
  console.log(frames);
}, 1000);

levels[level].init();
// Call the `animate()` function to start the animation loop
animate();
