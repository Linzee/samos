export default class SpriteSyncUtils {

	sync(parent, data, createCallback, updateCallback, idCallback) {
		let onlineIds = [];

		var findSpriteById = (id) => {
			for (var i = 0; i < parent.children.length; i++) {
				if(idCallback(parent.children[i]) === id) {
					return parent.children[i];
				}
			}
			return null;
		};

		for(var i = 0; i<data.length; i++) {
			let s = findSpriteById(data[i].id);
			if(s) {
				updateCallback(s, data[i]);
			} else {
				s = createCallback(data[i], i);
				parent.addChild(s);
			}

			onlineIds.push(data[i].id);
		}
		
		//remove sprites who left
		for (i = parent.children.length - 1; i >= 0; i--) {
			if(!onlineIds.includes(idCallback(parent.children[i]))) {
				parent.removeChild(parent.children[i]);
			}
		}
	}

	recreate(parent, data, createCallback) {
		for (var i = parent.children.length - 1; i >= 0; i--) {
			parent.removeChild(parent.children[i]);
		}

		for(i = 0; i<data.length; i++) {
			let sprite = createCallback(data[i], i);
			parent.addChild(sprite);
		}
	}

}