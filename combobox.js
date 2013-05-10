// Combobox.
// Events:
//   select
(function ($) {
  $.widget("ui.combobox", {
		// default options
		options: {
			source: null, // URL or array of {label, value}
			value: null, // initial value
			label: null,
			select: null // item selected event
		},

		getValue: function () {
			return $(this.element).data("selectedValue");
		},

		setValue: function (v) {
			// ".data" returns null for undefined
			if (v == undefined)
				v = null;

			// set label if source is array
			if (this.options.source != null && this.options.source.constructor == Array) {
				for (var i = 0; i < this.options.source.length; i++) {
					if (this.options.source[i] != null && this.options.source[i].value == v) {
						this.setLabel(this.options.source[i].label);
						break;
					}
				}
			}

			return $(this.element).data("selectedValue", v);
		},

		getLabel: function () {
			return $(this.element).val();
		},

		setLabel: function (l) {
			return $(this.element).val(l);
		},

		hide: function () {
			// hide the 'span' wrapped around combobox
			$(this.element).closest("span").hide();
		},

		show: function () {
			// show the 'span' wrapped around combobox
			$(this.element).closest("span").show();
		},

		_create: function () {
			try {
				var self = this;

				$(this.element).wrap($("<span style='position:relative;'>").addClass("ui-combobox"));

				var $input = $(this.element)
					.addClass("ui-combobox-input")
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: this.options.source,
						select: function (event, ui) {
							if (ui.item) {
								self.setValue(ui.item.value);
								self.setLabel(ui.item.label);

								self._trigger("select", event, ui.item);

								$(self.element).val(ui.item.label);

								return false;
							}
							else
								return true;
						},
						focus: function (event, ui) {
							if (ui.item) {
								$(self.element).val(ui.item.label);

								return false;
							}
							else
								return true;
						}
					});

				$input.data("autocomplete")._renderItem = function (ul, item) {
					return $("<li></li>")
						.data("item.autocomplete", item)
						.append("<a>" + _.escape(item.label) + "</a>")
						.appendTo(ul);
				};

				var $button = $("<span class='ui-icon ui-icon-triangle-1-s' \
					style='position:absolute; right:4px; display:inline; cursor:pointer;'></span>")
					.attr("title", "Show Items")
					.insertAfter(this.element)
					.addClass("ui-combobox-toggle")
					.click(function () {
						// close if already visible
						if ($input.autocomplete("widget").is(":visible")) {
							$input.autocomplete("close");
							return;
						}

						// pass empty string as value to search for, displaying all results
						$input.autocomplete("search", "");
						$input.focus();
					});

				// initial value
				this.setLabel(this.options.label ? this.options.label : this.options.value);
				this.setValue(this.options.value);

				return $(this.element);
			}
			catch (ex) {
				alert(ex);
			}
		},

		destroy: function () {
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);
