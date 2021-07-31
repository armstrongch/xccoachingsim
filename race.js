var race = 
{
	elapsed_seconds: 0,
	teams: ["team_red", "team_blue", "team_green", "team_white", "team_purple"],
	
	setup: function()
	{
		for (let t = 0; t < this.teams.length; t += 1)
		{
			for (let r = 0; r < 7; r += 1)
			{
				runners.unshift(new_runner());
				runners[0].team = this.teams[t];
				mutate_runner(0);
			}
		}
	}
}