(function() {
	var originalSeriliazeArray = jQuery.fn.serializeArray;
	jQuery.fn.serializeArray = function() {
		var data = originalSeriliazeArray.apply(this, arguments);
		var list_field = $(this).find("div.list");
		var dict_field = $(this).find("div.dict");
	
		for(var i=0, length=list_field.length; i<length; i++) {
			data.push({name:$(list_field[i]).attr("name"), value: $(list_field).getListValue(i)});
		}
	
		for(var i=0, length=dict_field.length; i<length; i++) {

			data.push({name:$(dict_field[i]).attr("name"), value: $(dict_field).getDictValue(i)});
		}
		return data;
	}
})();


$(function() {

	var ITEM_TEMPLATE =
		'<li class="row">' +
			'<span class="span1 ITEM_KEY" key="<%- key %>"><%- key %></span><span class="span1">:</span><span class="span1 ITEM_VALUE"><%- value %></span>' +
			'<a class="span1 DESTORY icon-trash"></a>'
		'</li>';

	var dictView = Backbone.View.extend({

		item_template: _.template(ITEM_TEMPLATE),

		events: {
			"keypress .VALUE": "add_to_dict_ByEnter",
			"click .DESTORY": "delete_item",
			"keypress .KEY": "avoid_submit",
		},

		initialize: function() {
			this.INITIAL_TEMPLATE = this.generate_initial_template();
			$(this.el).append(_.template(this.INITIAL_TEMPLATE));
			var data = $(this.el).attr("data");
			if(data===undefined)
				this.value = {};
			else {
				this.value = eval("(" + data +")");
				var that = this;
				var keys = Object.keys(this.value);
				keys.forEach(function(k) {
					that.$(".ADDED_ITEMS_CONTAINER ul").append(that.item_template({key:k,value:(that.value)[k]}));
				});
			}
		},

		generate_initial_template: function() {
			var k_field = '<input class="KEY" type="text"/>';
			var v_field = '<input class="VALUE" type="text"/>';
 			var k_options = $(this.el).attr("k_options");
			if(k_options!==undefined) {
				k_field = '<select class="KEY">';
				k_options_value = k_options.split(",");
				for(var i=0, length=k_options_value.length; i<length; i++) {
					k_field = k_field + 
						'<option value="' + k_options_value[i] + '">' + k_options_value[i] + '</option>'
				}
				k_field = k_field + '</select>';
			}

			var v_options = $(this.el).attr("v_options");
			if(v_options!==undefined) {
				v_field = '<select class="VALUE">';
				v_options_value = v_options.split(",");
				for(var i=0, length=v_options_value.length; i<length; i++) {
					v_field = v_field + 
						'<option value="' + v_options_value[i] + '">' + v_options_value[i] + '</option>'
				}
				v_field = v_field + '</select>';
			}

			INITIAL_TEMPLATE = '<div class="CREATION_CONTAINER">'+
				k_field + " : " + v_field + '</div>' +
				'<div class="ADDED_ITEMS_CONTAINER"><ul class="unstyled"></ul></div>';
			return INITIAL_TEMPLATE;

		},

		avoid_submit: function(event) {
			if(event.keyCode==13) event.preventDefault();
		},

		add_to_item: function(k,v) {
			if(this.value[k]!==undefined) {
				var deleted_item = this.$(".ADDED_ITEMS_CONTAINER ul .ITEM_KEY[key='"+ k + "']").parent("li");
				$(deleted_item).remove();
			}
			this.value[k] = v;
			this.$(".ADDED_ITEMS_CONTAINER ul").prepend(this.item_template({key:k,value:v}));
			this.$(".KEY").val("").focus();
			this.$(".VALUE").val("");
		},

		add_to_dict_ByEnter: function(event) {	
			if(event.keyCode==13) {
				event.preventDefault();
				var k = this.$(".KEY").val();
				var v = this.$(".VALUE").val();
				if(k&&v) {
					this.add_to_item(k,v);
				}
			}
		},

		delete_item: function(event) {
			var item_container = $(event.currentTarget).parent("li");
			delete this.value[$(item_container).find(".ITEM_KEY").html()];
			item_container.remove();
		},
	});
	
	var dicts = $("div.dict");
	dictapps = [];
	for(var i=0, length=dicts.length; i<length; i++) {
		dictapps.push(new dictView({el:$(dicts[i])}));
	}
	$(dicts).__proto__.getDictValue = function(index) {
		return JSON.stringify(dictapps[index].value);
	}

});

$(function() {

	var ITEM_CONTAINER =
		'<li class="row">' +
			'<span class="span2"><%- item_content %></span>' +
			'<a class="span1 DESTORY icon-trash"></a>'
		'</li>';

	var listView = Backbone.View.extend({
		el: $("div.list"),

		item_template: _.template(ITEM_CONTAINER),

		events: {
			"click .ADD_TO_LIST": "add_item_ByClick",
			"keypress .ITEM": "add_item_ByEnter",
			"click .DESTORY": "delete_item",
		},

		initialize: function() {
			this.element_type = $(this.el).attr("element_class") || "general";
			this.INITIAL_TEMPLATE = this.generate_initial_template();
			$(this.el).append(_.template(this.INITIAL_TEMPLATE));
			var data = $(this.el).attr("data");
			if(data===undefined)
				this.value = [];
			else {
				this.value = eval("(" + data +")");
				var that = this;
				var keys = Object.keys(this.value);
				keys.forEach(function(k) {
					that.$(".ADDED_ITEMS_CONTAINER ul").append(that.item_template({item_content:that.value[k]}));
				});
			}
		},

		generate_initial_template: function() {

			/* check the element type to decide which input to use */
			var INITIAL_TEMPLATE = '<div class="input-append CREATION_CONTAINER">' +
  				'<input class="ITEM" type="text">' + 
  				'<button class="btn ADD_TO_LIST" type="button">Add</button>' +
			'</div>';
			var options = $(this.el).attr("options");
			if(options!==undefined) {
				options = options.split(",");
				var options_html = ['<select class="ITEM">'];
				options.forEach(function(v) {
					options_html.push('<option value="' + v + '">' + v + '</option>');
				});
				options_html.push('</select>');
				options_html = options_html.join("");
				INITIAL_TEMPLATE = '<div class="input-append CREATION_CONTAINER">' 
					+ options_html + '</div>';
			}
			INITIAL_TEMPLATE = INITIAL_TEMPLATE + '<div class="ADDED_ITEMS_CONTAINER">' +
				'<ul class="unstyled"></ul></div>';

			return INITIAL_TEMPLATE;
 		},

		addItem: function(item_content) {
			this.value.unshift(item_content);
			this.$(".ADDED_ITEMS_CONTAINER ul").prepend(this.item_template({item_content: item_content}));
		},

		add_item_ByClick: function() {
			var item_content = this.$(".ITEM").val();
			if(item_content!=="") {
				this.addItem(item_content);
				this.$(".ITEM").val("");
			}
		},

		add_item_ByEnter: function(event) {
			if(event.keyCode==13) {
				event.preventDefault();
				this.add_item_ByClick();	
			}
		},

		delete_item: function(event) {
			var item_container = $(event.currentTarget).parent("li");
			var index = this.$("ul li").index(item_container);
			this.value.splice(index,1);
			item_container.remove();
		}

	});

	var lists = $("div.list");
	listapps = [];
	for(var i=0, length=lists.length; i<length; i++) {
		listapps.push(new listView({el:$(lists[i])}));
	}
	$(lists).__proto__.getListValue = function(index) {
		return JSON.stringify(listapps[index].value);
	}

});