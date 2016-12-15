// crypto.js
// Copyright (C) 2016 LivingLogic AG

/* globals jQuery */
/* globals util */
/* globals openpgp */

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

window.openpgp = require('openpgp');

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

var testPupKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v2

mI0EV7LUUAEEANWJNyAUN7Zy/oAbGh08dRYfXlXAyos3kF9movVMfFsHUhpnTstm
qH0pgXib0vKyKmtJjm/UW7m2ODbeYDjwW+MdtEBmaUSqe6EgFMQdhok8waUMcdoq
h8TewZmNSgkIkLD4J8cU+rPrzVUKKOf91HHhutnV/HFYNMLsYTjENJX5ABEBAAG0
L0NocmlzdGlhbiBIYWhuICh0ZXN0a2V5KSA8Y2hhaG5AbGl2aW5nbG9naWMuZGU+
iLkEEwEIACMFAley1FACGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIXgAAKCRBd
6Ew2nQpYucz9A/9TKnBME2JwRAXS8VVEMyGvPg0iwYAoy03vNIui0e/DdAqprgSa
e87m00q7GI+kSNz2VOaBkaHRjjzI1b2WJ0BhYNsrXEwLVWmpkksw4EPUuvQk3a1O
F1+0eyHshz2e1xORqmotXrOiWZChIUxFIZyRkOOYNuIbo9NpZeSVa4jQ9biNBFey
1FABBADHpsjoi6kEavc1aWPdUBlObpRp1rlOgUYMrbf6EQxMAwhmVLWRSFuVfSK1
1m3PAddMPG/66bkv6El9o2BaSn44DtQURc8EZ4fJvOo06Hm9/HJM8L/PbU1K4st3
b34WymciUaowPVBSRKGrgJ7/mbDmcAHDFyZ0p85n0OW2k8tZUwARAQABiJ8EGAEI
AAkFAley1FACGwwACgkQXehMNp0KWLnSOQQA0V0gI1Rb05jELDh0POZiPXdYSxf2
7XDXzQXCxuzvx4JnzD6JYsnVmh6voKn8Tu0Pthy6wh03GqhEneGkggX1Rs7vLQMZ
kPL1YG4cdMiAcXt+D+iMcaMJd7x2p4B5ypj+M85ornQgHirYowmGCVb++FTdn8pg
0S1a1g21B+adqgE=
=qRGF
-----END PGP PUBLIC KEY BLOCK-----
`;

var testPrivKey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: GnuPG v2

lQH+BFey1FABBADViTcgFDe2cv6AGxodPHUWH15VwMqLN5BfZqL1THxbB1IaZ07L
Zqh9KYF4m9LysiprSY5v1Fu5tjg23mA48FvjHbRAZmlEqnuhIBTEHYaJPMGlDHHa
KofE3sGZjUoJCJCw+CfHFPqz681VCijn/dRx4brZ1fxxWDTC7GE4xDSV+QARAQAB
/gMDAu3g+T7spFgQ41cinzqjvRLVI0ZcLbbBQnMcLSzCqPLk2jgy6wvjLg3/dyck
RMbEyokoOAUyNLmVa1wWUWFnqMSHrMJz/FSoE2evT2OiLytQHf7hFEWWsGqBtq3s
DPnwFbnrkN4SnJNuEtKzxrPsCT3Z1O2u/hC7/z25jIaPdMVLZOixjR86THxOnKCU
Cm80l2U5opHwR1uGYUWusGNRURoY/4pNGvXshznXA1uIMoxcAd4UiW0n3jRBs9lb
ljjCPGdQh49bYVIIni+sBBz9nU5N1+K/wlSzTEc83c/b1FpdTphzgdLaWADk326z
hrNK1P5xzIr/cjBVjPbqj5OQ4PZsIhleC0wiGmfAsR+Q0Cy0ppDDGISrfy0qD32Q
h6Lu2UakB8XxhjEfzgO9ZtHTG5w5lOzPHKg2GG6DjKk61EZ1kouliOENaJCG7tGk
1e1I9H5fsdcVphGl8sKy6wVxZoMk+pAcY7oCD/r1pQ9FtC9DaHJpc3RpYW4gSGFo
biAodGVzdGtleSkgPGNoYWhuQGxpdmluZ2xvZ2ljLmRlPoi5BBMBCAAjBQJXstRQ
AhsDBwsJCAcDAgEGFQgCCQoLBBYCAwECHgECF4AACgkQXehMNp0KWLnM/QP/Uypw
TBNicEQF0vFVRDMhrz4NIsGAKMtN7zSLotHvw3QKqa4EmnvO5tNKuxiPpEjc9lTm
gZGh0Y48yNW9lidAYWDbK1xMC1VpqZJLMOBD1Lr0JN2tThdftHsh7Ic9ntcTkapq
LV6zolmQoSFMRSGckZDjmDbiG6PTaWXklWuI0PWdAf4EV7LUUAEEAMemyOiLqQRq
9zVpY91QGU5ulGnWuU6BRgytt/oRDEwDCGZUtZFIW5V9IrXWbc8B10w8b/rpuS/o
SX2jYFpKfjgO1BRFzwRnh8m86jToeb38ckzwv89tTUriy3dvfhbKZyJRqjA9UFJE
oauAnv+ZsOZwAcMXJnSnzmfQ5baTy1lTABEBAAH+AwMC7eD5PuykWBDj7wobC/pB
+dod0PzUG6A8xRMvFMCrej/FFS3uYX2m1ZFoHr4PoPNZd3kzzUMxxeuO2SKf3VL9
J6dPa1nvnLBllxooR6e4G/8Moy1gsncuYaLSO+VsEs63gD9MKof5XgtzOiujBClf
B1NkZ3HAmSZMQjoE/FghfHszguZadDW3AV+uCvTTtVydSV14GFiT2TrApswk0uYO
DET2oYSQWFFx7DDkFoCDCVzszhZQVJcmn+fE87g03SxFr4ekL8zAmiYDndPU8of0
mhzzbe2opqNrqrbIJ2qlnBp7ErP5Wov8gjq92o3mAI8oKFYfNoagqgUJwLNJOqNd
3pycLX6+YDoRWCeSGZMGcH+YVINy12bDB5R83HgyE9C8kcYe7ITEczAQhk5ZvlJG
I7sunsudd7/vIK7xnQHsn762ABJZATjEVpcR1Oaeew+CPs5m7IQbTOWVVF+mxeIx
eY+MR8RL73yZNI2alJWInwQYAQgACQUCV7LUUAIbDAAKCRBd6Ew2nQpYudI5BADR
XSAjVFvTmMQsOHQ85mI9d1hLF/btcNfNBcLG7O/HgmfMPoliydWaHq+gqfxO7Q+2
HLrCHTcaqESd4aSCBfVGzu8tAxmQ8vVgbhx0yIBxe34P6Ixxowl3vHangHnKmP4z
zmiudCAeKtijCYYJVv74VN2fymDRLVrWDbUH5p2qAQ==
=V3o4
-----END PGP PRIVATE KEY BLOCK-----
`;

(function($){
	$.fn.fcrypto = function(opts){
		var ch = $.fn.fcrypto.cryptingHandler, defaults = $.fn.fcrypto.defaults;
		ch.cryptingLength = 0;
		ch.elmsLength = this.length;
		if (typeof(opts) === 'object'){
			$.extend(defaults, opts);
		}
		return this.each(function(i) {
			var elm = this, str;
			if (ch.readyToCrypt(elm)){
				str = ch.getElementString(elm);
				if (defaults.mode === 'encrypt'){
					ch.encrypt(elm, str, defaults.publicKey, defaults.privateKey, function(){
						ch.cryptingLength++;
						if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
							defaults.onFinish();
						}
					});
				}else{
					ch.decrypt(elm, str, defaults.publicKey, defaults.privateKey, function(){
						ch.cryptingLength++;
						if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
							defaults.onFinish();
						}
					});
				}
			}else{
				ch.cryptingLength++;
			}
			if (i === ch.elmsLength - 1 && ch.cryptingLength === ch.elmsLength && typeof(defaults.onFinish) === 'function'){
				defaults.onFinish();
			}
		});
	};

	$.fn.fcrypto.defaults = {
		"publicKey": testPupKey,
		"privateKey": testPrivKey,
		"storeKeyInBrowserSession": false,
		"useLib": 'openpgp',
		"keyCreationBits": 2048,
		"keyCreationUnlockedKey": false,
		"mode": 'encrypt',
		"onFinish": null
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
		"getElementString": function(elm) {
			if (elm.hasAttribute('type') && $(elm).attr('type') === 'text' || elm.nodeName.toLowerCase() === 'textarea'){
				return $(elm).val();
			}
			return $(elm).text();
		},
		"setElementString": function(elm, str) {
			if (elm.hasAttribute('type') && $(elm).attr('type') === 'text' || elm.nodeName.toLowerCase() === 'textarea'){
				$(elm).val(str);
			}else{
				$(elm).text(str);
			}
		},
		"encrypt": function(elm, str, puk, prk, callback) {
			var opts = {
				"data": str,
				"publicKeys": openpgp.key.readArmored(puk).keys
			};
			openpgp.encrypt(opts).then(function(ciphertext){
				$.fn.fcrypto.cryptingHandler.setElementString(elm, ciphertext.data);
				callback();
			});
		},
		"decrypt": function(elm, str, puk, prk, callback) {
			openpgp.decryptKey({
				"privateKey": openpgp.key.readArmored(prk).keys[0],
				"passphrase": 'll123'
			}).then(function(unlocked){
				var opts = {
					"message": openpgp.message.readArmored(str),
					"privateKey": unlocked.key
				};
				openpgp.decrypt(opts).then(function(plaintext){
					$.fn.fcrypto.cryptingHandler.setElementString(elm, plaintext.data);
					callback();
				});
			});
		}
	};

	$.fn.fcrypto.generateKey = function(userIds, passphrase) {
		var numBits = $.fn.fcrypto.defaults.keyCreationBits, unlockedKey = $.fn.fcrypto.defaults.keyCreationUnlockedKey;
		return openpgp.generateKey({
			"userIds": userIds,
			"passphrase": passphrase,
			"numBits": numBits,
			"unlockedKey": unlockedKey
		});
	};


}(jQuery));