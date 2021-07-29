var map = 
{
	ctx: null,
	canvas: null,
	hills: [],
	terrain: [],
	course_points: [
		[50, 50],
		[50, 50],
		[600, 60],
		[750, 325],
		[825, 90],
		[975, 40],
		[900, 550],
		[950, 720],
		[700, 690],
		[730, 370],
		[530, 170],
		[130, 250],
		[60, 700],
		[250, 650],
		[520, 630],
		[400, 320]
	],
	
	draw: function()
	{
		var ctx = this.ctx;
		var canvas = this.canvas; //1024 x 768
		
		//draw the background
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//draw the course
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(this.course_points[0][0], this.course_points[0][1]);
		
		for (let p = 1; p < this.course_points.length; p += 1);
		{
			console.log("p: " + p); //why doesn't this work?
			ctx.lineTo(
				this.course_points[p][0],
				this.course_points[p][1]);
		}
		ctx.stroke();
	},
	
	setup: function()
	{
		this.canvas = $("#gameCanvas")[0];
		this.ctx = this.canvas.getContext('2d');
		
		//uphill and downhill each constitute 20% of the 8000m course: 1600m
		//a single hill may constitute between 200 and 1000 meters
		var uphill_count = 1600;
		var downhill_count = 1600;
		var hill_indexes = [];
		while (uphill_count > 0)
		{
			var new_hill = {type: "up"};
			new_hill.length = Math.round(Math.random()*16)*50 + 200 // (0 <= length <= 16) * 50 + 200 = 200 <= length <= 1000
			if (new_hill.length > uphill_count) { new_hill.length = uphill_count; }
			uphill_count -= new_hill.length;	
			hill_indexes.push(this.hills.length);
			this.hills.push(new_hill);
		}
		while (downhill_count > 0)
		{
			var new_hill = {type: "down"};
			new_hill.length = Math.round(Math.random()*16)*50 + 200 // (0 <= length <= 16) * 50 + 200 = 200 <= length <= 1000
			if (new_hill.length > downhill_count) { new_hill.length = downhill_count; }
			downhill_count -= new_hill.length;
			hill_indexes.push(this.hills.length);
			this.hills.push(new_hill);
		}
		
		var hill_progress = 0;
		while (hill_indexes.length > 0)
		{
			var hill_indexes_index = Math.floor(Math.random()*hill_indexes.length);
			var hill_index = hill_indexes[hill_indexes_index];
			
			var hill_slice = (8000-hill_progress)/hill_indexes.length - this.hills[hill_index].length;
			var hill_position = Math.floor(Math.random()*hill_slice);
			this.hills[hill_index].position = hill_progress + hill_position;
			hill_progress += hill_position + this.hills[hill_index].length;
			hill_indexes.splice(hill_indexes_index, 1);
		}
		
		//any given segment of the course consists of either sand, grass, or asphalt
		var terrain_progress = 0;
		var last_terrain_index = 0;
		while (terrain_progress < 8000)
		{
			var new_terrain = {};
			switch(last_terrain_index)
			{
				case 0:
					new_terrain.type = "grass";
					break;
				case 1:
					new_terrain.type = "sand";
				case 2:
					new_terrain.type = "asphalt";
			}
			
			new_terrain.length = Math.round(Math.random()*28)*50 + 200 // (0 <= length <= 28) * 50 + 200 = 200 <= length <= 1600
			
			if (new_terrain.length  + terrain_progress > 8000)
			{
				new_terrain.length = 8000 - terrain_progress;
				terrain_progress = 8000;
			}
			else
			{
				terrain_progress += new_terrain.length;
			}
			
			this.terrain.push(new_terrain);
			
			//randomly select a terrain type, excluding the current one
			last_terrain_index += 1;
			if (Math.random() > 0.5) { last_terrain_index += 1; }
			if (last_terrain_index > 2)
			{
				last_terrain_index -= 2;
			}
		}
	}
};