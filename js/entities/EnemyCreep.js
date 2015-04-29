game.EnemyCreep = me.Entity.extend({
   init: function(x, y, settings){
       this._super(me.Entity, 'init', [x, y, {
         //set the height width and look of the creep
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
        //shows the health of the creep
        this.alwaysUpdate = true;
        //this.attacking lets up know if the enemy is currenly attacking
        this.attacking = false;
        //keeps track of when our creep lasts attacks anything 
        this.lastAttacking = new Date().getTime(); 
        this.lastHit = new Date().getTime();
        //keeps track of last time creep hit anything.
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);
        
        this.type = "EnemyCreep";
        //sets the animation for the creeps walking
        this.renderable.addAnimation("walk", [3, 4, 5],80);
        this.renderable.setCurrentAnimation("walk");
        
 },
 
 lostHealth:function (damage) {
   this.health = this.health - damage; 
   // says if the creep is hit then it will begin to loose health.
 },
   
   update: function(delta) {
       console.log(this.health);
       //says that if the creeps health hits zero then the creep will dpssappear. 
       if(this.health <= 0){
           me.game.world.removeChild(this);
       }
        
       this.now = new Date().getTime();
       
         this.body.vel.x -= this.excell.x * me.timer.tick;
       
       me.collision.check(this, true, this.collideHandeler.bind(this) ,true);
       //checks to make sure that the creeps will collide with all objects that it may happen to run into.
       
       
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