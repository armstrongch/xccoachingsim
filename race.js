var race = 
{
	teams: ["red", "blue", "green", "yellow", "purple"],
	
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