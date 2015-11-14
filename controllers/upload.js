'use strict';
var CONFIG = require('config/uploader');
var uploader = require('libs/uploader');
var path = require('path');
var _ = require('lodash');
var q = require('bluebird');
var lwip = require('lwip');
var exif = require('exif-parser');

var fs = require('fs');
exports.upload = function(files, query, body) {

		var options = _.extend({}, body, query);
		var type = options.type || 'news_banner';

		var config = CONFIG[type];

		var dir = path.join(__dirname, '..', config.path);

		// проверяем существует ли путь для сохранения
		uploader.safeCreateDirectory(dir);

		//ессли необходимо сделать уменьшеннуую копию
		if (config.thumbnail) {
			// проверяем путь к папке с уменьшенными копиями
			uploader.safeCreateDirectory(path.join(dir, 'thumbnail'));
		}

		return q.all(_.each(files, function(file) {

						var ext = path.extname(file.originalname).substr(1, path.extname(file.originalname).lenght).toLowerCase();

						var def = q.defer();

						fs.readFile(file.path, function(err, data) {
							if (err) throw err;

							var exifData = false;
							// ext is the extension of the image
							if (ext == "jpg") {
								exifData = exif.create(data).parse();
							}

							lwip.open(data, ext, function(err, image) {

								if (err) def.reject(err);

								image = image.batch();

								if (exifData) {
									switch (exifData.tags.Orientation) {
										case 2:
											image = image.flip('x'); // top-right - flip horizontal
											break;
										case 3:
											image = image.rotate(180); // bottom-right - rotate 180
											break;
										case 4:
											image = image.flip('y'); // bottom-left - flip vertically
											break;
										case 5:
											image = image.rotate(90).flip('x'); // left-top - rotate 90 and flip horizontal
											break;
										case 6:
											image = image.rotate(90); // right-top - rotate 90
											break;
										case 7:
											image = image.rotate(270).flip('x'); // right-bottom - rotate 270 and flip horizontal
											break;
										case 8:
											image = image.rotate(270); // left-bottom - rotate 270
											break;
									}
								}

								image
									.crop(config.size.width, config.size.height)
									.writeFile(path.join(dir, file.filename + '.' + ext), ext, function(err) {
										if(err) def.reject(err);
										else def.resolve();
									});
							});
						});

						return def.promise;
					}))
					.then(function(res) {
						console.log(res);
						return;
					})
					.catch(function() {
						console.log(arguments);
					})
};