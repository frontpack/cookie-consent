;(function(window) {

	'use strict';

	function FrontpackCookieBar(
		bemRoot,
		storage
	) {
		this._bemRoot = bemRoot;
		this._storage = storage;
		this._blockName = 'cookie-bar';

		this._bindEvents();
	}


	FrontpackCookieBar.prototype.tryOpen = function() {
		var self = this;

		if (this._storage.needsConsent()) {
			this.open(false);

		} else {
			this._bemRoot.eachBlock(this._blockName, function (block, info) {
				self._close(block);
			});
		}
	};


	FrontpackCookieBar.prototype.open = function(showSettings) {
		var self = this;

		this._bemRoot.eachBlock(this._blockName, function (block, info) {
			if (info.isFirst) {
				self._setCategories(block, self._storage.getAll());

				if (showSettings) {
					block.addModifier('show-settings');
				}

				block.addModifier('active');

			} else {
				self._close(block);
			}
		});
	};


	FrontpackCookieBar.prototype._bindEvents = function() {
		var self = this;

		this._bemRoot.onElementEvent(this._blockName, { element: 'button', modifier: 'accept' }, 'click', function (element) {
			self._persistCategories(self._getCategories(element.getBlock()), true);
			self._close(element.getBlock());
		});

		this._bemRoot.onElementEvent(this._blockName, { element: 'button', modifier: 'dismiss' }, 'click', function (element) {
			self._persistCategories(self._getCategories(element.getBlock()), false);
			self._close(element.getBlock());
		});

		this._bemRoot.onElementEvent(this._blockName, { element: 'button', modifier: 'settings' }, 'click', function (element) {
			element.getBlock().addModifier('show-settings');
		});

		this._bemRoot.onElementEvent(this._blockName, { element: 'button', modifier: 'save' }, 'click', function (element) {
			self._persistCategories(self._getCategories(element.getBlock()), null);
			self._close(element.getBlock());
		});
	};


	FrontpackCookieBar.prototype._close = function(block) {
		block.removeModifier('active');
		block.removeModifier('show-settings');
	};


	FrontpackCookieBar.prototype._getCategories = function(block) {
		var result = {};

		block.each('input[type=checkbox][data-cookie-bar-category]', function (node) {
			var categoryName = node.dataset.cookieBarCategory;

			if (typeof categoryName === 'string') {
				result[categoryName] = {
					required: node.disabled,
					accepted: node.checked
				};
			}
		});

		return result;
	};


	FrontpackCookieBar.prototype._setCategories = function(block, categories) {
		block.each('input[type=checkbox][data-cookie-bar-category]', function (node) {
			var categoryName = node.dataset.cookieBarCategory;

			if (typeof categoryName === 'string') {
				if (categories === null || node.disabled) {
					node.checked = node.disabled;

				} else if (categories.hasOwnProperty(categoryName)) {
					node.checked = categories[categoryName];

				} else {
					node.checked = false;
				}
			}
		});
	};


	FrontpackCookieBar.prototype._persistCategories = function(categories, overrideValue) {
		var toSave = {};

		for (const categoryName in categories) {
			if (categories.hasOwnProperty(categoryName)) {
				toSave[categoryName] = categories[categoryName].required ? true : (overrideValue !== null ? overrideValue : categories[categoryName].accepted);
			}
		}

		this._storage.set(toSave, overrideValue === false ? 14 : 365);
	};


	/**
	 * Add to global namespace
	 */
	window.FrontpackCookieBar = FrontpackCookieBar;

})(window);
