/**
 * Sprite class for handling sprite animations
 */
class Sprite {
  /**
   * Create a new sprite
   * @param {HTMLImageElement} image - The sprite sheet image
   * @param {number} frameWidth - Width of each frame in the sprite sheet
   * @param {number} frameHeight - Height of each frame in the sprite sheet
   * @param {number} totalFrames - Total number of frames in the animation
   * @param {number} animationSpeed - Speed of the animation (frames per update)
   */
  constructor(
    image,
    frameWidth,
    frameHeight,
    totalFrames,
    animationSpeed = 0.1
  ) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.totalFrames = totalFrames;
    this.animationSpeed = animationSpeed;

    this.currentFrame = 0;
    this.frameTimer = 0;
    this.animations = {
      idle: { startFrame: 0, endFrame: 0 },
      run: { startFrame: 0, endFrame: totalFrames - 1 },
      jump: { startFrame: 0, endFrame: 0 },
    };

    this.currentAnimation = "idle";
  }

  /**
   * Add a new animation to the sprite
   * @param {string} name - Name of the animation
   * @param {number} startFrame - Starting frame of the animation
   * @param {number} endFrame - Ending frame of the animation
   */
  addAnimation(name, startFrame, endFrame) {
    this.animations[name] = { startFrame, endFrame };
  }

  /**
   * Set the current animation
   * @param {string} name - Name of the animation to set
   */
  setAnimation(name) {
    if (this.currentAnimation !== name && this.animations[name]) {
      this.currentAnimation = name;
      this.currentFrame = this.animations[name].startFrame;
      this.frameTimer = 0;
    }
  }

  /**
   * Update the sprite animation
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    this.frameTimer += deltaTime;

    if (this.frameTimer >= this.animationSpeed) {
      this.frameTimer = 0;

      const { startFrame, endFrame } = this.animations[this.currentAnimation];

      if (this.currentFrame < endFrame) {
        this.currentFrame++;
      } else {
        this.currentFrame = startFrame;
      }
    }
  }

  /**
   * Draw the sprite on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {number} x - X position to draw the sprite
   * @param {number} y - Y position to draw the sprite
   * @param {number} width - Width to draw the sprite
   * @param {number} height - Height to draw the sprite
   * @param {boolean} flipX - Whether to flip the sprite horizontally
   */
  draw(ctx, x, y, width, height, flipX = false) {
    const frameX = this.currentFrame % (this.image.width / this.frameWidth);
    const frameY = Math.floor(
      this.currentFrame / (this.image.width / this.frameWidth)
    );

    ctx.save();

    if (flipX) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.image,
        frameX * this.frameWidth,
        frameY * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        0,
        0,
        width,
        height
      );
    } else {
      ctx.drawImage(
        this.image,
        frameX * this.frameWidth,
        frameY * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        x,
        y,
        width,
        height
      );
    }

    ctx.restore();
  }
}
