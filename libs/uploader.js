'use strict';

var path = require('path');
var fs = require('fs');
var mime = require('mime');

var _existsSync = fs.existsSync || path.existsSync;

var CONSTANTS = {
    osSep: /^win/i.test(process.platform) ? '\\' : '/',
    maxPostSize: 11000000, //000 110 MB
    minFileSize: 1,
    maxFileSize: 10000000, //0000 100 MB
    acceptFileTypes: /.+/i,
    inlineFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i
};

exports.createDir = function(dir) {

	var fullPath = /^win/i.test(process.platform) ? '' : '/';
	var parts = path.normalize(dir).split('/');

	parts.forEach(function(part) {
		if (part !== '') {
			fullPath = path.normalize(path.join(fullPath, part));
			if (/\.$/.test(fullPath)) {
				fullPath = fullPath.replace(/\.$/, CONSTANTS.osSep);
			}
			if (part !== "" && !_existsSync(fullPath)) {
				try {
					fs.mkdirSync(fullPath, '0755');
					console.log("Create target directory: " + fullPath);
				} catch (err) {
					console.log(err);
				}
			}
		}
	});
};
exports.extension = function (type) {
	return mime.extension(type);
}