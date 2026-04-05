class DropSystem{
    img=new Image();
    x=[];// pos x
    y=[];// pos y
    a=[];// angle
    s=[];// falling speed
    d=[];// type
    
    add(x,y,type){
        this.x.push(x);
        this.y.push(y);
        this.a.push(0);
        this.s.push(-2);
        this.d.push(type);
    }

    remove(i){
        this.x[i]=this.x.at(-1);
        this.y[i]=this.y.at(-1);
        this.a[i]=this.a.at(-1);
        this.s[i]=this.s.at(-1);
        this.d[i]=this.d.at(-1);
        this.x.pop();
        this.y.pop();
        this.a.pop();
        this.s.pop();
        this.d.pop();
    }

    update(delta){
        for (let i = 0; i < this.x.length; ) {
            this.y[i]+=delta*this.s[i];
            this.s[i]=Math.min(this.s[i]+1/10,2);
            
            if(this.y[i]>496){
                this.remove(i);
                document.getElementById('score').textContent='Score: '+10;
                continue;
            }
            
            if((this.x[i]-x)**2+(this.y[i]-y)**2<1000){
                this.remove(i);
                continue;
            }

            const a=DROP_ASPECT_DATA[this.d[i]];
            
            ctx.translate(this.x[i],this.y[i]);
            ctx.rotate(this.a[i]);
            ctx.drawImage(
                this.img,
                a.x, a.y,
                a.w, a.w,
                -a.w/2,
                -a.w/2,
                a.w, a.w
            );
            ctx.rotate(-this.a[i]);
            ctx.translate(-this.x[i],-this.y[i]);

            i++;
        }
    }
}

const DropType = Object.freeze({
    POWER_UP: "PowerUp",
    HP_FRAG: "HpFrag",
    HP_UP: "HpUp",
    BOMB_FRAG: "BombFrag",
    BOMB_UP: "BombUp",
    FULL: "Full",
    POWER: "Power",
    FAITH: "Faith"
});

const DROP_ASPECT_DATA = Object.freeze({
    [DropType.POWER_UP]:{x:0, y:0, w:32},
    [DropType.HP_FRAG]:{x:32, y:0, w:32},
    [DropType.HP_UP]:{x:64, y:0, w:32},
    [DropType.BOMB_FRAG]:{x:96, y:0, w:32},
    [DropType.BOMB_UP]:{x:128, y:0, w:32},
    [DropType.FULL]:{x:160, y:0, w:32},
    [DropType.POWER]:{x:192, y:0, w:16},
    [DropType.FAITH]:{x:208, y:0, w:16},
});

const drops=[
    [
    {type:DropType.FAITH, amount:5, rmin:10,rmax:20},
    {type:DropType.POWER, amount:5, rmin:0,rmax:10}
    ]
]
