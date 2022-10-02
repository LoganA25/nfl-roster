class nflApi {
	constructor() { }
	async getTeams() {
		const url =
			"https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";
		const response = await fetch(url);
		const json = await response.json();
		return json;
	}

	async getTeamID(teamNickName) {
		const teams = await this.getTeams();
		const teamsArray = teams.sports[0].leagues[0].teams;
		for (let object of teamsArray) {
			const team = object.team;
			if (teamNickName.toLowerCase() === team.nickname.toLowerCase()) {
				return team.id;
			}
		}
		return null;
	}

	async getTeamNickNames() {
		const teams = await this.getTeams();
		const teamArray = teams.sports[0].leagues[0].teams;
		const arrayOfNicknames = [];
		for (let i = 0; i < teamArray.length; i++) {
			const nickname = teamArray[i].team.nickname;
			arrayOfNicknames.push(nickname);
		}
		return arrayOfNicknames;
	}

	async getTeam(teamID, season) {
		const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${season}/teams/${teamID}?lang=en&region=us`;
		const response = await fetch(url);
		const json = await response.json();
		return json;
	}

	async getPlayers(teamID, season, limit = 100) {
		const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${season}/teams/${teamID}/athletes?limit=${limit}`;
		const response = await fetch(url);
		const json = await response.json();
		return json;
	}

}


