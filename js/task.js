var Checklist = Checklist || {};

(function () {
	'use strict';

	// Task Model
	Checklist.Task = Backbone.Model.extend({
		defaults: {
			description: '',
			finished: false,
			created: 0
		},

		initialize: function () {
			if (this.isNew()) {
				this.set('created', Date.now());
			}
		},

		isFinished: function () {
			return this.get('finished');
		},

		matchesFilter: function (filter) {

			if (filter === 'active') {
				return !this.isFinished();
			}

      if (filter === 'all') {
				return true;
			}

			return this.isFinished();
		},
		toggle: function () {
			return this.set('finished', !this.isFinished());
		}
	});

	// Task Collection
	Checklist.Tasks = Backbone.Collection.extend({
		model: Checklist.Task,

		url: 'http://localhost:3000',

		comparator: 'created',

		getFinished: function () {
			return this.filter(this._isFinished);
		},

		getActive: function () {
			return this.reject(this._isFinished);
		},

		_isFinished: function (task) {
			return task.isFinished();
		}
	});
})();
