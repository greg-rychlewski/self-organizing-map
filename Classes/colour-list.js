function ColourList(containerId, som){
	this.container = document.getElementById(containerId);
	this.som = som;
	this.root = null;
	this.tail = null;
	this.size = 0;
}

ColourList.prototype.add = function(colour){
	if (this.search(colour)){
		return;
	}

	var newColour = new ColourPicker(this, colour);	
	this.container.append(newColour.container);

	if (this.size == 0){
		this.root = newColour;
		this.tail = newColour;
	}else{
		newColour.prev = this.tail;
		this.tail.next = newColour;
		this.tail = newColour;
	}

	if (this.som.animate == false){
		this.som.updateData(this.getColours());
	}

	this.size++;
}

ColourList.prototype.search = function(colour){
	var currColour = this.root;

	while (currColour != null){
		if (sameColour(currColour.getColour(), colour)){
			return true;
		}

		currColour = currColour.next;
	}

	return false;
}

ColourList.prototype.getColours = function(){
	var colours = [];
	var currColour = this.root;

	while (currColour != null){
		colours.push(currColour.getColour());
		currColour = currColour.next;
	}

	return colours;
}