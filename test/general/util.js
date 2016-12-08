'use strict';

var crypto = typeof window !== 'undefined' && window.openpgp ? window.openpgp : require('../../dist/crypto');

var chai = require('chai'),
  expect = chai.expect;

describe('Util unit tests', function() {
	describe('getBrowser', function() {
		it('should return Mozilla browser', function() {
			global.navigator = {
				userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
			};
			expect(crypto.util.getBrowser()).to.eql({ name: 'Firefox', version: '40' });
		}),
		it('should return InternetExplorer browser', function() {
			global.navigator = {
				userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko'
			};
			expect(crypto.util.getBrowser()).to.eql({ name: 'IE', version: '11' });
		}),
		it('should return Chrome browser', function() {
			global.navigator = {
				userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
			};
			expect(crypto.util.getBrowser()).to.eql({ name: 'Chrome', version: '41' });
		}),
		it('should return Safari browser', function() {
			global.navigator = {
				userAgent: 'MoMozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
			};
			expect(crypto.util.getBrowser()).to.eql({ name: 'Safari', version: '7' });
		});
	});
});