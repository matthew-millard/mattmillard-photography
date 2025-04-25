"use strict";
// After spending much time going through the crypto subtle api docs, I decide to play it safe and just rip this code from Jamie Lord's blog post: https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
function hashPassword(password, providedSalt) {
    return __awaiter(this, void 0, void 0, function () {
        var encoder, salt, keyMaterial, key, exportedKey, hashBuffer, hashArray, hashHex, saltHex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encoder = new TextEncoder();
                    salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
                    return [4 /*yield*/, crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
                            'deriveBits',
                            'deriveKey',
                        ])];
                case 1:
                    keyMaterial = _a.sent();
                    return [4 /*yield*/, crypto.subtle.deriveKey({
                            name: 'PBKDF2',
                            salt: salt,
                            iterations: 100000,
                            hash: 'SHA-256',
                        }, keyMaterial, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])];
                case 2:
                    key = _a.sent();
                    return [4 /*yield*/, crypto.subtle.exportKey('raw', key)];
                case 3:
                    exportedKey = (_a.sent());
                    hashBuffer = new Uint8Array(exportedKey);
                    hashArray = Array.from(hashBuffer);
                    hashHex = hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
                    saltHex = Array.from(salt)
                        .map(function (b) { return b.toString(16).padStart(2, '0'); })
                        .join('');
                    return [2 /*return*/, "".concat(saltHex, ":").concat(hashHex)];
            }
        });
    });
}
function verifyPassword(storedHash, passwordAttempt) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, saltHex, originalHash, matchResult, salt, attemptHashWithSalt, _b, attemptHash;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = storedHash.split(':'), saltHex = _a[0], originalHash = _a[1];
                    matchResult = saltHex.match(/.{1,2}/g);
                    if (!matchResult) {
                        throw new Error('Invalid salt format');
                    }
                    salt = new Uint8Array(matchResult.map(function (byte) { return parseInt(byte, 16); }));
                    return [4 /*yield*/, hashPassword(passwordAttempt, salt)];
                case 1:
                    attemptHashWithSalt = _c.sent();
                    _b = attemptHashWithSalt.split(':'), attemptHash = _b[1];
                    return [2 /*return*/, attemptHash === originalHash];
            }
        });
    });
}
