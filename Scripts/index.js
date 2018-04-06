// Initialize self-organizing map
var som = new SOM("canvas", {row: 50, col: 100}, colourData, identity, 0.08, 200);

// Initialize colour list
var colourList = new ColourList("colour-list", som);

colourData.forEach(function(colour){
	colourList.add(colour);
})

// Initialize event listners
document.getElementById("play-button").addEventListener("click", function(){
	som.startSOM();
})

window.onresize = function(){
	som.resize();
}

document.getElementById("add-button").addEventListener("click", function(){
	var newColour = parseRGB(document.getElementById("add-input").style.backgroundColor);
	colourList.add(newColour);
});

document.getElementById("menu-restart").addEventListener("click", function(){
	som.restart(colourList.getColours());
});

document.getElementById("menu-instructions").addEventListener("click", function(){
	var instructions = document.getElementById("instructions");
	var instructionsText = document.getElementById("instructions-text");

	instructions.style.height = "75%";
	instructions.style.border = "5px solid #333";
	instructionsText.style.overflowY = "scroll";
});

document.getElementById("instructions-close").addEventListener("click", function(){
	var instructions = document.getElementById("instructions");
	var instructionsText = document.getElementById("instructions-text");

	instructions.style.height = "0";
	instructions.style.border = "none";
	instructionsText.style.overflowY = "hidden";
})