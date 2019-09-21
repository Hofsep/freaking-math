/* GLOBAL VARIABLES */
var variables = {
  min: 1,
  max: 10,
  leftNumber: 1,
  rightNumber: 2,
  result: true,
  score: -1,

  timeLimit: 1500,
  gameOver: false,
  timeOutId: undefined,

  mute: 1
}

/* ELEMENTS TO CHANGE DURING THE GAME */
var elements = {
  // add listeners
  correctButton: document.getElementById('correct'),
  incorrectButton: document.getElementById('incorrect'),
  playAgainButton: document.getElementById('play-again'),

  // create display to refresh
  numbers: document.getElementById('numbers'),
  result: document.getElementById('result'),
  score: document.getElementById('score-display'),

  // display the score board
  gameOverDisplay: document.getElementById('game-over-display'),
  currentScore: document.getElementById('current-score'),
  highScore: document.getElementById('high-score'),

  // timer refresh
  timer: document.getElementById('timer'),

  // get the container to change the colour of it
  container: document.getElementById('container'),

  // get the img element to change it dynamically
  img: document.getElementById('check-answer'),

  // display
  display: document.getElementById('display'),

  // Mute button
  mute: document.getElementById('mute')
}





/* RUN THE GAME */
window.onload = function(){

  elements.mute.addEventListener('click', muteSound)
	elements.correctButton.addEventListener('click', checkIfCorrect)
  elements.incorrectButton.addEventListener('click', checkIfIncorrect)
  // for some reason, can't reload page within the listener. 
  elements.playAgainButton.addEventListener('click', refreshPage)
  // Change background colour to a random colour
  elements.container.style['background-color'] = getRandomColor()
  generate()
}
function refreshPage () {
  window.location.reload()
}



/* BUTTONCLICK SECTION */
function checkIfCorrect () {
  if (variables.result) {
    playCorrect()
    generate()
    refreshTimer()
  } else {
    elements.img.src = 'resources/wrong.png'
    finish()
  }
}
function checkIfIncorrect () {
  if (variables.result) {
    elements.img.src = 'resources/right.png'
    finish()
  } else {
    playCorrect()
    generate()
    refreshTimer()
  }
}



/* GENERATING THE VARIABLES FOR THE DISPLAY */
function generate(){

  // increase difficulty after it scored over 10 points
  if(variables.score > 10) {
    variables.max = Math.ceil(variables.score / 5) * 5
  }
  if(variables.score > 20){
    variables.min = Math.ceil(variables.score / 10) * 5
  }

  variables.leftNumber = getRandomNumber(variables.min, variables.max)
  variables.rightNumber = getRandomNumber(variables.min, variables.max)
  variables.result = getRandomBoolean()
  variables.score++
  refreshNumbers()
}

/* REFRESH UI AFTER GENERATING IS DONE */
function refreshNumbers () {
  elements.score.innerHTML = variables.score
  elements.numbers.innerHTML = variables.leftNumber + ' + ' + variables.rightNumber

  elements.result.innerHTML = (function () {
    var sum = variables.leftNumber + variables.rightNumber
    if (variables.result === true) {
      return '=' + sum
    } else {
      return '=' + (function () {
        var incorrectResult = sum
        while (true) {
          incorrectResult = getRandomNumber(variables.min, variables.max)
          if (incorrectResult != sum) {
            return incorrectResult
            break
          }
        }
      })()
    }
  })()

}



/* TIMER (Change variables in global. Make sure the css file is changed for visuals) */
function refreshTimer () {

  if (variables.timeOutId) {
    elements.timer.className = ''
    window.clearTimeout(variables.timeOutId)
  }
  startTimer()
}

function startTimer () {
  window.setTimeout(function () {
    elements.timer.className = 'active'
  }, 100)
  variables.timeOutId = window.setTimeout(function () {
    if (!variables.gameOver) {
      playIncorrect()
      finish()
    }
  }, variables.timeLimit)
}



/* WHEN THE GAME REACHES ITS END */
function finish(){

  // sound-effect
  playIncorrect()
  // Disable buttons, because we don't need them.
  elements.correctButton.disabled = true
  elements.incorrectButton.disabled = true
  window.setTimeout(displayGameOver,1500)
}

function displayGameOver(){
   // Get the display of current score and highscore
  elements.gameOverDisplay.className = ''
  variables.gameOver = true
  elements.currentScore.textContent = variables.score
  elements.highScore.textContent = getHighScore()
}




/* ADDING THE SOUND! */
function playCorrect(){
  if(variables.mute > 0){
    var audio = new Audio('resources/correct-answer.mp3');
    audio.play();
  }
}
function playIncorrect(){
  if(variables.mute > 0) {
    var audio = new Audio('resources/wrong-answer.mp3');
    audio.play();
  }
}

// function to mute the sound
/* to save the selected option, just save it in localStorage. */
function muteSound(){
  if(elements.mute.src.endsWith('resources/mute.png')){
    elements.mute.src = 'resources/mute-active.png'
    variables.mute = 0
  } else {
    elements.mute.src = 'resources/mute.png'
    variables.mute = 1
  }
}




/* HELPERS */
// Returns a random integer between min (included) and max (included)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Returns a random boolean
function getRandomBoolean () {
  return Math.random() >= 0.5
}
// Save highscore on localstorage
function getHighScore () {
  var highScore = window.localStorage.getItem('high-score')
  if( highScore && highScore > variables.score ){
    return highScore
  } else {
    window.localStorage.setItem('high-score', variables.score)
    return variables.score
  }
}
// Get Random colour for the background. Have to be a colour within the array.
//    Avoid colours which could make the text hard to read.
function getRandomColor () {  
  var colours = ['#349e72', '#c78a29', '#269bbd', '#b04600', '#DA70D6', '#76ab76']
  return colours[getRandomNumber(0, 5)]
}