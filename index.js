/** @type {HTMLCanvasElement} */

// 初始化canvas上下文，设置canvas尺寸
const canvas = document.querySelector("#canvas");
const startBtn = document.querySelector(".start");
const restartBtn = document.querySelector(".restart");
const pauseBtn = document.querySelector(".pause");
const continueBtn = document.querySelector(".continue");
const personEl = document.querySelector(".person");
const scoreEl = document.querySelector(".score");
const totalScoreEl = document.querySelector(".total-score");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const pipeDistance = 100;
let animationId = null;
let isPause = true;
let addPipeTimer = null;
let score = 0;

let pipeList = [];

const bgImage = new Image();
bgImage.src = "http://www.jwhupup.cn/flappy-bird/assets/images/bg_day.png";
bgImage.onload = () => {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
};

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  personEl.style.display = "none";
  pauseBtn.style.display = "block";
  addPipeTimer = setInterval(() => {
    pipeList.push(new Pipe());
    if (pipeList.length > 3) {
      pipeList.shift();
    }
  }, 2000);
  init();
});

restartBtn.addEventListener("click", () => {
  score = 0;
  restartBtn.style.display = "none";
  totalScoreEl.style.display = "none";
  personEl.style.display = "none";
  pauseBtn.style.display = "block";
  scoreEl.style.display = "block";
  addPipeTimer = setInterval(() => {
    pipeList.push(new Pipe());
    if (pipeList.length > 3) {
      pipeList.shift();
    }
  }, 2000);
  init();
});

pauseBtn.addEventListener("click", () => {
  continueBtn.style.display = "block";
  personEl.style.display = "block";
  pauseBtn.style.display = "none";
  cancelAnimationFrame(animationId);
  clearInterval(addPipeTimer);
});

continueBtn.addEventListener("click", () => {
  pauseBtn.style.display = "block";
  continueBtn.style.display = "none";
  personEl.style.display = "none";
  addPipeTimer = setInterval(() => {
    pipeList.push(new Pipe());
    if (pipeList.length > 3) {
      pipeList.shift();
    }
  }, 2000);
  render();
});

// 背景
class Bg {
  constructor(dx, dy) {
    this.dx = 0;
    this.dy = 0;
    this.image = new Image();
    this.image.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/bg_day.png";
    this.image.onload = () => {
      this.dy = 0.8 * (canvas.height - this.image.height);
      this.render();
    };
  }

  update() {
    this.dx -= 1;
    scoreEl.innerHTML = `分数：${score++}`;
    if (this.dx + this.image.width <= 0) {
      this.dx = 0;
    }
    this.render();
  }

  render() {
    ctx.fillStyle = "#4DC0CA";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      0.8 * (canvas.height - this.image.height) + 10
    );
    ctx.drawImage(this.image, this.dx, this.dy);
    ctx.drawImage(this.image, this.dx + this.image.width, this.dy);
    ctx.drawImage(this.image, this.dx + this.image.width * 2, this.dy);
  }
}

// 地面
class Land {
  constructor() {
    this.dx = 0;
    this.dy = canvas.height * 0.8;
    this.image = new Image();
    this.image.src = "http://www.jwhupup.cn/flappy-bird/assets/images/land.png";
    this.image.onload = () => {
      this.render();
    };
  }

  update() {
    this.dx -= 1.5;
    if (this.dx + this.image.width <= 0) {
      this.dx = 0;
    }
    this.render();
  }

  render() {
    ctx.fillStyle = "#DED895";
    ctx.fillRect(
      0,
      canvas.height * 0.8 + this.image.height - 10,
      canvas.width,
      canvas.height * 0.2 - this.image.height + 10
    );
    ctx.drawImage(this.image, this.dx, this.dy);
    ctx.drawImage(this.image, this.dx + this.image.width, this.dy);
    ctx.drawImage(this.image, this.dx + this.image.width * 2, this.dy);
  }
}

// 管道
class Pipe {
  constructor() {
    this.dx = canvas.width;
    this.dy = 0;
    this.upPipeHeight = (Math.random() * canvas.height * 0.8) / 2 + 30;
    this.downPipeHeight = (Math.random() * canvas.height * 0.8) / 2 + 30;

    if (canvas.height * 0.8 - this.upPipeHeight - this.downPipeHeight <= 80) {
      console.log("///小于80了///");
      this.upPipeHeight = 200;
      this.downPipeHeight = 200;
    }

    this.downImage = new Image();
    this.upImage = new Image();
    this.downImage.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/pipe_down.png";
    this.upImage.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/pipe_up.png";
  }

  update() {
    this.dx -= 1.5;

    this.upCoord = {
      tl: {
        x: this.dx,
        y: canvas.height * 0.8 - this.upPipeHeight,
      },
      tr: {
        x: this.dx + this.upImage.width,
        y: canvas.height * 0.8 - this.upPipeHeight,
      },
      bl: {
        x: this.dx,
        y: canvas.height * 0.8,
      },
      br: {
        x: this.dx + this.upImage.width,
        y: canvas.height * 0.8,
      },
    };

    this.downCoord = {
      bl: {
        x: this.dx,
        y: this.downPipeHeight,
      },
      br: {
        x: this.dx + this.downImage.width,
        y: this.downPipeHeight,
      },
    };

    this.render();
  }

  render() {
    ctx.drawImage(
      this.downImage,
      0,
      this.downImage.height - this.downPipeHeight,
      this.downImage.width,
      this.downPipeHeight,
      this.dx,
      this.dy,
      this.downImage.width,
      this.downPipeHeight
    );
    ctx.drawImage(
      this.upImage,
      0,
      0,
      this.upImage.width,
      this.upPipeHeight,
      this.dx,
      canvas.height * 0.8 - this.upPipeHeight,
      this.upImage.width,
      this.upPipeHeight
    );
  }
}

// 小鸟
class Bird {
  constructor() {
    this.dx = 0;
    this.dy = 0;
    this.speed = 2;
    this.image0 = new Image();
    this.image1 = new Image();
    this.image2 = new Image();
    this.image0.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/bird0_0.png";
    this.image1.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/bird0_1.png";
    this.image2.src =
      "http://www.jwhupup.cn/flappy-bird/assets/images/bird0_2.png";

    this.loopCount = 0;

    this.control();

    setInterval(() => {
      if (this.loopCount === 0) {
        this.loopCount = 1;
      } else if (this.loopCount === 1) {
        this.loopCount = 2;
      } else {
        this.loopCount = 0;
      }
    }, 200);
  }

  control() {
    let timer = true;
    canvas.addEventListener("touchstart", (e) => {
      timer = setInterval(() => {
        this.dy -= this.speed;
      });
      e.preventDefault();
    });
    canvas.addEventListener("touchmove", () => {
      clearInterval(timer);
    });
    canvas.addEventListener("touchend", () => {
      clearInterval(timer);
    });
  }

  update() {
    this.dy += this.speed;

    this.birdCoord = {
      tl: {
        x: this.dx,
        y: this.dy,
      },
      tr: {
        x: this.dx + this.image0.width,
        y: this.dy,
      },
      bl: {
        x: this.dx,
        y: this.dy + this.image0.height,
      },
      br: {
        x: this.dx + this.image0.width,
        y: this.dy + this.image0.height,
      },
    };

    this.render();
  }

  render() {
    if (this.loopCount === 0) {
      ctx.drawImage(this.image0, this.dx, this.dy);
    } else if (this.loopCount === 1) {
      ctx.drawImage(this.image1, this.dx, this.dy);
    } else {
      ctx.drawImage(this.image2, this.dx, this.dy);
    }
  }
}

let bg = null;
let land = null;
let bird = null;

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bg = new Bg();
  land = new Land();
  bird = new Bird();
  pipeList = [];
  render();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bg.update();
  land.update();
  bird.update();

  pipeList.forEach((item) => {
    item.update();
  });
  animationId = requestAnimationFrame(render);

  if (bird.dy >= canvas.height * 0.8 - bird.image0.height + 10) {
    gg();
  }
  pipeList.forEach((item) => {
    if (
      bird.birdCoord.bl.x >= item.upCoord.tl.x - 35 &&
      bird.birdCoord.bl.x <= item.upCoord.tr.x &&
      bird.birdCoord.bl.y >= item.upCoord.tl.y + 10
    ) {
      gg();
    } else if (
      bird.birdCoord.tl.x >= item.downCoord.bl.x - 35 &&
      bird.birdCoord.tl.x <= item.downCoord.br.x &&
      bird.birdCoord.tl.y <= item.downCoord.bl.y - 10
    ) {
      gg();
    }
  });
}
function gg() {
  cancelAnimationFrame(animationId);
  clearInterval(addPipeTimer);
  restartBtn.style.display = "block";
  pauseBtn.style.display = "none";
  scoreEl.style.display = "none";
  totalScoreEl.innerHTML = `总分：${score}`;
  totalScoreEl.style.display = "block";
  const ggImage = new Image();
  ggImage.src =
    "http://www.jwhupup.cn/flappy-bird/assets/images/text_game_over.png";
  ggImage.onload = () => {
    ctx.drawImage(
      ggImage,
      canvas.width / 2 - ggImage.width / 2,
      (canvas.height / 2) * 0.618
    );
  };
}
