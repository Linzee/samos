var aStar = require('a-star');

var map = require('../src/maps/island_large.json');

module.exports = function() {

	this.map = [];

	for(var x=0; x<map.width; x++) {
		this.map[x] = [];
	}

	//load map
	for(var y=0; y<map.height; y++) {
		for(var x=0; x<map.width; x++) {
			var tileId = map.layers[0].data[y * map.width + x];
			var tileProperties = map.tilesets[0].tileproperties[tileId-1];

			if(!tileProperties || tileProperties.wall != "1") {
				this.map[x][y] = {
					x: x,
					y: y
				}
			}

		}
	}

	this.findPath = function(from, to) {

		if(this.map[from.x][from.y] == undefined) {
			throw new Error("Illegal path start");
		}

		if(this.map[to.x][to.y] == undefined) {
			throw new Error("Illegal path end");
		}

		var distance = function(a, b) {
			var sqr = function(a) {
				return a*a;
			};
			return sqr(a.x - b.x) + sqr(a.y - b.y);
		};

		var path = aStar({
			start: this.map[from.x][from.y],
			isEnd: function(node) {
				return node.x === to.x && node.y === to.y;
			},
			neighbor: function(node) {
				var neighbor = [
				this.map[node.x-1][node.y],
				this.map[node.x+1][node.y],
				this.map[node.x][node.y-1],
				this.map[node.x][node.y+1]
				];
				return neighbor.filter(function(n) {return n != undefined});
			}.bind(this),
			distance: distance,
			heuristic: distance.bind(this, to),
			hash: function(node) {
				return node.x+","+node.y;
			},
			timeout: 500
		});

		return path.path;

	}.bind(this);

	var findObject = function(randomHeuristic, from, isEndCallback) {

		if(this.map[from.x][from.y] == undefined) {
			throw new Error("Illegal path start");
		}

		var distance = function(a, b) {
			var sqr = function(a) {
				return a*a;
			};
			return sqr(a.x - b.x) + sqr(a.y - b.y);
		};

		var path = aStar({
			start: this.map[from.x][from.y],
			isEnd: isEndCallback,
			neighbor: function(node) {
				var neighbor = [
				this.map[node.x-1][node.y],
				this.map[node.x+1][node.y],
				this.map[node.x][node.y-1],
				this.map[node.x][node.y+1]
				];
				return neighbor.filter(function(n) {return n != undefined});
			}.bind(this),
			distance: distance,
			heuristic: randomHeuristic ? function() {return Math.random() * 5; } : function() {return 1;},
			hash: function(node) {
				return node.x+","+node.y;
			},
			timeout: 500
		});

		return path.path;

	}

	this.findClosestObject = findObject.bind(this, false);

	this.findObject = findObject.bind(this, true);

	return this;
}