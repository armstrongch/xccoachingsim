var runners = [];

function new_runner()
{
	return {
		id: runners.length,
		team: "none",
		base_speed: 4.4, //costs 1 energy per second to move this many meters
		base_energy: 1820, //start the race with this much energy
		current_energy: 0, //set this during race setup
		current_position: 0, //meters covered so far
		accel_cost: 1, //costs this much energy to run 1 additional meter per second
		recovery_pace: 2.4, //run at this speed to recover 1 energy per second
		pack_bonus: 0.1, ///reduce energy consumption per second when running with a pack
		hill_reduction: 1, //cover this many fewer meters per second when running uphill
		hill_bonus: 1 //cover this many more meters per second when running downhill
	}
}

function mutate_runner(index)
{
	
	var mutations = ["base_speed", "base_energy", "accel_cost", "recovery_pace", "pack_bonus", "hill_reduction", "hill_bonus"];
	var mutation_max_values = [0.3, 200, -0.1, 0.3, 0.1, -0.2, 0.2];
	
	var positive_mutation_index = Math.floor(Math.random()*mutations.length);
	var negative_mutation_index = positive_mutation_index + Math.ceil(Math.random()*(mutations.length-1));
	if (negative_mutation_index > mutations.length - 1)
	{
		negative_mutation_index -= mutations.length;
	}
	
	var mutation_value = Math.random();
	
	runners[index][mutations[positive_mutation_index]] += mutation_value*mutation_max_values[positive_mutation_index];
	runners[index][mutations[negative_mutation_index]] -= mutation_value*mutation_max_values[negative_mutation_index];
}

function draw_dude(x, y, fillStyle, radius)
{
	var ctx = map.ctx;
	ctx.fillStyle = fillStyle;
	
	ctx.beginPath();
	ctx.arc(x, y-radius, radius, 0, Math.PI*2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x-radius, y+radius*2);
	ctx.lineTo(x+radius, y+radius*2);
	ctx.fill();
}

/*
race is 8000 meters
the average runner should finish in 30 minutes
the average runner should cover 8000/30/60 = 4.4 meters per second

every second of running should use 1 energy
the average runner should start with 8000/4.4 energy = 1820

the average runner's accel cost is 1
1 eps to run 4.4m
2 eps to run 5.4m
cover 8000m in 30 min for 1820 energy
cover 8000m in 24.7 min for 3240 energy

the average runner's accel cost is 3.4
cover 4000m in 12.35 min for 1820 energy
alternate running 4.4 and 2.4 mps for the remaining 4000 m in 19.6 minutes, finishing in 32+ minutes

*/