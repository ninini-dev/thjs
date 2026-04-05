function p(id) {
    return document.getElementById(id).value;
}
function circ(x,y){
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);

    ctx.strokeStyle = 'red';
    ctx.stroke();
}
function line(x0,y0,x1,y1){
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.lineWidth = 1; 
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
let drag_point = -1;
function editorMouse(){
    canvas.onmousedown = function(e) {
    let pos = getPosition(e);
    drag_point = getPointAt(pos.x, pos.y);
    if (drag_point == -1) {
        points.push(pos);
        redraw();
    }
    };
    canvas.onmousemove = function(e) {
    if (drag_point != -1) {
        let pos = getPosition(e);
        points[drag_point].x = pos.x;
        points[drag_point].y = pos.y;
        redraw(); 
    }
    };
    canvas.onmouseup = function(e) {
    drag_point = -1; 
    };

}
function editor(){
    circ(p("b0x"), p("b0y"));
    circ(p("b1x"), p("b1y"));
    circ(p("b2x"), p("b2y"));
    circ(p("b3x"), p("b3y"));
    line(p("b0x"), p("b0y"),p("b1x"), p("b1y"));
    line(p("b2x"), p("b2y"),p("b3x"), p("b3y"));
    ctx.beginPath();
    ctx.moveTo(p("b0x"), p("b0y")); // Start point (P0)
    ctx.bezierCurveTo(
        p("b1x"), p("b1y"),
        p("b2x"), p("b2y"),
        p("b3x"), p("b3y")); // P1, P2, and End point (P3)
    ctx.moveTo(0,0);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    
    window.requestAnimationFrame(editor); 
}
    window.requestAnimationFrame(editor); 