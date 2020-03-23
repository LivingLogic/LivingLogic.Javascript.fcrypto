// crypto.js
// Copyright (C) 2016 LivingLogic AG

/* globals jQuery */
/* globals openpgp */

/**
 * @requires openpgp
 * @module crypto
 */

/**
 * @fileoverview The crypto base module. All additional classes are documented
 * for extending and developing on top of the base library.
 */

'use strict';

import * as openpgp from 'openpgp';
window.openpgp = openpgp;
// window.openpgp = require('openpgp');


///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
//   jQuery plugin fcrypto.                                                      //
//   Designed to provide simple encryption/decryption of form fields content     //
//   with the jquery selector chaining.                                          //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////


(function($){
	/**
	 * jQuery
	 * @param  {String} data text/data
	 * @static
	 * Return String
	 */
	$.fn.fcrypto = function(opts){
		var ch = $.fn.fcrypto.cryptingHandler, defaults = $.fn.fcrypto.defaults, passphrase = '';
		ch.cryptingLength = 0;
		ch.elmsLength = this.length;
		if (typeof(opts) === 'object'){
			$.extend(defaults, opts);
		}
		if (defaults.passphrase){
			passphrase = defaults.passphrase;
		}
		return this.each(async function(i) {
			var elm = this, str;
			if (ch.readyToCrypt(elm)){
				str = ch.getElementString(elm);
				if (defaults.mode === 'encrypt'){
					await ch.encrypt(elm, str, defaults.publicKey, defaults.privateKey, function(status){
						ch.cryptingLength++;
						if (typeof(defaults.onEach) === 'function'){
							defaults.onEach(elm, status);
						}
						if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
							defaults.onFinish(elm, status);
						}
					});
				}else{
					await ch.decrypt(elm, str, defaults.publicKey, defaults.privateKey, passphrase, function(status){
						ch.cryptingLength++;
						if (typeof(defaults.onEach) === 'function'){
							defaults.onEach(elm, status);
						}
						if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
							defaults.passphrase = '';
							defaults.onFinish(elm, status);
						}
					});
				}
			}else{
				ch.cryptingLength++;
			}
			if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
				defaults.passphrase = '';

				defaults.onFinish(elm);
			}
		});
	};

	$.fn.fcrypto.defaults = {
		"publicKey": '',
		"privateKey": '',
		"passphrase": '',
		// "sessionStorageKey": '',
		// "keysStorageUrl": '/gateway/keyserver',
		// "useLib": 'openpgp',
		"keyCreationBits": 2048,
		"keyCreationUnlockedKey": false,
		"sessionStorageHandler": null,
		"mode": 'encrypt',
		"catchStringReplace": null,
		"onEach": null,
		"onFinish": null,
		"onError": null
	};

	$.fn.fcrypto.cryptingHandler = {
		"elmsLength": 0,
		"cryptingLength": 0,
		"readyToCrypt": function(elm) {
			if ($(elm).children().length){
				if(window.console && window.console.log){
					console.log("The element has child nodes and can't be handled by fcrypto.");
				}
				return false;
			}
			return true;
		},
		"verifyMessagePublicKeys": function(msgKeys, puKeys){
			return new Promise ((resolve, reject) => {
				var i, j, keyId, matchedKeyIds;
				for (i = 0; i < msgKeys.length; i++) {
					keyId = msgKeys[i];
					for (j = 0; j < puKeys.length; j++) {
						matchedKeyIds = puKeys[j].getKeyIds().filter(item => item.toHex() === keyId.toHex());
						if (matchedKeyIds.length) {
							resolve({"valid": true});
						} else {
							reject({ "valid": false });
						}
					}
				}
			});
		},
		"getElementString": function(elm) {
			if (elm.nodeName.toLowerCase() === 'textarea'){
				return $(elm).val();
			} else if (elm.hasAttribute('type') && ($(elm).attr('type') === 'text' || $(elm).attr('type') === 'password')){
				return $(elm).val().replace(/\\n/g, '\n');
			}
			return $(elm).text();
		},
		"setElementString": function(elm, str) {
			if (typeof($.fn.fcrypto.defaults.catchStringReplace) === 'function'){
				return $.fn.fcrypto.defaults.catchStringReplace(elm, str);
			}else{
				if (elm.nodeName.toLowerCase() === 'textarea'){
					$(elm).val(str);
				} else if (elm.hasAttribute('type') && ($(elm).attr('type') === 'text' || $(elm).attr('type') === 'password')){
					str = str.replace(/\n/g, '\\n');
					$(elm).val(str);
				} else {
					$(elm).text(str);
				}
			}
			return true;
		},
		"encrypt": async function(elm, str, puk, callback) {
			var opts = {
				"data": str,
				"publicKeys": await openpgp.key.readArmored(puk)
			};
			const ciphertext = await openpgp.encrypt(opts)
			$.fn.fcrypto.cryptingHandler.setElementString(elm, ciphertext.data);
			callback();
		},
		"unlockKey": async function(key, passphrase) {
			const keys = await openpgp.key.readArmored(key);
			return await openpgp.decryptKey({
				"privateKey": keys[0],
				"passphrase": passphrase
			});
		},
		"decrypt": async function(elm, str, puk, prk, passphrase, callback) {
			var self = this, defaults = $.fn.fcrypto.defaults, promise,
			decrypt = async function(unlocked) {
				var keyIds, puks, opts = {
					"message": await openpgp.message.readArmored(str),
					"privateKeys": unlocked.key || unlocked
				};
				keyIds = opts.message.getEncryptionKeyIds();
				puks = await openpgp.key.readArmored(puk).keys;
				self.verifyMessagePublicKeys(keyIds, puks).then(function(status){
					promise = openpgp.decrypt(opts);
					promise.then(function (plaintext) {
						status.setElementStrStatus = {
							"break": !$.fn.fcrypto.cryptingHandler.setElementString(elm, plaintext.data)
						};
						callback(status);
					});
					if (typeof (defaults.onError) === 'function') {
						promise.catch(defaults.onError);
					}
					if (typeof (defaults.sessionStorageHandler) === 'function') {
						defaults.sessionStorageHandler({
							"element": elm,
							"privateKey": unlocked.key || unlocked
						});
					}
				})
				.catch(function(status){
					callback(status);
				});
			};
			if (passphrase){
				const unlocked = await this.unlockKey(prk, passphrase).catch((error) => {
					if (typeof(defaults.onError) === 'function'){
						defaults.onError(error);
					}
				});
				decrypt(unlocked);
			}else{
				const keys = await openpgp.key.readArmored(prk);
				decrypt(keys[0]);
			}
		}
	};

	$.fn.fcrypto.generateKey = async function(userIds, passphrase) {
		var numBits = $.fn.fcrypto.defaults.keyCreationBits, unlockedKey = $.fn.fcrypto.defaults.keyCreationUnlockedKey;
		return await openpgp.generateKey({
			"userIds": userIds,
			"passphrase": passphrase,
			"numBits": numBits,
			"unlockedKey": unlockedKey
		});
	};
}(jQuery));