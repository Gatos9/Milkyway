class Layer {
  constructor({ imageSrc, position, speedModifier }) {
    this.position = position;
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
      this.width = this.image.width;
      this.height = this.image.height;
      this.x = this.position.x;
      this.x2 = this.image.width;
    };
    this.image.src = imageSrc;
    this.speedModifier = speedModifier;
  }

  update(position) {
    this.position.y = position.y;
    if (this.x < -this.width) {
      this.x = this.width + this.x2;
    }
    if (this.x2 < -this.width) {
      this.x2 = this.width + this.x;
    }
    this.x -=player.velocity.x *this.speedModifier;
    this.x2 -=player.velocity.x *this.speedModifier;
  }

  draw() {
    c.drawImage(this.image, this.x, this.position.y, this.width, this.height);
    console.log('this.x: ' + this.x + ', player.x: '+ player.position.x)
    c.drawImage(this.image, this.x2, this.position.y, this.width, this.height);
  }
}
