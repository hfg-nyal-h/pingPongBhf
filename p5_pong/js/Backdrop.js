let textOffsetX = 50;
let textOffsetY = 10;

function backdrop() {

    stroke(80)
    strokeWeight(8);

    let dottedLength = 20;

    let x = dottedLength / 2;

    while (x < width) {
        line(x, height / 2, x + dottedLength, height / 2);
        x += dottedLength * 2;
    }

    textFont(retroFont);
    textSize(100);
    noStroke();
    fill(80);

    textAlign(RIGHT, TOP);
    text(p1.score, width / 2 - textOffsetX, textOffsetY);

    textAlign(LEFT);
    text(p2.score, width / 2 + textOffsetX, textOffsetY);

}