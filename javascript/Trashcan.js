var Trashcan = Ext.extend(Ext.Panel, 
{
    // @privat
    initComponent: function() 
	{
	   Trashcan.superclass.initComponent.call(this);
	},

    /*
    afterRender: function()
    {
        Ext.Panel.superclass.afterRender.call(this);
        
        this.dropObj = new Ext.util.Droppable(this.getEl(), {
            validDropMode: 'intersect',
            listeners: {
                drop: function(droppable, draggable, e) {
                    console.log("droppend");
                   //draggable.el.setHTML("Drble");
                }
            }
        });
        this.relayEvents(this.dropObj, ['drop', 'dropactivate' ,'dropdeactivate', 'dropenter','dropleave']);
    },
    */
});

Ext.reg('Trashcan', Trashcan);