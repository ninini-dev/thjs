

var plImg=new Image();
plImg.src="res/pl00.png";

var btImg=new Image();
btImg.src="res/etama.png"

let enmSys=new EnemySystem();
enmSys.img.src="res/enemy.png"

let dropSys=new DropSystem();
dropSys.img.src="res/item.png"

let plSys=new PlBtSystem();

function main(){

//	ctx = canvas.getContext("2d");
//ctx=canvas.getContext('webgpu');
/*
    ctx.strokeStyle = "Blue";
    ctx.beginPath();
    ctx.arc(150, 240, 20, 0, Math.PI * 2);
    ctx.rect(150-20/2,120-20/2,20,20);
    ctx.stroke();
    console.log("xd");*/
    //alert("hi");
}
const keys = {
    ShiftLeft:false,
    ArrowRight:false,
    ArrowLeft:false,
    ArrowDown:false,
    ArrowUp:false,
    KeyZ:false,
    KeyX:false
};

function 
input(){
    var s=(keys["ShiftLeft"])?2.5:5;
    x += s*(keys["ArrowRight"]==true)-s*(keys["ArrowLeft"]==true);
    y += -s*(keys["ArrowDown"]==true)+s*(keys["ArrowUp"]==true);
    x=Math.min(x,canvas.width);
    y=Math.min(y,canvas.height);
    x=Math.max(x,0);
    y=Math.max(y,0);

    if(keys["KeyZ"]==true){
        const dir=randomDir();
        btSys.add(100,240,dir.x,dir.y,dir.a);
    }
    if(keys["KeyX"]==2){
        canvas.requestFullscreen();
    }
   Object.keys(keys).forEach(k => {
    if(keys[k]==2)
        keys[k] = true;
    });
}
// Update the 'keys' object on keydown and keyup events
document.addEventListener('keydown', (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }
    if(keys[e.code] == false)
        keys[e.code] = 2;
    
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});
var x=0
var y=0;
var sx=32;
var sy = 48;
var anim=0;
/*
function draw(){
    //ctx.beginPath();
    
    anim+=.25;
    anim%=7;
    
    ctx.drawImage(plImg,sx*Math.round(anim),0,sx,sy,x-16,y-24,sx,sy);
    //ctx.stroke();
}*/
function debugGrid(){
    ctx.strokeStyle = "Green";
    for (let i = 0; i < 300; i+=16) {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,480);
        ctx.stroke();
    }  
    for (let i = 0; i < 480; i+=16) {
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(300,i);
        ctx.stroke();
    } 
    ctx.strokeStyle = "Blue";
    ctx.fillStyle="Blue";
    ctx.moveTo(x,y);
    ctx.arc(x,y,4,0,2*Math.PI);
    ctx.fill(); 
    ctx.moveTo(0,0);
}
main();
plImg.onload=()=>{};
//
let btSys=new BulletSystem();

let lastTime=Date.now();
function gameLoop(){
    let timeStep=1/60;
    if(Date.now()-lastTime>timeStep){
        lastTime=Date.now();
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        input();
        //draw();
        //ctx.drawImage(btImg,0,32,16,16,150,240,16,16);
        btSys.update(1);
        if(btSys.mapCol({x,y})){
            
        }
        eventLoop();
        enmSys.update(1);
        plSys.update(1);
        dropSys.update(1);
        Renderer.rend();
        //debugGrid();
    }
    window.requestAnimationFrame(gameLoop); 
}
function loopInput(){
input();
window.requestAnimationFrame(loopInput); 
}
loopInput();
async function loader(){
    await Renderer.rendInit();
    window.requestAnimationFrame(gameLoop); 
}
loader();
