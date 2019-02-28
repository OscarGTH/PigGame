// JavaScript Document  by Oskari Niskanen 428246

var position;
var cellAmount;
var rowSize;
var score;
var weight;
var timeout;
var potionActive = false;
const itemRefreshRate = 8;
const potionDroprate = 15;
var potionBarTimer;
var tablecounter = 0;
var potionTimer;

_addKeyListener('keydown', document, handleKeyboardEvent);
// Run this when user loads the page.
window.onload = function () {
	firstTime = true;
	rowSize = 3;
	createGameboard(3);
}
// Function creates the table layout.
function createGameboard (rowSize){
	tablecounter += 1;
	var table = document.createElement('TABLE');
	// Set the id for the table.
	table.setAttribute("id","table"+tablecounter);
	document.getElementById("tablesize").innerHTML = "Gameboard size is: " + rowSize + "x" + rowSize;
	document.getElementById("progressBar").value = 0;
	weight = 50;
	score = 0;
	stopTimeout();
	// Setting the score zero when new game is launched.
	document.getElementById("scorediv").innerHTML = score;
	// Setting weight 50 when new game is launched.
	document.getElementById("weightdiv").innerHTML = weight;
	var tableBody = document.getElementById("TBL");
	//	 Runs at the program start.
	if(firstTime == true){
		var tblB = document.createElement('TBODY');
		tblB.setAttribute("id","currentTable");
		table.appendChild(tblB);
		generateRows(rowSize,tblB);
		// Set the firstTime-flag false.
		firstTime = false;
	} else {
		// Remove old table.
		document.getElementById("currentTable").remove();
		var new_tbody = document.createElement('TBODY');
		new_tbody.setAttribute("id","currentTable");
		table.appendChild(new_tbody);
		generateRows(rowSize,new_tbody);
	}
	// Appending the created table into the div.
	tableBody.appendChild(table);
	cellAmount = ((table.rows.length) * (table.rows.length));
	populateTable();
	position = cellAmount;
	var player = document.getElementById("cell"+cellAmount);
	player.style.backgroundImage = "url(img/pigup.gif), " + "url(img/grass.png)";
	player.style.backgroundSize = "100% 100%";	
	player.className = "player";
	if(Number(tablecounter) > 1) {
		document.getElementById("table"+(tablecounter-1)).remove();
	}
}

// Populates the table with items.
function populateTable() {
	// Putting items on the grass.
	for(var index = 0; index < (+cellAmount/6); index++){
		var d = Math.floor((Math.random() * (+cellAmount)) + 1);
		var x = Math.floor((Math.random() * 6) +1);
		var rand = Math.floor((Math.random() * 10000));
		var cell = document.getElementById("cell"+(d));
		// Block the food items from spawning on top of the pig.
		if(cell.className != "player" && cell.classList.contains("point") != true){
			if(x == 1){
				cell.style.backgroundImage = "url(img/toast.png), " + "url(img/grass.png)";
				cell.className = "point toast";
			} else if(x == 2) {
				cell.style.backgroundImage = "url(img/toast.png), " + "url(img/grass.png)";
				cell.className = "point toast";
			} else if(x == 3) {
				cell.style.backgroundImage = "url(img/cherries.png), " + "url(img/grass.png)";
				cell.className = "point cherries";
			} else if(x == 4) {
				cell.style.backgroundImage = "url(img/cherries.png), " + "url(img/grass.png)";
				cell.className = "point cherries";
			} else if(x == 5){
				cell.style.backgroundImage = "url(img/burger.png), " + "url(img/grass.png)";
				cell.className = "point burger";
			} else if(rand <= (potionDroprate * 100)){
				cell.style.backgroundImage = "url(img/potion.png), " + "url(img/grass.png)";
				cell.className = "point potion";
				
			}
			//cell.classList.add("pointItem");
			cell.style.backgroundSize = "100% 100%";
			}
	}
	// Spawning more food items.
	timeout = setTimeout(populateTable, itemRefreshRate*1000);
}
// Generates the rows for the table.
function generateRows(rowSize,tableBody){
	counter = 0;
	for(var i = 0; i<rowSize; i++){
		var tr = document.createElement('TR');
		tableBody.appendChild(tr);
		
		 // Creating new cells on every line.
		for(var b = 0; b < rowSize; b++) {
			// Raise the id counter number.
			counter +=1;
			var td = document.createElement('TD');
			// Set the unique id for every cell.
			td.setAttribute("id","cell"+counter);
			tr.appendChild(td);
		}
	}
}
// Sets the player name.
function setName() {
	var name = prompt("Enter your name: ");
	if(name.length > 1){
		var playername = document.getElementById("namediv");
		playername.innerHTML = name;
	} else{
		alert("Name has to be atleast two characters long.");
	}
}
function setSize(){
	rowSize = prompt("Please, enter the size of the game board.");
	if(rowSize > 2 && rowSize < 19){
		createGameboard(rowSize);
	} else {
		alert("Please, enter size between 3 and 18.");
	}
}
// Moves the player.
function move(direction){
		var validDirection = false;
		if(direction == "up"){
			if(position > rowSize){
				// Setting up the id's.
				var fromId = "cell" + position;
				var toId = "cell" + (+position - +rowSize);
				// Moving the position up by one row.
				position -= +rowSize;
				validDirection = true;
				checkScore();
			}
		} else if(direction == "down"){
			if(+position < +(cellAmount-(+rowSize - +1))){
				var fromId = "cell" + position;
				var toId = "cell" + (+position + +rowSize);
				position += +rowSize;
				validDirection = true;
				checkScore();
			} 
		} else if(direction == "left"){
			// Check if the direction is valid.
			if(+position > 1 && (+position - +1) % +rowSize != 0){
				var fromId = "cell" + position;
				var toId = "cell" + (position - 1);
				position -= 1;
				validDirection = true;
				checkScore();
			}
		} else if(direction == "right"){
			// Checking for valid direction
			if(+position % +rowSize != 0){
				var fromId = "cell" + position;
				var toId = "cell" + (position + 1);
				position += 1;
				validDirection = true;
				checkScore();		
			}
		}
		
		if(validDirection == true){
			// Passing the id's to the image changer function.
			movePlayer(fromId,toId,direction);
		}
}

// Changes images of old and new cell.
function movePlayer(fromId,toId,direction){
	var oldCell = document.getElementById(fromId);
	var newCell = document.getElementById(toId);
	oldCell.style.backgroundImage = "url(img/grass.png)";
	oldCell.style.backgroundSize = "100% 100%";
	oldCell.className = "grass";
	newCell.style.backgroundImage = "url(img/pig"+direction+".gif), " + "url(img/grass.png)";
	newCell.style.backgroundSize = "100% 100%";
	newCell.className = "player";
	if(weight > 500){
			document.getElementById("scorediv").innerHTML = 500;
			alert("Pig got too fat. Game over.");		
			createGameboard(rowSize);
	}
}

//Updates the score if burger is in the next tile.
function checkScore(){
	var cellClass = document.getElementById("cell"+position).classList;
		if(cellClass.contains("burger") == true){
			score += 500;
			if(potionActive == false){
				weight += 30;
			}
		} else if(cellClass.contains("toast") == true){
			score += 250;
			if(potionActive == false){
				weight += 20;
			}
		} else if(cellClass.contains("cherries") == true ){
			score += 150;
			if(weight >= 50 && potionActive == false){
				weight -= 20;
			}
		} else if(cellClass.contains("potion") == true){
			// If old potion is still active, cancel their timers and start new.
			if(potionActive == true){
				clearTimeout(potionTimer);
				clearInterval(potionBarTimer);
			}
			potionActive = true;
			// Set 5 second timer for potion effect.
			potionTimer = setTimeout(endPotion, 5000);
			var timeleft = 5;
			potionBarTimer = setInterval(function(){
 			 document.getElementById("progressBar").value = 0 +  --timeleft;
  				if(timeleft <= 0)
   				 clearInterval(potionBarTimer);
			},1000);	
		}
		document.getElementById("weightdiv").innerHTML = weight;
		document.getElementById("scorediv").innerHTML = score; 
}
// Stores arrow key values.
var ArrowKey = {
  UP:     38,
  LEFT:   37,
  DOWN:   40,
  RIGHT:  39
};

// Adds keyListener.
function _addKeyListener(keyPressed, element, fn) {
  if (window.addEventListener) {
    element.addEventListener(keyPressed, fn, false);
  } else {
    element.attachEvent('on'+keyPressed, fn);
  }
}
// Handles arrow key movements.
function handleKeyboardEvent(keyPressed) {
  var keycode = keyPressed.keyCode || keyPressed.which;
  switch (keycode) {
    case ArrowKey.UP:
	move("up");
	break;
    case ArrowKey.DOWN:
    	move("down");
    	break;
    case ArrowKey.LEFT:
      	move("left");
      	break;
    case ArrowKey.RIGHT:
     	move("right");
      	break;
    case ArrowKey.DOWN:
     	move("down");
      	break;
    default:
      	break;
  }
}

function stopTimeout(){
	clearTimeout(timeout);
}
function endPotion(){
	potionActive = false;	
}

/* Credits for images
* Pig: Created by Daniel Eddeland (daneeklu) & Jordan Irwin (AntumDeluge); https://opengameart.org/node/11629
* Burger: https://piq.codeus.net/picture/427033/HAMBURGER
* Toast: https://piq.codeus.net/picture/58666/toast_and_egg_heart
* Cherries: opengameart.org
* Grass: https://piq.codeus.net/picture/293535/Grass-field 
*/
