var Checklist = Checklist || {};

(function () {
	'use strict';

	var ChecklistApp = Mn.Application.extend({
		setRootLayout: function () {
			this.root = new Checklist.RootLayout();
		}
	});

	Checklist.App = new ChecklistApp();

	Checklist.App.on('before:start', function () {
		Checklist.App.setRootLayout();
	});

})();
