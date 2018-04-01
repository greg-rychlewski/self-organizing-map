function ColourPicker(colourList, initColour){
	// Reference to colour list
	this.colourList = colourList;

	// Create container div
	this.container = document.createElement("div");
	this.container.classList.add("colour-container");

	// Create input element
	this.input = document.createElement("input");
	var colourPicker = new jscolor(this.input);
	colourPicker.fromRGB(initColour.red, initColour.green, initColour.blue);

	this.container.appendChild(this.input);

	// Create remove button
	this.removeButton = document.createElement("div");
	this.removeButton.innerHTML = "&#10006";
	this.removeButton.classList.add("colour-remove");
	this.removeButton.addEventListener("click", this.delete.bind(this));

	this.container.appendChild(this.removeButton);
}

ColourPicker.prototype.next = null;

ColourPicker.prototype.prev = null;

ColourPicker.prototype.getColour = function(){
	return parseRGB(this.input.style.backgroundColor);
}

ColourPicker.prototype.delete = function(){
	if (this.colourList.size == 2){
		return;
	}

	if (this == this.colourList.root){
		this.colourList.root = this.next;
	}else{
		this.prev.next = this.next
	}

	if (this == this.colourList.tail){
		this.colourList.tail = this.prev;
	}else{
		this.next.prev = this.prev;
	}

	this.colourList.container.removeChild(this.container);
	this.colourList.size--;
}