function posToHash(pos){
    return Math.round(pos.x/16)+Math.round(pos.y/16)*1000;
}
function randomDir(){
    const a=Math.random()*Math.PI*2;
    const dx=Math.cos(a);
    const dy=Math.sin(a);
    return {x:dx,y:dy,a:a};
}
class BulletSystem{
    map=new Map();   
    x=[];
    y=[];    
    dx=[];
    dy=[];
    a=[];

    mapCol(pos){
        
        let hash=posToHash(pos);
        for (let i = -1; i < 2; i++) {
            for (let j = -1000; j < 2000; j+=1000) {
                
                let off=i+j;
                
                if(!this.map.has(hash+off))continue;
                for (let k = 0; k < this.map.get(hash+off).length; k++) {
                    
                    let btId=this.map.get(hash+off)[k];
                    
                    let distX=Math.abs(pos.x-this.x[btId]);
                    let distY=Math.abs(pos.y-this.y[btId]);

                    if(distX<4 && distY<4){
                        this.remove(btId);
                        return true;
                    }
                } 
            }
        }

        return false;
    }

    mapAdd(pos,value){
        if(this.map.has(pos)) this.map.get(pos).push(value);
        else this.map.set(pos,[value]);
    }

    add(x,y,dx,dy,a){
        this.x.push(x);
        this.y.push(y);
        this.dx.push(dx);
        this.dy.push(dy);
        this.a.push(a+Math.PI/2);
    }
    remove(i){
        this.x[i]=this.x.at(-1);
        this.y[i]=this.y.at(-1);
        this.dx[i]=this.dx.at(-1);
        this.dy[i]=this.dy.at(-1);
        this.a[i]=this.a.at(-1);
        this.x.pop();
        this.y.pop();
        this.dx.pop();
        this.dy.pop();
        this.a.pop();
    }
    
    debug(i){
        ctx.strokeStyle = "Red";
        ctx.fillStyle="Red";
        ctx.moveTo(this.x[i],this.y[i]);
        ctx.arc(this.x[i],this.y[i],4,0,2*Math.PI);
        ctx.fill(); 
        ctx.moveTo(0,0);
    }
    update(delta) {
        this.map.clear();
        const s=1;
        //ctx.drawImage(btImg,0,16,16,16,100,240,16,16);
        for (let i = 0; i < this.x.length; ) {
            
            this.x[i]+=this.dx[i]*delta*s;
            if(this.x[i]<-16 || this.x[i]>316){
                this.remove(i);
                continue;
            }

            this.y[i]+=this.dy[i]*delta*s;
            if(this.y[i]<-16 || this.y[i]>496){
                this.remove(i);
                continue;
            }
            this.mapAdd(posToHash({x:this.x[i],y:this.y[i]}),i);
            /*
            ctx.translate(this.x[i],this.y[i]);
            ctx.rotate(this.a[i]);
            ctx.drawImage(btImg,0,16,16,16,-8,-8,16,16);
            ctx.rotate(-this.a[i]);
            ctx.translate(-this.x[i],-this.y[i]);
             */
            //this.debug(i);
            i++;
        }
    }
}


