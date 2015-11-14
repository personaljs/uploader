'use strict';
var config = require('config/uploader');
var uploader = require('libs/uploader');
var path = require('path');
var fs = require('fs');
var _existsSync = fs.existsSync || path.existsSync;
exports.upload = function(req, res) {

	var type = req.query.type || req.body.type || 'news_banner';

	var dir = path.join(__dirname, '..', config[type].path);

	// проверяем существует ли путь для сохранения
	uploader.safeCreateDirectory(dir);
	//ессли необходимо сделать уменьшеннуую копию
	if(config[type].thumbnail) {
		// проверяем путь к папке с уменьшенными копиями
		uploader.safeCreateDirectory(path.join(dir, 'thumbnail'));
	}


	res.end();
}
