function bezierEase(p0,p1,p2,p3,t){
    let c=1-t;
    let x=c**3*p0.x+3*c*c*t*p1.x+3*c*t*t*p2.x+t**3*p3.x;
    let y=c**3*p0.y+3*c*c*t*p1.y+3*c*t*t*p2.y+t**3*p3.y;   
    return {x:x, y:y};
}
// SE ACTUALIZA