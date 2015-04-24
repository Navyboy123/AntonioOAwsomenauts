game.SpendExp = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('exp-screen')), -10); // TODO
 
                me.game.world.addChild(new(me.Renderable.extend({
                    inti:function(){
                        this._super(me.Renderable, 'init', [270, 240, 300, 50 ])
                        this.font = new me.Font("Arial", 46, "White");
                    },
                    
                    draw:function(renderer){
                        this.font.draw(renderer.getContext(),"Press F1-F4!", this.pos.x , this.pos.y);  
                        this.font.draw(renderer.getContext(), "CURRENT EXP:" + game.data.exp.toString(), this.pos.x, this.pos.y + 100);
                    }
                    
                })));
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		
	}
}) 


