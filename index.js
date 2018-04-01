// Initialize self-organizing map
var som = new SOM("canvas", {row: 50, col: 100}, colourData, identity, 0.08, 150);

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
	var newColour = HexToRGB(document.getElementById("add-input").value);
	colourList.add(newColour);
});

document.getElementById("restart").addEventListener("click", function(){
	som.restart(colourList.getColours());
});