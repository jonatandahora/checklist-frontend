var Checklist = Checklist || {};

$(function () {
	'use strict';

	Checklist.App.on('start', function () {
		var controller = new Checklist.Controller();
		controller.router = new Checklist.Router({
			controller: controller
		});

		controller.start();
		Backbone.history.start();
	});

	Checklist.App.start();
});
