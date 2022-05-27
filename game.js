const idHighscoreDiv = "#highscore"
const idCoinText = "#coinText"
const idCoinBtn = "#coinButton"
const idHudTable = "#player"
const idRefreshBtn = "#refreshBtn"

function getHighscoreTableHeader(){
	const headerRow = document.createElement('tr')

	const postd = document.createElement('td')
	postd.innerText = "Position"
	const usernametd = document.createElement('td')
	usernametd.innerText = "Username"
	const scoretd = document.createElement('td')
	scoretd.innerText = "Score"

	headerRow.appendChild(postd)
	headerRow.appendChild(usernametd)
	headerRow.appendChild(scoretd)

	return headerRow
}

function tossCoin()
{
	const r = Math.floor(Math.random() * 5000000) 
	return r
}

async function tryToAddScore(playerName,score)
{
	const res = await highscoreAPI.addScore(playerName,score).then((res)=>res)

	if(res === ResponseTypes.ScoreAdded)
	{
		alert("NEW SCORE")
	}
	else if(res === ResponseTypes.ScoreNotAdded)
	{
		alert("git gud")
	}
	else
	{
		alert("error")
	}
}

/**
 * 
 * @param {IScore} iscore 
 * @returns {HTMLTableRowElement}
 */
 function getScoreRow(iscore){
	const scoreElement = document.createElement('tr')

	const position = document.createElement('td')
	const name =  document.createElement('td')
	const score = document.createElement('td')

	position.textContent = iscore.position
	name.textContent = iscore.name
	score.textContent = iscore.score

	scoreElement.appendChild(position)
	scoreElement.appendChild(name)
	scoreElement.appendChild(score)

	return scoreElement
}

async function hudRefresh()
{
	hudTable.innerHTML = ""
	
	await highscoreAPI.getPlayerScore(playerName).then((res)=>{
		hudTable.appendChild(getHighscoreTableHeader())
		hudTable.appendChild(getScoreRow(res))
		console.log(res)
	})
}

async function getAllScores(){
	const scoreList = []
	return await highscoreAPI.getAllScores().then((scores)=>{
		for (let i = 0; i < scores.length; i++) {
			const element = scores[i];

			let score = getScoreRow(element)
		
			scoreList.push(score)
		}
		return scoreList
	})
}

async function refreshHighscore(){
	leaderboardTableElement.innerHTML = ""

	const leaderboard = document.querySelector("#highscore")

	leaderboardTableElement.appendChild(getHighscoreTableHeader())
	
	const scoreList = await getAllScores().then((res)=>{
		return res
	})

	for (let i = 0; i < scoreList.length; i++) {
		const row = scoreList[i]

		row.id = `a${i}`

		leaderboardTableElement.appendChild(row)
	}

	leaderboard.appendChild(leaderboardTableElement)
}

function refreshScreen()
{
	refreshHighscore().then(()=>{
		console.log("highscore refreshed")
	})

	hudRefresh().then(()=>{
		console.log("hud refreshed")
	})
}

function ping()
{
	fetch(`${highscoreAPI.apiURL}api/ping`).then((res) => {
		console.log(res.status)
    });
}

const highscoreAPI = new HighscoreSDK("https://192.168.56.110:3000/")

/**@type {HTMLParagraphElement } */
const coinText = document.querySelector(idCoinText)

/**@type {HTMLButtonElement} */
const coinBtn = document.querySelector(idCoinBtn)

/**@type {HTMLButtonElement} */
const refreshBtn = document.querySelector(idRefreshBtn)

const leaderboardTableElement = document.createElement('table')

/**@type {HTMLTableElement} */
const hudTable = document.querySelector(idHudTable)

const playerName = prompt("Insert your username")

coinBtn.addEventListener('click',(m)=>{
	let coin = tossCoin()
	coinText.textContent = `Coin: ${coin}`
	
	tryToAddScore(playerName,coin).then(()=>{
		refreshScreen()
	})
})

refreshBtn.addEventListener('click',(m)=>{
	refreshScreen()
})

ping()
