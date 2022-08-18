//Init eerst objecten ooanfh van # iteraties van het spel

var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];
var gameHasStarted = false;
var iLevel = 0;

function nextSequence() {
  return Math.floor(Math.random() * 4);
}

function doFlashing() {
  $("#" + randomChosenColour).fadeOut(tInterval / 2);
  $("#" + randomChosenColour).fadeIn(tInterval / 2);
}

var randomChosenColour = buttonColours[nextSequence()];
gamePattern.push(randomChosenColour);

var tInterval = 1000;

var timerId = setInterval(doFlashing, tInterval); //globale variabele

function playSound(name) {
  return new Audio("sounds/" + name + ".mp3");
};

/* Definieer exit procedure. Opgelet, je moet cb-functie definiëren,
dus geen actuele parameters doorgeven want dan hebbn we we geen eventhandler
aangemaakt=> moet CB zijn!!!*/
// $(document).on("keydown",
//   function() {
//     clearInterval(timerId);
//   }
// );

//Andere mogelijkheid
//Begin
var toggleAnimation = function() {
  //  alert("" + event + "/" + timerId);
  if (gameHasStarted) {
    clearInterval(timerId); //Stop game; stop flashing
  } else {
    $("h1#level-title").text("Level " + iLevel);
  }
  gameHasStarted = !gameHasStarted;
}

function animatePress(currentColour) { //opdracht is dat kleur wordt meegegeven, NIET event!!!
  let selector = "div" + "#" + currentColour;
  $(selector).addClass("pressed");
  /*Methode 1 met bind bind()
Merk op dat het argument voor bind zonodig naar een object getransformeerd wordt, dus
bind (selector) werkt NIET omdat selector naar een object getransformeerd wordt zodat in de cb van
setTimeout this in  $(this) niet meer herkend wordt
  */
  setTimeout(function() {
    this.removeClass("pressed");
  }.bind($(selector)), 100);

  //2de methode met globale variabelen, minder goed
  // setTimeout(function() {
  //   $(selector).removeClass("pressed");
  // }, 100);
};


/*
bind is noodzakelijk in functiecall hieronder.
cfr uitleg van bind(thisArg, arg1,...,argN) in MDN== mozilla web pages
In bind(event, timerId) hieronder stelt event "this" voor die aan de
functie doorgegeven wordt, timerId wordt vanuit game.js doorgegeven. Merk op dat uit de defintie van toggleAnimation blijkt dat
event en timerId geen formele parameters zijn: er zijn er geen gedefinieerd voor de functie hetgeen dus betekent dat event en timerId
ofwel als  globale variabelen overgenomen worden ofwel via een andere binding die dan gegeven moet zijn.
Vandaar dus de noodzaak van ".bind" om het event door te geven dat via de context van $(document) opgepikt wordt
Als we bind niet genruiken wordt de functie toggleAnimation synchroon gecalled en is het dus geen callback gedefinieerd en is er dus ook
geen eventhandler gedefinieerd. Vandaar dat pagina niet reageert op "keydown"
Volgens doc van jquery best zo selectief mogelijk zijn met de $() variabele om query te versnellen
*/
$(document).on("keydown", toggleAnimation.bind(event, timerId));
//Einde

/* Declareer variabele zonder te initialiseren.Zelfs initialisatie naar "" is niet goed want dan wordt deze al
op de array userClickedPattern gepushed zonder dat er een event plaats vond in de push hieronder
Vergeet niet dat de eventhandler een callback routine is die enkel gecalled wordt als het event plaats gevonden
heeft. Vandaar beter eventhanhler in functie plaatsen en returnwaarde klaar
*/
var userChosenColour; // Dus globaal gedefinieerd

$("div.btn").on("click", function() {
  userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour); //pushen moet in eventhandler gebeuren want er worden geen statements meer uitgevoerd in game.js bij klikken van kleur indien niet gelooped wordt
  animatePress(userChosenColour);
  playSound(userChosenColour).play();
});