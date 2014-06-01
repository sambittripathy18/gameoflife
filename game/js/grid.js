function Grid(gridSize) {
	/* Grid defaults */
	this.generation = 0;
	this.gridSize = gridSize;
	this.cells = new Array(gridSize);
	this.targetCells = [];

	/* Initialize the individual grid cells */
	for (var row = 0; row < gridSize; row++) {
		this.cells[row] = new Array(gridSize);
		for (var col = 0; col < gridSize; col++)
			this.cells[row][col] = new Cell(row, col, false);
	}

	/* Reset the grid */
	this.reset = function() {
		this.generation = 0;
		for (var row = 0; row < gridSize; row++) {
			for (var col = 0; col < gridSize; col++)
				this.cells[row][col].reset();
		}
	};
	
	/* Mark the cell as alive and update surrounding cells */
	this.bringToLife = function(cell){
		if(!cell.alive){
			cell.bringToLife();
		/* Update the surrounding cells */
		var sRow = cell.x - 1 == -1 ? 0 : cell.x - 1;
		var eRow = cell.x + 1 == this.gridSize ? this.gridSize - 1: cell.x + 1;

		var sCol = cell.y - 1 == -1 ? 0 : cell.y - 1;
		var eCol = cell.y + 1 == this.gridSize ? this.gridSize - 1
						: cell.y + 1;
		for (var i = sRow; i <= eRow; i++)
			for (var j = sCol; j <= eCol; j++){
				if(i != cell.x || j != cell.y)
					this.cells[i][j].addNeighbour();
				/* Update the target cells*/
				this.targetCells[i + '-' + j] = this.cells[i][j];
			}
		}	
	};
	
	/* Mark the cell as dead and update surrounding cells */
	this.kill = function(cell){
		if(cell.alive){
			cell.kill();
		/* Update the surrounding cells */
		var sRow = cell.x - 1 == -1 ? 0 : cell.x - 1;
		var eRow = cell.x + 1 == this.gridSize ? this.gridSize - 1: cell.x + 1;

		var sCol = cell.y - 1 == -1 ? 0 : cell.y - 1;
		var eCol = cell.y + 1 == this.gridSize ? this.gridSize - 1
						: cell.y + 1;
		for (var i = sRow; i <= eRow; i++)
			for (var j = sCol; j <= eCol; j++){
				if(i != cell.x || j != cell.y)
					this.cells[i][j].removeNeighbour();
				/* Update the target cells*/
				if(this.cells[i][j].nCount == 0 && !this.cells[i][j].alive)
					delete this.targetCells[i + '-' + j];
				}
		}
	};
	
	/* Single step rendering */
	this.step = function() {
		var markedAlive = [];
		var markedDead = [];
		
		for (var key in this.targetCells) {
			if (this.targetCells[key] != null) {
				var cell = this.targetCells[key];
				var nCount = cell.nCount;

				/* Rules of the game!! */
				if (cell.alive && nCount < 2)
					markedDead.push(cell);
				else if (cell.alive && (nCount == 2 || nCount == 3))
					markedAlive.push(cell);
				else if (cell.alive && nCount > 3)
					markedDead.push(cell);
				else if (!cell.alive && nCount == 3)
					markedAlive.push(cell);
			}
		}

		/* Hasta La Vista */
		for (var i = 0; i < markedDead.length; i++)
			this.kill(this.cells[markedDead[i].x][markedDead[i].y]);

		/* Its Alive !! */
		for (var i = 0; i < markedAlive.length; i++)
			this.bringToLife(this.cells[markedAlive[i].x][markedAlive[i].y]);
		this.generation++;
	};
}
