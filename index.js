// Initialize colour list
var colourList = new ColourList(document.getElementById("colour-list"));

colourData.forEach(function(colour){
	colourList.add(colour);
})

// Initialize self-organizing map
var som = new SOM("canvas", {row: 50, col: 100}, colourData, identity, 0.08, 150);

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

document.getElementById("refresh").addEventListener("click", function(){
	som.animate = false;
});