function ColourList(container){
	this.container = container;
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