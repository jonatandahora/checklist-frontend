var Checklist = Checklist || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');

	// Task List Item View
	Checklist.TaskView = Mn.View.extend({

		tagName: 'li',

		template: '#template-taskItemView',

		className: function () {
			return this.model.get('finished') ? 'finished' : 'doing';
		},

		ui: {
			edit: '.edit',
			destroy: '.destroy',
			label: 'label',
			toggle: '.toggle'
		},

		events: {
			'click @ui.destroy': 'deleteModel',
			'dblclick @ui.label': 'onEditClick',
			'keydown @ui.edit': 'onEditKeypress',
			'focusout @ui.edit': 'onEditFocusout',
			'click @ui.toggle': 'toggle'
		},

		modelEvents: {
			change: 'render'
		},

		deleteModel: function () {
			this.model.destroy();
		},

		toggle: function () {
			this.model.toggle().save();
		},

		onEditClick: function () {
			this.$el.addClass('editing');
			this.ui.edit.focus();
			this.ui.edit.val(this.ui.edit.val());
		},

		onEditFocusout: function () {
			var taskDescription = this.ui.edit.val().trim();
			if (taskDescription) {
				this.model.set('description', taskDescription).save();
				this.$el.removeClass('editing');
			} else {
				this.destroy();
			}
		},

		onEditKeypress: function (e) {
			var ENTER_KEY = 13;
			var ESC_KEY = 27;

			if (e.which === ENTER_KEY) {
				this.onEditFocusout();
				return;
			}

			if (e.which === ESC_KEY) {
				this.ui.edit.val(this.model.get('description'));
				this.$el.removeClass('editing');
			}
		}
	});

	// Item List View Body
	Checklist.ListViewBody = Mn.CollectionView.extend({
		tagName: 'ul',

		id: 'task-list',

		childView: Checklist.TaskView,

		filter: function (child) {
			var filteredOn = filterChannel.request('filterState').get('filter');
			return child.matchesFilter(filteredOn);
		}
	});

	// Item List View
	Checklist.ListView = Mn.View.extend({

		template: '#template-taskListView',

		regions: {
			listBody: {
				el: 'ul',
				replaceElement: true
			}
		},

		ui: {
			toggle: '#toggle-all'
		},

		events: {
			'click @ui.toggle': 'onToggleAllClick'
		},

		collectionEvents: {
			'change:finished': 'render',
			all: 'setCheckAllState'
		},

		initialize: function () {
			this.listenTo(filterChannel.request('filterState'), 'change:filter', this.render, this);
		},

		setCheckAllState: function () {
			function reduceFinished(left, right) {
				return left && right.get('finished');
			}

			var allFinished = this.collection.reduce(reduceFinished, true);
			this.ui.toggle.prop('checked', allFinished);
			this.$el.parent().toggle(!!this.collection.length);
		},

		onToggleAllClick: function (e) {
			var isChecked = e.currentTarget.checked;

			this.collection.each(function (task) {
				task.save({ finished: isChecked });
			});
		},

		onRender: function () {
			this.showChildView('listBody', new Checklist.ListViewBody({
				collection: this.collection
			}));
		}
	});
})();
