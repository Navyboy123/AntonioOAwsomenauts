game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
		me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title/screeen')), -10); // TODO
                
                me.input.bindKey(me.input.KEY.ENTER,"start");
                
                me.game.world.addChild(new(me.Renderable.extend({
                    inti:function(){
                        
                    },
                    
                    draw:function(){
                        
                    }
                })));
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		; // TODO
	}
});
