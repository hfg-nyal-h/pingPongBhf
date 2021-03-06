class Ball {

    constructor(x, y, r, speed = 10) {
        this.spawn = createVector(x, y)
        this.speed = speed;
        this.r = r;
        this.resetball();
    }


    resetball() {
        this.pos = this.spawn.copy();
        let angle = random(-20, -10)
        this.vel = p5.Vector.fromAngle(angle, this.speed);
        if (random(1) > 0.5) this.vel.x *= -1;
    }

    outOfBounds() {
        //TODO die grenzen verschieben 
        // If the ball is out of the screen,
        // return the side, otherwise return false

        if (this.pos.y > height + this.r) {
            this.resetball();
            return 'right';
        }

        if (this.pos.y < -this.r) {
            this.resetball();
            return 'left';
        }

        return false;

    }


    hit(p1, p2) {
        for (let pad of[p1, p2]) {
            let padX = pad.pos.x;
            let padY = pad.pos.y;
            let ballX = ball.pos.x;
            let ballY = ball.pos.y;
            let r = this.r

            // if ball collides on x-axis
            //TODO Physics
            if ((padY - r) < ballY && ballY < (padY + pad.h + r)) {
                // and on y-axis
                if ((padX - r) < (ballX) && (ballX) < (padX + pad.w + r)) {
                    // ball collided

                    let padCenter = createVector(pad.pos.x + pad.w / 2, pad.pos.y + pad.h / 2)

                    // Vector from center of pad to center of ball
                    this.vel = this.pos.copy().sub(padCenter);
                    this.vel.limit(10);

                    // basically halve that angle so it points more to the center
                    let a = this.vel.heading();

                    if (a > -a && a < a) {
                        this.vel = p5.Vector.fromAngle(a / 2, 10);
                    } else {
                        this.vel.rotate(PI);
                        let a = this.vel.heading();
                        this.vel = p5.Vector.fromAngle(PI + a / 2, 10);
                    }

                }
            }
        }
    }

    update() {
        this.pos.add(this.vel);

        // bounce off top and bottom walls
        if (this.pos.x + this.r >= width || this.pos.x - this.r <= 0) {
            this.pos.x = constrain(this.pos.x, this.r, width - this.r);
            this.vel.x *= -1;
        }

    }

    show() {
        fill(255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }



}