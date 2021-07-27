var map = 
{
	hills: [],
	setup: function()
	{
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
		
	}
};