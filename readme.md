
# Frontpack\Cookie-consent

Cookie consent bar

<a href="https://www.paypal.me/janpecha/5eur"><img src="https://buymecoffee.intm.org/img/button-paypal-white.png" alt="Buy me a coffee" height="35"></a>


## Installation

[Download a latest package](https://github.com/frontpack/cookie-consent/releases) or use [Composer](http://getcomposer.org/):

```
composer require frontpack/cookie-consent
```


## Usage

On begin of page:

``` js
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); }
const CookieConsent = new FrontpackCookieConsent('storageKey-cc', function (consent) {
	consent.setDefaults({functional: true});
	const status = consent.getGCMValue('analytics');
	gtag('consent', 'default', {
		analytics_storage: status,
		personalization_storage: status,
		ad_storage: status,
		ads_data_redaction: status === 'granted' ? 'false' : 'true',
		wait_for_update: 500
	});
	dataLayer.push({event: 'default_consent'});
	dataLayer.push({event: 'consentSettingsUpdated'});
}, function (consent) {
	const status = consent.getGCMValue('analytics');
	gtag('consent', 'update', {
		analytics_storage: status,
		personalization_storage: status,
		ad_storage: status,
		ads_data_redaction: status === 'granted' ? 'false' : 'true',
		wait_for_update: 500
	});
	dataLayer.push({event: 'consentSettingsUpdated'});
});
```

### Cookie bar

HTML:

```html
<div class="cookie-bar" role="dialog" aria-describedby="cookie-bar__description">
	<div class="cookie-bar__description" id="cookie-bar__description">
		Description

		<a href="/privacy">Link</a>
	</div>

	<div class="cookie-bar__category cookie-bar__category--disabled">
		<label for="cookie-bar__category--functional">
			<div class="cookie-bar__checkbox">
				<input id="cookie-bar__category--functional" tabindex="0" data-cookie-bar-category="functional" checked disabled type="checkbox" value="1">
				<span class="cookie-bar__checkbox-round"></span>
			</div>
			<span class="cookie-bar__category-label">Functional</span>
		</label>
	</div>

	<div class="cookie-bar__category">
		<label for="cookie-bar__category--analytics">
			<div class="cookie-bar__checkbox">
				<input id="cookie-bar__category--analytics" tabindex="0" data-cookie-bar-category="analytics" type="checkbox" value="0">
				<span class="cookie-bar__checkbox-round"></span>
			</div>
			<span class="cookie-bar__category-label">Analytics</span>
		</label>
	</div>

	<div class="cookie-bar__buttons">
		<button class="cookie-bar__button cookie-bar__button--accept">Accept</button>
		<button class="cookie-bar__button cookie-bar__button--dismiss">Dismiss</button>
		<button class="cookie-bar__button cookie-bar__button--settings">Settings</button>
		<button class="cookie-bar__button cookie-bar__button--save">Save</button>
	</div>
</div>
```

JS (in page footer):

```js
const bem = new LucyBem(document);
const cookieBar = new FrontpackCookieBar(bem, cookieConsent);
cookieBar.tryOpen();
```

------------------------------

License: [New BSD License](license.md)
<br>Author: Jan Pecha, https://www.janpecha.cz/
