angular.module('gameApp', []).controller('MainCtrl',
		function($scope, $timeout) {
			/* Application labels */
			$scope.automationLabel = 'Start';
			$scope.stepLabel = 'Step';
			$scope.resetLabel = 'Reset';
			$scope.generationLabel = 'Generation: ';
			$scope.timeLabel = 'Time: ';
			$scope.secondLabel = 'sec';

			/* Application defaults */
			$scope.interval = 100;
			$scope.started = false;
			$scope.gridSize = 30;
			$scope.grid = new Grid($scope.gridSize);
			$scope.timeInSec = 0;
			$scope.aFlag = false;

			/* And now the functions */
			$scope.createGrid = function() {
				/* Stop any running automation */
				$scope.started = false;
				if ($scope.aFlag) {
					if (gentimeout != null)
						$timeout.cancel(gentimeout);
					if (sectimeout != null)
						$timeout.cancel(sectimeout);
				}
				$scope.timeInSec = 0;
				$scope.automationLabel = 'Start';
				$scope.grid = new Grid($scope.gridSize);
			};

			$scope.toggleState = function(row, col) {
				var cell = $scope.grid.cells[row][col];
				if (!cell.alive)
					$scope.grid.bringToLife(cell);
				else
					$scope.grid.kill(cell);
			};

			/* Handles the automation */
			$scope.onGenTimeout = function() {
				$scope.grid.step();
				gentimeout = $timeout($scope.onGenTimeout, $scope.interval);
			};

			/* Handles the timer */
			$scope.onSecTimeout = function() {
				$scope.timeInSec++;
				sectimeout = $timeout($scope.onSecTimeout, 1000);
			};

			/* Only take a step if automation is not running */
			$scope.step = function() {
				if (!$scope.started)
					$scope.grid.step();
			};

			/* Start or stop the automation */
			$scope.run = function() {
				if ($scope.started) {
					$scope.started = false;
					$scope.automationLabel = 'Start';
					$timeout.cancel(gentimeout);
					$timeout.cancel(sectimeout);
				} else {
					$scope.started = true;
					$scope.aFlag = true;
					$scope.automationLabel = 'Stop';
					$timeout($scope.onSecTimeout, $scope.interval);
					$timeout($scope.onGenTimeout, 1000);
				}
			};

			/* Reset the game */
			$scope.reset = function() {
				if ($scope.aFlag) {
					if (gentimeout != null)
						$timeout.cancel(gentimeout);
					if (sectimeout != null)
						$timeout.cancel(sectimeout);
				}
				$scope.started = false;
				$scope.automationLabel = 'Start';
				$scope.timeInSec = 0;
				$scope.grid.reset();
			};
		});
