game.EnemyBaseEntity = me.Entity.extend ({
   init:  function (x, y, settings){
       this._super(me.Entity, 'init', [x, y, {
               image: "tower",
               width:100,
               height:100,
               spriteheight:"100",
               spritewidth:"100",
               getShape:function(){
                   return (new me.Rect(0, 0, 100, 70)).toPolygon();
               }
            }]);
        this.broken =false;
        this.health =game.data.enemyBaseHelth; 
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        
        this.type = "EnemyBase";
   
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");
        },
    //sets the animation for when the enemybase if broken
    //also lets the game know if the game has ended
    update:function(delta){
        if(this.health<=0){
            this.broken = true;
            this.renderable.setCurrentAnimation("broken"); 
        }
        this.body.update(delta);
        
        this._super(me.Entity, "update", [delta]);
        return true; 
    },
    
    onCollision: function () {
        
             
    },
    
    loseHealth: function() {
        this.health--;
        //sets for if the enemy base is hit it begins to loose health
    }
    
});


