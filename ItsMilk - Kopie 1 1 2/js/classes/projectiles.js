class Bullet extends Sprite {
    constructor(position, velocity, color = 'red', size = 5) {
      super({});
      this.position = position;
      this.velocity = velocity;
      this.color = color;
      this.size = size;
    }
  
    draw(c) {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
  
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
  