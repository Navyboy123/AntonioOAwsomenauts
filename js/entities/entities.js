 game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                    
                }
            }]);
        this.type = "PlayerEntity";
        this.health = game.data.playerHealth; 
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        //keeps track of where you character is facing// directional 
            this.facing = "right";
            this.now = new Date () .getTime();
            this.lastHit = this.now;
            this.dead = false;
            this.attack = game.data.playerAttack;
            this.lastAttack = new Date ().getTime();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack",[65 ,66 ,67 ,68 ,69 ,70 ,71 ,72],80);

        this.renderable.setCurrentAnimation("idle");
    },
    update: function(delta) {
        this.now = new Date .getTime();
        if (me.input.isKeyPressed("right")) {
            //sets the posisiton of my X by adding the velocity defined above if set velocioty and multiplying it by me.timer.tick//
            //makes the movement looks smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
             this.flipX(true);
        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
           this.flipX(false);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

        } else {
            this.body.vel.x = 0;
        }
        
         if (me.input.isKeyPressed ("up") && !this.body.jumping && !this.body.falling){
             this.body.jumping = true; 
             this.body.vel.y -= this.body.accel.y *me.timer.tick;
        }
                if (me.input.isKeyPressed("attack")){
            if(!this.renderable.isCurrentAnimation("attack")){
                //sets the current animation to attack and then returns to the idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //makes it so that the animation starts again it starts from the beginning animation
                //and not from the animmation that it was currently in 
                this.renderable.setAnimationFrame();
            }
        }
         else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if( !this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
        
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        
        
        
        this._super(me.Entity, "update", [delta]);
        return true;
        
       
    },
    
    loseHealth: function (damage){
      this.health = this.health - damage;
      console.log=("this.health");
    },
    
    collideHandler: function(response){
        if(response.b.type==='EnemyBase'){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            
            console.log("xdif" + xdif + "ydif" + ydif);      
            
            if(ydif<-40 && xdif< 70 && xdif>-35){
                this.body.falling= false;
                this.body.vel.y = -1;
            }else if(xdif>-35 && this.facing==='right' && (xdif<0) && ydif>-50){
               this.body.vel.x = 0;
                this.pos.x = this.pos.x -1; 
            }else if(xdif <70 && this.facing === 'left' && (xdif>0)){
               this.body.vel.x =0;
               this.body.x = this.pos.x +1; 
            }       
            
            if (this,renderable.isCurrentAnimmation ("attack") && this.now-this.lastHit>= game.data.playerAttackTimer){
                this.lastHit= this.now;
                response.loseHealth(game.data.playerAttack);
            }
        }else if (response.b.type==='EnemyCreep'){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            if(xdif>0){
                this.pos.x = this.pos.x=1;
                if(this.facing==='left'){
                    this.body.vel.x = 0;
                }
            }else{
                this.pos.x = this.pos.x - 1;
                if(this.facing==='right'){
                    this.body.vel.x = 0;
                }
            }
            
            if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit>=game.data.playerAttackTimer
                   &&(Math.abs(ydif) <=40)&& 
                   (((xdif>0)&& this.facing==="left") || ((xdif<0)  && this.facing==='right'))
                   ){
                this.lastHit = this.now; 
                //if the creeps health is less than our attack then execute order if "if" statement
                if(response.b.health <= game.data.playerAttack){
                    //when the creeps is killed adds one gold for the creep death
                    game.data.gold += 1;
                    console.log("Current Gold:" + game.data.gold);
                }
                    
                response.b.loseHealth(game.data.playerAttack);
            }
        }
    } 
    
});





game.EnemyCreep = me.Entity.extend({
   init: function(x, y, settings){
       this._super(me.Entity, 'init', [x, y, {
          image: "creep1",
          width: 32,
          height: 64,
          spritewidth: "32",
          spriteheight: "64",
          getShape: function () {
              return (new me.Rect(0, 0, 32, 64)) . toPolygon();
          }
        }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //this.attacking lets up know if the enemy is currenly attacking
        this.attacking = false;
        //keeps track of when our creep lasts attacks anything 
        this.lastAttacking = new Date().getTime(); 
        this.lastHit = new Date().getTime();
        //keeps track of last time creep hit anything.
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);
        
        this.type = "EnemyCreep"
        
        this.renderable.addAnimation("walk", [3, 4, 5,],80);
        this.renderable.setCurrentAnimation("walk");
        
 },
 
 lostHealth:function (damage) {
   this.health = this.health - damage;   
 },
   
   update: function(delta) {
       console.log(this.health);
       if(this.health <= 0){
           me.game.world.removeChild(this);
       }
        
       this.now = newDate().getTime();
       
         this.body.vel.x -= this.excell.x * me.timer.tick;
       
       me.collision.check(this, true, this.collideHandeler.bind(this) ,true);
       
       
        this.body.update(delta);
        
        
       
       
        this._super(me.Entity, "update", [delta]);
       return true;
        
   },
   
   collideHandler:function (response){
       if(response.b.type=='PlayerBase'){
           this.attacking=true;
           this.lastAttacking=this.now;
           this.body.vel.x=0;
           this.pos.x = this.pos.x + 1;
           if((this.now-this.lastHit >=1000))
               this.lastHit = this.now; 
           response.b.loseHealth(game.data.enemyCreepAttack);
           
       }
    else if (response.b.type==='PlayerEntity'){
        this.attacking=true;
           this.lastAttacking=this.now;
    
           if(xdif>0){
               this.pos.x = this.pos.x + 1; 
                this.body.vel.x=0;
                //keeps the creep to the right to maintain posistion
           }
           this.pos.x = this.pos.x + 1;
           if((this.now-this.lastHit >=1000)&& xdif>0)
               this.lastHit = this.now; 
           response.b.loseHealth(game.data.enemyCreepAttack);
   }
   }
});

