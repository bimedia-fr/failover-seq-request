var request = require('request'),
	retry = require('retry'),
	parse = require('url').parse;

function shouldRetry(err, res) {
	return err;
}

module.exports = function(servers, options) {
	var hosts = servers.map(parse);
	var opts = Object.assign({shouldRetry: shouldRetry}, options);
	function failoverrequest(urlconfig, cb) {
		var operation = retry.operation(Object.assign({retries: hosts.length - 1}, opts.retry)),
			remaining = hosts.slice();
		operation.attempt(function (current) {
			var url = Object.assign({}, urlconfig);
			url.uri = Object.assign(remaining.shift(), url.uri);
			//console.log('attempt', current, url.uri.host);
			request(url, function (err, res, body) {
				var error = opts.shouldRetry(err, res);
				if(error && operation.retry(error)) {
					return;
				}
				cb(error ? operation.mainError() : null, res, body);
			});
		});
	}
	return failoverrequest;
};