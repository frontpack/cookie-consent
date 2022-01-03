;(function(window) {

	'use strict';

	function FrontpackCookieConsent(
		storageName,
		onInit,
		onChange
	) {
		this._storageName = storageName;
		this._onChange = onChange;
		this._data = this._read();
		this._dataDefaults = null;
		this._borderInterval = 30;
		onInit(this);
	}


	FrontpackCookieConsent.prototype.needsConsent = function() {
		if (this._data === null) {
			return true;
		}

		if (!this._data.expire) {
			return true;
		}

		var borderDate = new Date();
		borderDate.setDate(borderDate.getDate() + this._borderInterval);
		var expireDate = new Date(this._data.expire);
		return expireDate > borderDate;
	};


	FrontpackCookieConsent.prototype.isValid = function() {
		if (this._data === null) {
			return false;
		}

		if (!this._data.expire) {
			return false;
		}

		var currentDate = new Date();
		var expireDate = new Date(this._data.expire);
		return expireDate > currentDate;
	};


	FrontpackCookieConsent.prototype.isGranted = function(category) {
		if (this._data === null || !this.isValid()) {
			if (this._dataDefaults !== null && (category in this._dataDefaults)) {
				return !!this._dataDefaults[category];
			}

			return false;
		}

		if (category in this._data.categories) {
			return !!this._data.categories[category];
		}

		return false;
	};


	FrontpackCookieConsent.prototype.getGCMValue = function(category) {
		return this.isGranted(category) ? 'granted' : 'denied';
	};


	FrontpackCookieConsent.prototype.setDefaults = function(categories) {
		this._dataDefaults = categories;
	};


	FrontpackCookieConsent.prototype.getAll = function() {
		return this._data !== null ? this._data.categories : null;
	};


	FrontpackCookieConsent.prototype.set = function(categories, expireInterval) {
		var expire = new Date();
		expire.setDate(expire.getDate() + expireInterval);

		this._data = {
			categories: categories,
			date: new Date(),
			expire: expire
		};

		this._write(this._data);
		this._onChange(this);
	};


	FrontpackCookieConsent.prototype._read = function() {
		var value = window.localStorage.getItem(this._storageName);

		if (value === null) {
			return null;
		}

		return JSON.parse(value);
	};


	FrontpackCookieConsent.prototype._write = function(data) {
		if (data === null) {
			window.localStorage.removeItem(this._storageName);

		} else {
			window.localStorage.setItem(this._storageName, JSON.stringify(data));
		}
	};


	/**
	 * Add to global namespace
	 */
	window.FrontpackCookieConsent = FrontpackCookieConsent;

})(window);
