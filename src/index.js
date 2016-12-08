'use strict';

/**
 * Export high level api as default.
 * Usage:
 *
 *   import crypto from 'crypto.js'
 *   crypto.encryptMessage(keys, text)
 */
import * as crypto from './crypto';
export default crypto;

/**
 * Export each high level api function seperately.
 * Usage:
 *
 *   import { encryptMessage } from 'crypto.js'
 *   encryptMessage(keys, text)
 */
export * from './crypto';

/**
 * @see module:util
 * @name module:crypto.util
 */
export { default as util } from './util';