var Checklist = Checklist || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	// Tasks Router
	Checklist.Router = Mn.AppRouter.extend({
		appRoutes: {
			'*filter': 'filterItems'
		}
	});

	// Tasks Controller
	Checklist.Controller = Mn.Object.extend({

		initialize: function () {
			this.tasks = new Checklist.Tasks();
		},

		start: function () {
			this.showHeader(this.tasks);
			this.showFooter(this.tasks);
			this.showTasks(this.tasks);
			this.tasks.on('all', this.updateHiddenElements, this);
			this.tasks.fetch();
		},

		updateHiddenElements: function () {
			$('#main, #footer').toggle(!!this.tasks.length);
		},

		showHeader: function (tasks) {
			var header = new Checklist.HeaderLayout({
				collection: tasks
			});
			Checklist.App.root.showChildView('header', header);
		},

		showFooter: function (tasks) {
			var footer = new Checklist.FooterLayout({
				collection: tasks
			});
			Checklist.App.root.showChildView('footer', footer);
		},

		showTasks: function (tasks) {
			Checklist.App.root.showChildView('main', new Checklist.ListView({
				collection: tasks
			}));
		},

		filterItems: function (filter) {
			var newFilter = filter && filter.trim() || 'all';
			filterChannel.request('filterState').set('filter', newFilter);
		}
	});
})();
