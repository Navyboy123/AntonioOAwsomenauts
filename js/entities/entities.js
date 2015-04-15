 game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.addAnimation();

        this.renderable.setCurrentAnimation("idle");
    },
    
     setSuper: function(x, y) {
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
    },
     
     setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastAttack = new Date().getTime();
    },
     
     setAttributes: function() {
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;

    },
     
     setFlags: function() {
        //keeps track of which direction your player is going
        this.facing = "right";
        this.dead = "false";
        this.attacking = "false";
    },
    
     addAnimation: function() {
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },
    
     update: function(delta) {
        this.now = new Date().getTime();

        this.dead = this.checkIfDead();

        this.checkKeyPressAndMove();

        this.setAnimation();

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;


   },
    
     checkIfDead: function() {
        if (this.health <= 0) {
            return true;
        }
        return false;
    },
    
     checkKeyPressAndMove: function() {
        if (this.attacking) {
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

        if (me.input.isKeyPressed("up") && !this.body.jumping && !this.body.falling) {
            this.body.jumping = true;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }
        this.attacking = me.input.isKeyPressed("right");
    },
    
     setAnimation: function() {
        if (me.input.isKeyPressed("attack")) {
            if (!this.renderable.isCurrentAnimation("attack")) {
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
        } else if (!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }
    },
    
     loseHealth: function(damage) {
        this.health = this.health - damage;
        console.log = ("this.health");
    },
    
     collideHandler: function(response) {
        if (response.b.type === 'EnemyBase') {
        } else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }
    },
    
     collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        console.log("xdif" + xdif + "ydif" + ydif);

        if (ydif < -40 && xdif < 70 && xdif > -35) {
            this.body.falling = false;
            this.body.vel.y = -1;
        } else if (xdif > -35 && this.facing === 'right' && (xdif < 0) && ydif > -50) {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x - 1;
        } else if (xdif < 70 && this.facing === 'left' && (xdif > 0)) {
            this.body.vel.x = 0;
            this.body.x = this.pos.x + 1;
        }

        if (this, renderable.isCurrentAnimmation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
            this.lastHit = this.now;
            response.loseHealth(game.data.playerAttack);
        }
    },
    
    collideWithEnemyCreep: function (response){
          var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
           
           this.stopMovement(xdif);
           this.checkAttack(xdif,ydif,response);
           
           if(this.checkAttack(xdif,ydif)){
               if(response.b.health <= game.data.playerAttack){
                    //when the creeps is killed adds one gold for the creep death
                    game.data.gold += 1;
                    console.log("Current Gold:" + game.data.gold);
                }
                    
                response.b.loseHealth(game.data.playerAttack);
            
           };
           
            if(this.checkAttack(xdif,ydif)){
               if(response.b.health <= game.data.playerAttack){
                    //when the creeps is killed adds one gold for the creep death
                    game.data.gold += 1;
                    console.log("Current Gold:" + game.data.gold);
                }
                    
                response.b.loseHealth(game.data.playerAttack);
            
           };
    },
    
     stopMovement: function(xdif){
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
    },
    
    checkAttack: function (xdif,ydif,response){
                  if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit>=game.data.playerAttackTimer
                   &&(Math.abs(ydif) <=40)&& 
                   (((xdif>0)&& this.facing==="left") || ((xdif<0)  && this.facing==='right'))
                   ){
                this.lastHit = this.now; 
                //if the creeps health is less than our attack then execute order if "if" statement
                   }    
    }
    
    
    
});









