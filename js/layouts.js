var Checklist = Checklist || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	Checklist.RootLayout = Mn.View.extend({

		el: '#app',

		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer'
		}
	});

	// Layout Header View
	Checklist.HeaderLayout = Mn.View.extend({

		template: '#template-header',

		ui: {
			input: '#new-task'
		},

		events: {
			'keypress @ui.input': 'onInputKeypress',
			'keyup @ui.input': 'onInputKeyup'
		},

		onInputKeyup: function (e) {
			var ESC_KEY = 27;

			if (e.which === ESC_KEY) {
				this.render();
			}
		},

		onInputKeypress: function (e) {
			var ENTER_KEY = 13;
			var taskDescription = this.ui.input.val().trim();

			if (e.which === ENTER_KEY && taskDescription) {
				this.collection.create({
					description: taskDescription
				});
				this.ui.input.val('');
			}
		}
	});

	// Layout Footer View
	Checklist.FooterLayout = Mn.View.extend({
		template: '#template-footer',

		ui: {
			filters: '#filters a',
			finished: '.finished a',
			doing: '.doing a',
			all: '.all a',
			summary: '#task-count',
			clear: '#clear-finished'
		},

		events: {
			'click @ui.clear': 'onClearClick'
		},

		collectionEvents: {
			all: 'render'
		},

		templateContext: {
			doingCountLabel: function () {
				return (this.doingCount === 1 ? 'item' : 'items') + ' left';
			}
		},

		initialize: function () {
			this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
		},

		serializeData: function () {
			var doing = this.collection.getDoing().length;
			var total = this.collection.length;

			return {
				doingCount: doing,
				totalCount: total,
				finishedCount: total - doing
			};
		},

		onRender: function () {
			this.$el.parent().toggle(this.collection.length > 0);
			this.updateFilterSelection();
		},

		updateFilterSelection: function () {
			this.ui.filters.removeClass('active');
			this.ui[filterChannel.request('filterState').get('filter')]
			.addClass('active');
		},

		onClearClick: function () {
			var finished = this.collection.getFinished();
			finished.forEach(function (task) {
				task.destroy();
			});
		}
	});
})();
