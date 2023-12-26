let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (e) => {
      e.preventDefault(); // Prevent default touch behavior
      if (!this.rotating) {
        this.mouseX = e.clientX || e.touches[0].clientX;
        this.mouseY = e.clientY || e.touches[0].clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.touchX;
      const dirY = this.mouseY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler, { passive: false });

    paper.addEventListener('mousedown', (e) => this.startAction(e));
    paper.addEventListener('touchstart', (e) => this.startAction(e.touches[0]));

    window.addEventListener('mouseup', () => this.endAction());
    window.addEventListener('touchend', () => this.endAction());

    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
  }

  startAction(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.touchX = this.mouseX = e.clientX || e.touches[0].clientX;
    this.touchY = this.mouseY = e.clientY || e.touches[0].clientY;
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    this.paper.style.zIndex = highestZ;
    highestZ += 1;

    if (e.button === 2 || e.touches.length === 2) {
      e.preventDefault();
      this.rotating = true;
    }
  }

  endAction() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.paper = paper;
  p.init(paper);
});
