class Paddle {

    constructor(x, y, w, h) {
        this.pos = createVector(x, y);
        this.w = w;
        this.h = h;
        this.score = 0;
    }

    move(amt) {
        //TODO smooth this value
        this.pos.x = amt;
    }

    show() {
        noStroke();
        fill(255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }


}