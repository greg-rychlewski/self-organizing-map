// Colour Functions
function sameColour(colour1, colour2){
	var keys = Object.keys(colour1);

	for (var i = 0; i < keys.length; i++){
		var key = keys[i];

		if (colour1[key] != colour2[key]){
			return false;
		}
	}

	return true;
}

function parseRGB(attr){
	var rgbArray = attr.replace(/[A-z]+|,+|\(|\)/g, "").split(" ");
	var keys = ["red", "green", "blue"];

	return rgbArray.reduce(function(colourObject, currComponent, index){
		var key = keys[index];
		colourObject[key] = parseInt(currComponent);
		
		return colourObject;
	}, {})
}

function RGBtoHex(colour){
	var keys = Object.keys(colour);

	return keys.map(function(key){
		var hex = Math.floor(colour[key]).toString(16)
		return hex.length == 1 ? "0" + hex : hex;
	}).reduce(function(accumulator, currValue){
		return accumulator + currValue;
	}, "#");
}

function HexToRGB(colour){
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colour);
    return {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16)
    } 
}

function identity(value){
	return value;
}

// Play button functions
function showPlayButton(){
	var playButton = document.getElementById("play-button");
	playButton.style.display = "inline";
}

function hidePlayButton(){
	var playButton = document.getElementById("play-button");
	playButton.style.display = "none";
}

// Node weight calculations
function randomNumsSumTo(n, sum){
	var partition = [sum];

	for (var i = 0; i < n; i++){
		var newBoundary = sum * Math.random();
		partition.push(newBoundary);
	}

	partition.sort();

	var nums = partition.map(function(num, i, array){
		if (i == 0){
			return num;
		}

		return num - array[i-1];
	});

	return nums;
}

function weightedSum(data, weight){
	var keys = Object.keys(data[0]);

	var weightedSum = keys.map(function(key){
		return data.reduce(function(accumulator, currVal, currIndex){
			return accumulator + (weight[currIndex] * currVal[key]);
		}, 0);
	}).reduce(function(newObject, currVal, currIndex){
		var key = keys[currIndex];
		newObject[key] = Math.floor(currVal);
		return newObject;
	}, {});

	return weightedSum;
}

function distance(a, b){
	var keys = Object.keys(a);
	var distSqSum = keys.map(function(key){
		return Math.pow(a[key] - b[key], 2);
	}).reduce(function(accumulator, currentValue){
		return accumulator + currentValue;
	});

	return Math.sqrt(distSqSum);
}

// Array manipulations
function flattenArray(nestedArray){
	var flatArray = [];
	var nRow = nestedArray.length;
	var nCol = nestedArray[0].length;

	for (var row = 0; row < nRow; row++){
		for (var col = 0; col < nCol; col++){
			flatArray.push(nestedArray[row][col]);
		}
	}

	return flatArray;
}