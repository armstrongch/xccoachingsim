var map = 
{
	ctx: null,
	canvas: null,
	hills: [],
	terrain: [],
	course_points: [],
	course_segment_lengths: [],
	pixels_per_meter: -1,
	distance_markers: [],
	
	colors: {
		asphalt: "#0A0903",
		sand: "#FFFD82",
		tree: "#FF8200",
		grass: "#698F3F",
		tall_grass: "#386641",
		team_blue: "#0D00A4",
		team_red: "#BA1B1D",
		team_purple: "#A846A0",
		team_white: "#F6F8FF",
		team_green: "#59C9A5",
	},
	
	draw: function()
	{
		var ctx = this.ctx;
		var canvas = this.canvas; //1024 x 768
		
		//draw the background
		ctx.fillStyle = this.colors.sand;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		//draw the course
		ctx.fillStyle = this.colors.grass;
		ctx.beginPath();
		for (let p = 0; p < this.course_points.length - 1; p += 1)
		{
			ctx.arc(this.course_points[p][0], this.course_points[p][1],
					20, 0, Math.PI*2);
			
			var dir = point_direction(
				this.course_points[p][0], this.course_points[p][1],
				this.course_points[p+1][0], this.course_points[p+1][1]);
				
			ctx.moveTo(
				this.course_points[p][0] + Math.cos(dir+Math.PI/2)*20,
				this.course_points[p][1] - Math.sin(dir+Math.PI/2)*20);
			
			ctx.lineTo(
				this.course_points[p+1][0] + Math.cos(dir+Math.PI/2)*20,
				this.course_points[p+1][1] - Math.sin(dir+Math.PI/2)*20);
				
			ctx.lineTo(
				this.course_points[p+1][0] + Math.cos(dir-Math.PI/2)*20,
				this.course_points[p+1][1] - Math.sin(dir-Math.PI/2)*20);
			
			ctx.lineTo(
				this.course_points[p][0] + Math.cos(dir-Math.PI/2)*20,
				this.course_points[p][1] - Math.sin(dir-Math.PI/2)*20);
			ctx.lineTo(
				this.course_points[p][0] + Math.cos(dir+Math.PI/2)*20,
				this.course_points[p][1] - Math.sin(dir+Math.PI/2)*20);
		}
		ctx.fill();
		
		//draw the distance markers
		ctx.fillStyle = this.colors.tall_grass;
		ctx.beginPath();
		for (let i = 0; i < this.distance_markers.length; i += 1)
		{
			ctx.moveTo(this.distance_markers[i].x, this.distance_markers[i].y);
			ctx.arc(this.distance_markers[i].x, this.distance_markers[i].y, 15, 0, Math.PI*2);
		}
		ctx.fill();
	},
	
	setup: function()
	{
		this.canvas = $("#gameCanvas")[0];
		this.ctx = this.canvas.getContext('2d');
		
		this.course_points = this.get_course_points();
		
		this.pixels_per_meter = 0;
		for (let i = 1; i < this.course_points.length; i += 1)
		{
			var segment_distance = Math.sqrt(
				Math.pow(this.course_points[i-1][0] - this.course_points[i][0], 2)
				+ Math.pow(this.course_points[i-1][1] - this.course_points[i][1], 2));
			this.course_segment_lengths.push(segment_distance);
			this.pixels_per_meter += segment_distance;
		}
		this.pixels_per_meter = this.pixels_per_meter/8000;
		
		//km0 and mi0 markers
		this.distance_markers.push(
			{ segment_index: 0, pixels_along_segment: 0, x: this.course_points[0][0], y: this.course_points[0][1] }
		);
		
		for (let i = 0; i < 11; i += 1)
		{
			var distance_to_cover = 1000*this.pixels_per_meter;
			var previous_marker = this.distance_markers[i];
			
			if (i >= 7)
			{
				if (i == 7)
				{
					this.distance_markers.push(
						{ segment_index: 0, pixels_along_segment: 0, x: this.course_points[0][0], y: this.course_points[0][1] }
					);
				}
				distance_to_cover = 1600*this.pixels_per_meter;
				previous_marker = this.distance_markers[i+1];
			}
			
			var current_segment_index = previous_marker.segment_index;
			var segment_distance = this.course_segment_lengths[current_segment_index] - previous_marker.pixels_along_segment;
			while (distance_to_cover > segment_distance)
			{
				distance_to_cover -= segment_distance;
				current_segment_index += 1;
				segment_distance = this.course_segment_lengths[current_segment_index];
			}
			var new_marker = { segment_index: current_segment_index };
			if (current_segment_index == previous_marker.segment_index)
			{
				new_marker.pixels_along_segment = previous_marker.pixels_along_segment + distance_to_cover;
				//this is the case where 2 distance markers are on the same segment. make sure to test this, because it will rarely ever happen
			}
			else
			{
				new_marker.pixels_along_segment = distance_to_cover;
			}
			
			var segment_dir_radians = point_direction(
				this.course_points[current_segment_index][0],
				this.course_points[current_segment_index][1],
				this.course_points[current_segment_index+1][0],
				this.course_points[current_segment_index+1][1]);
				
			new_marker.x = this.course_points[current_segment_index][0] + Math.cos(segment_dir_radians)*new_marker.pixels_along_segment;
			new_marker.y = this.course_points[current_segment_index][1] - Math.sin(segment_dir_radians)*new_marker.pixels_along_segment;
			new_marker.type = "kilometer";
			new_marker.number = i;
			
			this.distance_markers.push(new_marker);
		}
		
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
	},
	get_course_points: function() {
		var canvas = this.canvas;
		var generated_points = [];
		
		for (let j = 0; j < 4; j += 1)
		{
			for (let i = 0; i < 10; i += 1)
			{
				var width = 30 + (i + Math.random())*(canvas.width-60)/10;
				if (j % 2 == 1)
				{
					width = canvas.width - width;
				}
				var height = 30 + (j + Math.random())*(canvas.height-60)/4;
				generated_points.push([width, height]);
			}
		}
		
		return generated_points;
	}
};