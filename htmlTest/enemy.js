function randomPos(){
    return {x: Math.floor(Math.random()*300), y:Math.floor(Math.random()*300)}
}

class EnemySystem{
    img=new Image();
    map=new Map();   
    x=[];
    y=[]; 
    hp=[];
    t=[];
    pleft=[];
    pcur=[];
    asp=[];

    mapAdd(pos,value){
        if(this.map.has(pos)) this.map.get(pos).push(value);
        else this.map.set(pos,[value]);
    }
    
    add(x,y,hp,asp,pleft,pcur){    
        this.x.push(x);
        this.y.push(y);
        this.hp.push(hp);
        this.t.push(0);
        this.asp.push(asp);
        this.pleft.push(pleft);
        this.pcur.push(pcur);
    }
    remove(i){
        this.x[i]=this.x.at(-1);
        this.y[i]=this.y.at(-1);
        this.hp[i]=this.hp.at(-1);
        this.t[i]=this.t.at(-1);
        this.asp[i]=this.asp.at(-1);
        this.pleft[i]=this.pleft.at(-1);
        this.pcur[i]=this.pcur.at(-1);
        this.x.pop();
        this.y.pop();
        this.hp.pop();
        this.t.pop();
        this.asp.pop();
        this.pleft.pop();
        this.pcur.pop();
    }
    
    update(delta) {
        if(this.x.length==0)return;
        this.map.clear();
        for (let i = 0; i < this.x.length; ) {
            
            if(this.pleft[i]>0)
            if(this.t[i]<1) {
                this.t[i]+=1/60/paths[this.pcur[i]*9+8]; 
                let nPos=bezierEase(
                paths.slice(this.pcur[i]*9,this.pcur[i]*9+8),
                this.t[i]);
                this.x[i]=nPos.x; this.y[i]=nPos.y;
            }
            else {
                this.x[i]=paths[this.pcur[i]*9+6]; 
                this.y[i]=paths[this.pcur[i]*9+7];
                this.t[i]=0;
                this.pcur[i]++; 
                this.pleft[i]--;
            }
           
            let ePos={x:this.x[i],y:this.y[i]};
            
            this.hp[i]-=plSys.mapCol(ePos);
            if(this.hp[i]<=0){
                dropSys.add(this.x[i],this.y[i],DropType.HP_FRAG);
                this.remove(i);
                continue;
            }
            this.mapAdd(posToHash(ePos),i);
            const a=ENEMY_ASPECT_DATA[this.asp[i]];
            ctx.drawImage(this.img,a.x,a.y,a.w,a.h,ePos.x-a.w/2,ePos.y-a.h/2,a.w,a.h);

            i++;
        }
    }
}

const EnemyAspect = Object.freeze({
    TINY_BLUE:"tiny_blue",
    TINY_RED:"tiny_red",
    TINY_GREEN:"tiny_green",
    TINY_GOLD:"tiny_gold"
});

const ENEMY_ASPECT_DATA = Object.freeze({
    [EnemyAspect.TINY_BLUE]:{x:0, y:256, w:32, h:32},
    [EnemyAspect.TINY_RED]:{x:0, y:288, w:32, h:32},
    [EnemyAspect.TINY_GREEN]:{x:0, y:320, w:32, h:32},
    [EnemyAspect.TINY_GOLD]:{x:0, y:352, w:32, h:32},
});
