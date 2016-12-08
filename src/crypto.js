// crypto.js
// Copyright (C) 2016 LivingLogic AG

/**
 * @requires util
 * @requires openpgp
 * @module crypto
 */

/**
 * @fileoverview The crypto base module. All additional classes are documented
 * for extending and developing on top of the base library.
 */

'use strict';

window.openpgp = require('openpgp'); // Temp -- Tests will fail
// var openpgp = require('openpgp');

// import util from './util';


///////////////////////////////////////////
//                                       //
//   Example Header                      //
//                                       //
///////////////////////////////////////////


/**
 * Example Function
 * Return String
 * @param  {String} data     text/data
 * @static
 */
export function example(data) {
	return data;
}