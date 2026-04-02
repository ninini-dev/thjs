function randomPos(){
    return {x: Math.floor(Math.random()*300), y:Math.floor(Math.random()*300)}
}

class EnemySystem{
    img=new Image();
    map=new Map();   
    x=[];
    y=[]; 
    hp=[];

    mapAdd(pos,value){
        if(this.map.has(pos)) this.map.get(pos).push(value);
        else this.map.set(pos,[value]);
    }
    
    add(x,y,hp){    
        this.x.push(x);
        this.y.push(y);
        this.hp.push(hp);
    }
    remove(i){
        this.x[i]=this.x.at(-1);
        this.y[i]=this.y.at(-1);
        this.hp[i]=this.hp.at(-1);
        this.x.pop();
        this.y.pop();
        this.hp.pop();
    }
    
    t=0;
    update(delta) {
        if(this.x.length==0)return;
        this.map.clear();
        if(this.t<1) this.t+=1/120;
        for (let i = 0; i < this.x.length; ) {
            
            let nPos=bezierEase(
                {x:50,y:120},
                {x:150,y:360},
                {x:150,y:120},
                {x:2,y:360},
                this.t
            );
            this.x[i]=nPos.x; this.y[i]=nPos.y;
            let ePos={x:this.x[i],y:this.y[i]};
            
            this.hp[i]-=plSys.mapCol(ePos);
            if(this.hp[i]<=0){
                this.remove(i);
                continue;
            }
            this.mapAdd(posToHash(ePos),i);
            
            ctx.drawImage(this.img,0,256,32,32,ePos.x-16,ePos.y-16,32,32);

            i++;
        }
    }
}