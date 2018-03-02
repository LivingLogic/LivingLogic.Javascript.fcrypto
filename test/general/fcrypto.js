/* globals tryTests: true */

'use strict';

var fcrypto = typeof window !== 'undefined' && window.openpgp ? window.openpgp : require('../../dist/fcrypto');

var chai = require('chai'),
  expect = chai.expect;

describe('fcrypto.js public api tests', function() {
	describe('example - unittest', function() {
		it('should return string of data parameter for example function', function() {
			var data = 'Test';
			expect(fcrypto.example(data)).to.have.string(data);
		});
	});
});