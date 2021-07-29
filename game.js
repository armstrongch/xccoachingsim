var game = 
{
	state: "setup",
	
	setup: function()
	{
		race.setup();
		map.setup();
		coach.setup();
		this.draw();
		this.state = "paused";
	},
	draw: function()
	{
		map.draw();
		coach.draw();
	},
	start: function()
	{
		setInterval(this.loop, 17);  //approx 60 fps
	},
	loop: function()
	{
		
	},
	click: function(event)
	{
		var mouse_x = event.offsetX;
		var mouse_y = event.offsetY;
		console.log("x coords: " + mouse_x + ", y coords: " + mouse_y);
		
		switch(this.state)
		{
			case "paused":
				for (let i = 0; i < map.distance_markers.length; i += 1)
				{
					
				}
				break;
			default:
				break;
		}
	}
}