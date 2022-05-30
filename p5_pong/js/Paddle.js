class Paddle {

    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.score = 0;
    }

    move(amt) {
        this.pos.x += amt;
        this.pos.x = constrain(this.pos.x, 10, height - 10 - this.h);
    }

    show() {
        noStroke();
        fill(255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
        

}