var game = 
{
	game_state: "setup",
	view: "map",
	loop_var: null,
	race_seconds_per_real_seconds: 15, //a 30-minute race takes 2 minutes of real time?
	
	setup: function()
	{
		race.setup();
		map.setup();
		coach.setup();
		this.draw();
		this.game_state = "paused";
	},
	draw: function()
	{
		map.draw();
		coach.draw();
	},
	start: function()
	{
		clearInterval(this.loop_var);
		this.loop_var = setInterval(function() {game.loop();}, 1000/60);  //60 fps
		this.game_state = "play";
	},
	loop: function()
	{
		if (this.game_state == "play")
		{
			race.elapsed_seconds += game.race_seconds_per_real_seconds/60;
			switch(this.view)
			{
				case "map":
					coach.move();
					map.draw();
					coach.draw();
					ui.draw();
					break;
				default:
					break;
			}
		}
		else
		{
			clearInterval(this.loop_var);
		}
	},
	click: function(event)
	{
		var mouse_x = event.offsetX;
		var mouse_y = event.offsetY;
		console.log("x coords: " + mouse_x + ", y coords: " + mouse_y);
		
		switch(this.view)
		{
			case "map":
				for (let i = 0; i < map.distance_markers.length; i += 1)
				{
					if (point_distance(map.distance_markers[i].x, map.distance_markers[i].y, mouse_x, mouse_y) <= 15)
					{
						coach.target_marker = map.distance_markers[i];
						i = map.distance_markers.length; //break out of the loop
						this.start();
					}
				}
				break;
			default:
				break;
		}
	},
}