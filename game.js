var game = 
{
	setup: function()
	{
		race.setup();
		map.setup();
		this.draw();
	},
	draw: function()
	{
		map.draw();
	},
	start: function()
	{
		setInterval(this.loop, 17);  //approx 60 fps
	},
	loop: function()
	{
		
	}
}