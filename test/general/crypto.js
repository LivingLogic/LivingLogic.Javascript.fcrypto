/* globals tryTests: true */

'use strict';

var crypto = typeof window !== 'undefined' && window.openpgp ? window.openpgp : require('../../dist/crypto');

var chai = require('chai'),
  expect = chai.expect;

describe('Crypto.js public api tests', function() {
	describe('example - unittest', function() {
		it('should return string of data parameter for example function', function() {
			var data = 'Test';
			expect(crypto.example(data)).to.have.string(data);
		});
	});
});