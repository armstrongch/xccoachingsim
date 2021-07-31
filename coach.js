var coach =
{
	x: -1,
	y: -1,
	move_speed: -1,
	target_marker: null,
	setup: function() { //must be called after map.setup
		this.x = map.distance_markers[1].x;
		this.y = map.distance_markers[1].y;
		this.target_marker = map.distance_markers[1];
		this.move_speed = 3*map.pixels_per_meter/60*game.race_seconds_per_real_seconds; //3 meters per second
	},
	move: function() {
		if (point_distance(this.x, this.y, this.target_marker.x, this.target_marker.y) < this.move_speed)
		{
			this.x = this.target_marker.x;
			this.y = this.target_marker.y;
		}
		else
		{
			this.x = this.x + Math.cos(point_direction(this.x, this.y, this.target_marker.x, this.target_marker.y))*this.move_speed;
			this.y = this.y - Math.sin(point_direction(this.x, this.y, this.target_marker.x, this.target_marker.y))*this.move_speed;
		}
	},
	draw: function() {
		draw_dude(this.x, this.y, map.colors.team_white, 10);
	}
};

function point_distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

function point_direction(x1, y1, x2, y2) //radians
{
	return -1*Math.atan2(y2-y1, x2-x1);
}