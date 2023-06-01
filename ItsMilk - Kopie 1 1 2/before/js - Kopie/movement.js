// Creates an object with 4 properties and keys for each of the arrow keys on a keyboard
const keys = {
  w: {
    isPressed: false,
  },
  a: {
    isPressed: false,
  },
  s: {
    isPressed: false,
  },
  d: {
    isPressed: false,
  },
};
let lastdirection = "left";

// Adds an event listener to track when a key is pressed down
window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  switch (event.key) {
    // Sets the `isPressed` property to `true` for the corresponding key in the `keys` object when the keydown event occurs
    case "w":
      keys.w.isPressed = true;
      break;
    case "a":
      keys.a.isPressed = true;
      break;
    case "s":
      break;
    case "d":
      keys.d.isPressed = true;
      break;
  }
});

// Adds an event listener to track when a key is released
window.addEventListener("keyup", (event) => {
  if (player.preventInput) return;
  switch (event.key) {
    // Sets the `isPressed` property to `false` for the corresponding key in the `keys` object when the keyup event occurs
    case "w":
      keys.w.isPressed = false;
      break;
    case "a":
      keys.a.isPressed = false;
      lastdirection = "left";
      // Calls the `stopMovement()` function when the 'A' key is released
      stopMovement();
      break;
    case "s":
      break;
    case "d":
      keys.d.isPressed = false;
      lastdirection = "right";
      // Calls the `stopMovement()` function when the 'D' key is released
      stopMovement();
      break;
  }
});

// Creates a function for player to jump
function jump() {
  if (!player.isJumping) {
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      if (
        player.hitbox.position.x + player.hitbox.width <=
          door.position.x + door.width &&
        player.hitbox.position.x >= door.position.x &&
        player.hitbox.position.y + player.hitbox.height >= door.position.y &&
        player.hitbox.position.y <= door.position.y + door.height
      ) {
        player.preventInput = true;
        keys.a.isPressed = false;
        keys.d.isPressed = false;
        player.velocity.x = 0;
        player.velocity.y = 0;
        door.play();
        player.switchSprite("enterDoor");
        resetMovement()
        return;
      }
    }
  }
  if (player.preventInput) return;
  if (player.isJumping == false) {
    player.isJumping = true;
    player.velocity.y -= 20;
  }
}

// Creates a function for player to move left
function moveLeft() {
  // Updates the horizontal velocity of the player object towards the left direction with some restrictions
  if (player.velocity.x > -Math.abs(player.runningSpeed)) {
    if (player.velocity.x > -1) {
      player.switchSprite("runLeft");
      player.velocity.x = -1;
    } else {
      player.velocity.x -= 0.25;
      player.switchSprite("runLeft");
    }
  }
}

// Creates a function for player to move right
function moveRight() {
  // Updates the horizontal velocity of the player object towards the right direction with some restrictions
  if (player.velocity.x < 1) {
    player.velocity.x = 1;
  } else if (player.velocity.x < player.runningSpeed) {
    player.velocity.x += 0.25;
  }
  player.switchSprite("runRight");
}

// Creates a function to set the horizontal velocity of the player object to zero
function stopMovement() {
  console.log("last direction " + lastdirection);
  player.velocity.x = 0;
  if (lastdirection === "right") {
    player.switchSprite("idleRight");
  } else {
    player.switchSprite("idleLeft");
  }
}

function resetMovement() {
    keys.a.isPressed = false;
    keys.d.isPressed = false;
    keys.w.isPressed = false;
    keys.s.isPressed = false;

}