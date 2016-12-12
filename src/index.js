'use strict';

/**
 * Export high level api as default.
 * Usage:
 *
 *   import crypto from 'crypto.js'
 *   crypto.encryptMessage(keys, text)
 */
import * as fcrypto from './fcrypto';
export default fcrypto;

/**
 * Export each high level api function seperately.
 * Usage:
 *
 *   import { encryptMessage } from 'crypto.js'
 *   encryptMessage(keys, text)
 */
export * from './fcrypto';

/**
 * @see module:util
 * @name module:crypto.util
 */
export { default as util } from './util';