function SOM(canvasId, size, data, colourMap, initLearnRate, nIter){
	this.colourMap = colourMap
	this.data = data.slice();
	this.initLearnRate = initLearnRate;
	this.nIter = nIter;

	// Initialize node properties (size and weights)
	this.nodes = {};
	this.nodes.dimensions = {
		row: size.row,
		col: size.col
	};
	this.calcNodeLength();
	this.assignRandomWeights();

	// Initialize canvas
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext("2d");
	this.setCanvasSize();
	this.setCanvasOpacity(this.pauseOpacity);

	// Set initial update radius to cover entire grid
	this.initRadius = Math.max(this.nodes.dimensions.row, this.nodes.dimensions.col);

	// Colour the SOM
	this.colourNodes();
}

SOM.prototype.canvasScale = 0.8;

SOM.prototype.maxCanvasWidth = 800;

SOM.prototype.maxCanvasHeight = 350;

SOM.prototype.pauseOpacity = 0.7;

SOM.prototype.gridWidth = 0.2;

SOM.prototype.dataIndex = 0;

SOM.prototype.animation = null;

SOM.prototype.background = {red: 89, green: 89, blue: 89};

SOM.prototype.resize = function(){
	this.calcNodeLength();
	this.setCanvasSize();
	this.colourNodes();
}

SOM.prototype.restart = function(data){
	this.data = data.slice();
	this.assignRandomWeights();
	this.setCanvasOpacity(this.pauseOpacity);
	this.colourNodes();
	showPlayButton();
}

SOM.prototype.nextDataIndex = function(){
	this.dataIndex = (this.dataIndex + 1) % this.data.length;
}

SOM.prototype.indexToRowCol = function(index){
	var nCol = this.nodes.dimensions.col;
	var row = Math.floor(index / nCol);
	var col = index % nCol;

	return {"row": row, "col": col};
}

SOM.prototype.radius = function(t){
	var decayConstant = this.nIter / Math.log(this.initRadius);
	return this.initRadius * Math.exp(-t/ decayConstant);
}

SOM.prototype.learnRate = function(t){
	var decayConstant = this.nIter;
	return this.initLearnRate * Math.exp(-t / decayConstant);
}

SOM.prototype.neighbourhood = function(d, t){
	var stdev = this.radius(t);
	return Math.exp(-Math.pow(d, 2) / (2 * Math.pow(stdev, 2)));
}

SOM.prototype.setCanvasOpacity = function(newOpacity){
	this.canvas.style.opacity = newOpacity;
}

SOM.prototype.setCanvasSize = function(){
	this.canvas.width = this.nodes.length * this.nodes.dimensions.col;
	this.canvas.height = this.nodes.length * this.nodes.dimensions.row;
}


SOM.prototype.calcNodeLength = function(){
	var nRow = this.nodes.dimensions.row;
	var nCol = this.nodes.dimensions.col;

	var unadjustedCanvasWidth = Math.min(this.canvasScale * window.innerWidth, this.maxCanvasWidth);
	var unadjustedCanvasHeight = Math.min(this.canvasScale * window.innerHeight, this.maxCanvasHeight);
	
	var widthNodeLength = unadjustedCanvasWidth / nCol;
	var heightNodeLength = unadjustedCanvasHeight / nRow;

	this.nodes.length = Math.min(widthNodeLength, heightNodeLength);
}

SOM.prototype.nearestNode = function(trainData){
	var weights = flattenArray(this.nodes.weights);
	var nearestIndex = weights.map(function(weight, i){
		return distance(weight, trainData)
	}).reduce(function(minIndex, currentValue, currentIndex, array){
		return currentValue < array[minIndex] ? currentIndex : minIndex;
	}, 0);

	return this.indexToRowCol(nearestIndex);
}

SOM.prototype.colourNodes = function(){
	var nRow = this.nodes.dimensions.row;
	var nCol = this.nodes.dimensions.col;
	var padding = 0 * this.nodes.length;
	var sideLength = this.nodes.length - 2 * padding;
	var weights = this.nodes.weights;
	
	for (var row = 0; row < nRow; row++){
		for (var col = 0; col < nCol; col++){
			var colour = this.colourMap(weights[row][col]);

			this.ctx.fillStyle = "rgb(" + colour.red + "," + colour.green + "," + colour.blue + ")";
			this.ctx.fillRect((sideLength + 2 * padding)* col + padding, (sideLength + 2 * padding) * row + padding, sideLength, sideLength);
		}
	}
}

SOM.prototype.assignRandomWeights = function(){
	var nRow =  this.nodes.dimensions.row;
	var nCol = this.nodes.dimensions.col;
	var data = this.data;
	var weights = [];

	for (var i = 0; i < nRow; i++){
		weights.push([]);

		for (var j = 0; j < nCol; j++){
			var t = randomNumsSumTo(data.length, 1);
			var newWeight = weightedSum(data, t);

			weights[i].push(newWeight);
		}
	}

	this.nodes.weights = weights;
}

SOM.prototype.updateNodeWeights = function(t, bestNode, trainData){
	var nRow = this.nodes.dimensions.row;
	var nCol = this.nodes.dimensions.col;
	var keys = Object.keys(trainData);

	for (var row = 0; row < nRow; row++){
		for (var col = 0; col < nCol; col++){
			var compareNode = {"row": row, "col": col};
			var d = distance(bestNode, compareNode);

			if (d < this.radius(t)){
				var oldWeight = this.nodes.weights[row][col];

				var newWeight = keys.map(function(key){
					return  oldWeight[key] + this.learnRate(t) * this.neighbourhood(d, t) * (trainData[key] - oldWeight[key]);
				}, this).reduce(function(newObject, currentValue, currentIndex){
					var key = keys[currentIndex];
					newObject[key] = Math.floor(currentValue);
					return newObject;
				}, {});

				this.nodes.weights[row][col] = newWeight;
			}
		}
	}

	this.colourNodes();
}

SOM.prototype.animateNodes = function(t){
	// Create separate som variable to pass into request animation frame
	var som = this;

	// Find node closest to current training point and update colours around it
	var trainData = som.data[som.dataIndex];
	var bestNode = som.nearestNode(trainData);

	som.updateNodeWeights(t, bestNode, trainData);

	// Move on to next training point
	som.nextDataIndex();

	if (som.dataIndex == 0){
		t++;
	}

	// Check if animation was restarted
	if (!som.animate){
		som.restart(colourData);
		return;
	}

	// Check if animation should continue
	if (t > som.nIter){
		return;
	}

	window.requestAnimationFrame(function(){
		som.animateNodes(t);
	})
}

SOM.prototype.startSOM = function(){
	hidePlayButton();
	this.animate = true;
	this.setCanvasOpacity(1);
	this.animateNodes(0);
}