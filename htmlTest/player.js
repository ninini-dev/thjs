class PlBtSystem{
    map=new Map();   
    x=[];
    y=[];    

    mapAdd(pos,value){
        if(this.map.has(pos)) this.map.get(pos).push(value);
        else this.map.set(pos,[value]);
    }

    mapCol(pos){
        
        let dmg=0;
        let hash=posToHash(pos);
        for (let i = -1; i < 2; i++) {
            for (let j = -1000; j < 2000; j+=1000) {
                
                let off=i+j;
                
                if(!this.map.has(hash+off))continue;
                for (let k = 0; k < this.map.get(hash+off).length;) {
                    
                    let btId=this.map.get(hash+off)[k];
                    
                    let distX=Math.abs(pos.x-this.x[btId]);
                    let distY=Math.abs(pos.y-this.y[btId]);

                    if(distX<16 && distY<16){
                        this.map.get(hash+off)[k]=this.map.get(hash+off).at(-1);
                        this.map.get(hash+off).pop();
                        this.remove(btId);
                        dmg++;
                        continue;
                    }
                     k++;
                } 
            }
        }

        return dmg;
    }

    add(x,y){
        this.x.push(x);
        this.y.push(y);
    }

    remove(i){
        this.x[i]=this.x.at(-1);
        this.y[i]=this.y.at(-1);
        this.x.pop();
        this.y.pop();
    }
    debug(i){
        ctx.strokeStyle = "Green";
        ctx.fillStyle="Green";
    
        
        ctx.rotate(Math.PI/2);
        ctx.beginPath();
        ctx.arc(this.x[i],this.y[i],10,0,2*Math.PI);
        ctx.fill(); 
        ctx.stroke();
    
        ctx.rotate(-Math.PI/2);
    }
    sh_delay=4;
    update(delta) {
        this.map.clear();
        const s=20;
    
        
        this.sh_delay--;
        if(this.sh_delay<=0){
            this.sh_delay=4;
            this.add(x-8,y);
            this.add(x+8,y);
        }

        Renderer.OFF_PL=enmSys.x.length;
        for (let i = 0; i < this.x.length; ) {
            
            this.y[i]+=delta*s;
            if(this.x[i]<-16 || this.x[i]>316){
                this.remove(i);
                continue;
            }
            if(this.y[i]<-16 || this.y[i]>496){
                this.remove(i);
                continue;
            }
            this.mapAdd(posToHash({x:this.x[i],y:this.y[i]}),i);
           
            Renderer.writeVBO([this.x[i],this.y[i],1,-Math.PI*.5],Renderer.OFF_PL+i)
            i++;
            
        }
        Renderer.OFF_DROP=Renderer.OFF_PL+plSys.x.length;
        Renderer.writeVBO([x,y,0,0],Renderer.OFF_DROP)
        Renderer.OFF_DROP++;

    }
}