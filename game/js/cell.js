function Cell(x, y, alive) {
	this.alive = alive;
	this.className = 'bg-default';
	/* Know thy neighbours. */
	this.nCount = 0;
	/* Position aware cell */
	this.x = x;
	this.y = y;

	this.bringToLife = function() {
		this.alive = true;
		this.className = 'bg-primary';
	};

	this.kill = function() {
		this.alive = false;
		this.className = 'bg-info';
	};

	this.reset = function() {
		this.alive = false;
		this.className = 'bg-default';
	};
	
	this.addNeighbour = function(){
		this.nCount++;
	}
	
	this.removeNeighbour = function(){
		this.nCount--;
	}
}
