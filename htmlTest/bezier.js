/*function bezierEase(p0,p1,p2,p3,t){
    let c=1-t;
    let x=c**3*p0.x+3*c*c*t*p1.x+3*c*t*t*p2.x+t**3*p3.x;
    let y=c**3*p0.y+3*c*c*t*p1.y+3*c*t*t*p2.y+t**3*p3.y;   
    return {x:x, y:y};
}*/
function bezierEase(ar,t){
    let c=1-t;
    let x=c**3*ar[0]+3*c*c*t*ar[2]+3*c*t*t*ar[4]+t**3*ar[6];
    let y=c**3*ar[1]+3*c*c*t*ar[3]+3*c*t*t*ar[5]+t**3*ar[7];   
    return {x:x, y:y};
}
const paths=new Int16Array (
    [
        50,120,   150,360,   150,120,   200,360,   1,
        200,360,   150,480,   150,120,   50,360,   2,
    ]
);
// SE ACTUALIZA