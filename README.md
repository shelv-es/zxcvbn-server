A microservice wrapper around the [zxcvbn](https://github.com/dropbox/zxcvbn) password strength estimator.


## Purpose

The [zxcvbn](https://github.com/dropbox/zxcvbn) library from Dropbox is unmatched for estimating password strength because it:

* Measures true entropy/complexity, not just dumb regex patterns (as many others do)
* Penalizes known common passwords
* Penalizes common password patterns
* Runs in the browser so candidate passwords aren't sent over the wire

However, it has a couple of (potential) drawbacks:

* Only the JavaScript version is actively maintained
* It's nearly 700kb minified

Therefore it might be ideal to run it in a remote web services in cases where you'd like to:

* Access it from a language other than JavaScript
* Avoid sending an additional 700k library over the wire (mobile perhaps?)

There are official ports for [python](https://github.com/dropbox/python-zxcvbn) and [iOS](https://github.com/dropbox/zxcvbn-ios), and unofficial attempts at ports for Java ([zxcvbn-java](https://github.com/matthis-perrin/zxcvbn-java), [zxcvbn-gwt](https://github.com/Legioth/zxcvbn-gwt)) and PHP ([zxcvbn-php](https://github.com/bjeavons/zxcvbn-php), [php-zxcvbn](https://github.com/Dreyer/php-zxcvbn)), but none of them come close to having parity with the official JavaScript version (no doubt other ports also exist, likely plauged by the same problems).

While it does compile and run on JVM (with Rhino and Nashorn) the file size and/or runtime cost is prohibitively high.

Disadvantages of running `zxcvbn` remotely:

* In the browser, estimation generation is [fairly quick](https://github.com/dropbox/zxcvbn#runtime-latency). Running it remotely adds the additional latency of an HTTP request.
* Candidate passwords are sent over the wire. If you don't trust the `zxcvbn` server, it could be logging your candidate passwords.
* The addition of a remote service could add an additional failure point into your architecture.


## Installation

Clone this repo, install dependencies (`npm install`), run in the usual ways (`node app.js`).

## Usage

To use, send an HTTP POST to `https://.../zxcvbn`.

*Be sure to only host this service over SSL (or similarly secure channel). These are passwords being sent over the wire here; treat them with care.*

Multiple input formats are supported:

### With `Content-Type: text/password`

Send the password to check in the body of the request.

### With `Content-Type: application/x-www-form-urlencoded`

Send the password to check in a field called `password` (as in a usual [form submission](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Sending_and_retrieving_form_data)).

### Response

You'll recieve a response of type `application/json` of the form:

```json
{
	"guesses": 35,
	"guesses_log10": 1.5440680443502754,
	"calc_time": 0,
	"crack_times_seconds": {
		"online_throttling_100_per_hour": 1260,
		"online_no_throttling_10_per_second": 0.35,
		"offline_slow_hashing_1e4_per_second": 0.0035,
		"offline_fast_hashing_1e10_per_second": 3.5e-9
	},
	"crack_times_display": {
		"online_throttling_100_per_hour": "21 minutes",
		"online_no_throttling_10_per_second": "subsecond",
		"offline_slow_hashing_1e4_per_second": "subsecond",
		"offline_fast_hashing_1e10_per_second": "subsecond"
	},
	"score": 0
}
```

The response differs slightly from the result object documented at [dropbox/zxcvbn#usage](https://github.com/dropbox/zxcvbn#usage).

The documented fields `feedback` and `suggestions` don't actually seem to exist, so they probably aren't included. The field `sequence` is stripped as it is quite verbose and probably not very useful for the purposes of this service. The undocumented field `password`, which echoes back the supplied password, is stripped from the response.


## Public `zxcvbn-server`

A public, free to use `zxcvbn-server` is available at [password.wtf](https://password.wtf). While this server does power production applications, it's provided to the public with no warranty, so use it at your own risk.

