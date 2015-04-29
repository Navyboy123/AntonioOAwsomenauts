game.GameTimerManager = Object.extend ({
    init: function (x, y, settings){
        this.now = new Date ().getTime();
        this.lastCreep = new Date() .getTime();
        this.paused= false;
        this.alwaysUpdate = true; 
    },
    
    update:function(){
        this.now = new Date() .getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();
   
        return true;
    },
    
    goldTimerCheck: function(){
         if(Math.round(this.now/1000) %20 ===0 && (this.now - this.lastCreep >=1000)){
          game.data.gold +=1;
          console.log("Current Gold:" + game.data.gold);
          // when ever the player gets a kill he recieves a certain ammount of exp. 
          //logs  for the current ammount of gold the player currently has.
          
        }
    },
    
    creepTimerCheck: function(){
          if(Math.round(this.now/1000) %10 ===0 && (this.now - this.lastCreep >=1000)){
            this.lastCreep = this.now;
            var creep = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creep,5);
            //puts a timer on the creeps and incriments on when they wiill spawn
        }
    }
});

game.heroDeathManager = Object.extend({
   init: function(x, y, settings) {
        this.alwaysUpdate = true; 
   },  
   
   update: function(){
           if(game.data.player){
             me.game.world.removeChild(game.data.player);
            me.state.current().resetPlayer(10,0);
        }
   }
});

game.ExperienceManager = Object.extend({
   init: function (x, y, settings){
      this.alwaysUpdate = true; 
      this.gameOver = false;
   } ,
   //says "if you destroy the other base then the game will end. Or if your base if destroyed then the game will end.
   update: function (){
       if(game.data.win === true && !this.gameOver){
         this.gameOver(true);
       }else if (game.data.win === false && !this.gameOver){
           this.gameOver(false); 
       }
       return true;
   },
   //lets the player know that the game is over. 
   gameOver: function(win){
       if(win){
           game.data.exp +=10;
       }else{
           game.data.exp +=1;
       }
           this.gameOver = true;
           me.save.exp = game.data.exp;
   }
});
