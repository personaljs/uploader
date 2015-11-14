
/*	Define Angular App
---------------------------------------------------------------------- */
var app = angular.module('app', []);


/*	Main Controller
---------------------------------------------------------------------- */
app.controller('mainController', function($scope, $http){

	// Upload file
	$scope.upload = function(){
		var fd = new FormData();
		angular.forEach($scope.files, function(file, i){
			fd.append('file_'+i, $scope.files[i]);
		});

		console.log(fd);

		$http.post('/upload', fd, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).success(function(res){
			console.log(res);
		});
	};


});


/*	Directive - Update file inputs on change
---------------------------------------------------------------------- */
app.directive('ngFileModel', function(){
	return {
		restrict: 'A',
		scope: { ngFileModel: '=' },
		link: function($scope, elem, attrs){
			elem.bind('change', function(e){
				$scope.$apply(function(){
					$scope.ngFileModel = e.target.files;
				});
			});
		}
	}
});


