class Collectible {
  constructor({x, y, value, id}) {
    this.id = id;
    this.value = value;
    this.x = x;
    this.y = y;
    this.radius = 10;
  }

  draw(context, img) {
    context.drawImage(img, this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius)
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
