var ui =
{
	draw: function() {
		$('#clockP').text("Time Elapsed: " + this.get_time_string(race.elapsed_seconds));
	},
	get_time_string: function(seconds) {
		var temp_seconds = seconds;
		var temp_minutes = 0;
		while (temp_seconds >= 60)
		{
			temp_seconds -= 60;
			temp_minutes += 1;
		}
		var time_string = temp_minutes + ":";
		if (temp_seconds < 10)
		{
			time_string += "0";
		}
		time_string += temp_seconds.toFixed(2);
		return time_string;
	}
};