class Event {
    constructor(hp, asp, x, y, b0, blen, amount, time, rep, d) {
        this.hp = hp;         
        this.asp = asp;       
        
        this.x = x;           
        this.y = y;

        this.b0 = b0;
        this.blen = blen; 
        
        this.time = time;
        this.rep = rep;       
        this.d = d;           
    }
}
eventLoop.time=0;
eventLoop.cur=0;
eventLoop.events=[
    new Event(4,EnemyAspect.TINY_GOLD,2,0,0,2,5,1,3,.5)
];
eventLoop.queue = [];
function eventLoop(){
    
    eventLoop.time+=1/60;
    if(eventLoop.time >= eventLoop.events[eventLoop.cur]){
        let event =eventLoop.events[eventLoop.cur];
        event.t=event.d;
        eventLoop.queue.push(event);
        eventLoop.cur++;
    }
    eventPlay();
}
function eventPlay(){
    for (let i = 0; i < eventLoop.queue.length;) {
        const e = eventLoop.queue[i];
        e.t+=1/60;
        if(e.t>=e.d){
            e.t=0;
            e.rep--;
            enmSys.add(e.x,e.y,e.hp,e.asp,e.blen,e.b0);
            
            console.log("EVENT");
        }
        if(e.rep<=0){
            eventLoop.queue.splice(i,1);
            continue;
        }
        i++;
    }
}

