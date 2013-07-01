/*
	recursively defined dict field and list field including configuration
*/
(function() {
	var originalSeriliazeArray = jQuery.fn.serializeArray;
	jQuery.fn.serializeArray = function() {
		/*
			Fetch list DOM and dict DOM on the top level
		*/

		var list_field = $(this).find("div.list:not(.embed)");
		var dict_field = $(this).find("div.dict:not(.embed)");

		/*
			Fetch original data of form DOM
		*/

		var data = originalSeriliazeArray.apply(this, arguments);
	
		/*
			Add data of list and dict into form data
		*/

		for(var i=0, length=list_field.length; i<length; i++) {
			var name = $(list_field[i]).attr("name");
			data.push({name:name, value: $(list_field).getListValue(name)});
		}
	
		for(var i=0, length=dict_field.length; i<length; i++) {
			var name = $(dict_field[i]).attr("name");
			data.push({name: name, value: $(dict_field).getDictValue(name)});
		}

		/*
			Return the final form data, which includs data from list and dict
		*/
		return data;
	}
})();

$(function() {

	var get_select_dom = function(element_name, options) {
		html = ["<select element_name='" + element_name + "'>"];
		var keys = Object.getOwnPropertyNames(options).slice(0,options.length);
		keys.forEach(function(k) {
			var display_value = k;
			if(options.length!==undefined) display_value = options[k];
			html.push("<option value='" + options[k] + "'>" + display_value + "</option>");
		});
		html.push("</select>");
		return html.join("");
	}

	var get_radio_dom = function(element_name, options) {
		var html = [];
		var keys = Object.getOwnPropertyNames(options);
		keys.forEach(function(k) {
			html.push(
				"<input type='radio' name='" + element_name + "' value='" + options[k] + "'/>" + 
				k);
		});
		return html.join("");		
	}

	var get_text_dom = function(element_name, options) {
		return "<input type='text' element_name='" + element_name + "'/>";
	}

	var get_int_dom = function(element_name, options) {
		return "<input type='number' element_name='" + element_name + "'/>";
	}

	var get_float_dom = function(element_name, options) {
		return "<input type='number' step=0.000001 element_name='" + element_name + "'/>";
	}

	AUX_FIELD_HTML_FN = {
		"select": get_select_dom,
		"radio": get_radio_dom,
		"text": get_text_dom,
		"int": get_int_dom,
		"float": get_float_dom,
	}

});

$(function() {
	generate_boolean_field_html = function(configuration) {
		configuration["html_type"] = configuration["html_type"] || "radio";
		var html_type = configuration["html_type"];
		var options = configuration["options"] || {"YES":true, "NO": false};
		var element_name = configuration["element_name"];
		return AUX_FIELD_HTML_FN[html_type](element_name, options);
	}

	generate_int_field_html = function(configuration) {
		configuration["html_type"] = configuration["html_type"] || "int";
		var html_type = configuration["html_type"]
		var element_name = configuration["element_name"];
		var options = configuration["options"];
		return AUX_FIELD_HTML_FN[html_type](element_name, options);		
	}

	generate_float_field_html = function(configuration) {
		configuration["html_type"] = configuration["html_type"] || "float";
		var html_type = configuration["html_type"];
		var element_name = configuration["element_name"];
		var options = configuration["options"];
		return AUX_FIELD_HTML_FN[html_type](element_name, options);		
	}

	generate_string_field_html = function(configuration) {
		configuration["html_type"] = configuration["html_type"] || "text";
		var html_type = configuration["html_type"];
		var element_name = configuration["element_name"];
		var options = configuration["options"];
		return AUX_FIELD_HTML_FN[html_type](element_name, options);		
	}

	generate_enum_field_html = function(configuration) {
		configuration["html_type"] = configuration["html_type"] || "select";
		var enum_value_type = configuration["enum_value_type"] || "string";
		configuration["options"] = configuration["options"] || {};
		return window["generate_" + enum_value_type + "_field_html"](configuration);
	}

	generate_list_field_html = function(configuration) {
		var html = [];
		html.push("<div class='list embed' element_class='" + 
			configuration['element_class'] + 
			"' name='" + configuration['element_name'] + "'>");
		if(configuration["element_class"] === "dict") {
			k_class = configuration["k_class"];
			k_options = configuration["k_options"];
			v_class = configuration["v_class"];
			v_options = configuration["v_options"];
			var embed_dict_info = "<div class='dict_info' k_class='" + k_class + "' v_class='" + v_class + "'";
			if(k_options) {
				embed_dict_info = embed_dict_info + " k_options=" + k_options;
			}
			if(v_options) {
				embed_dict_info = embed_dict_info + " v_options=" + v_options;
			}
			embed_dict_info = embed_dict_info + " ></div>";
			html.push(embed_dict_info);
		}
		html.push("</div>");
		return html.join("");
	}

	generate_dict_field_html = function(configuration) {
		var k_class = configuration["k_class"] || "string";
		var v_class = configuration["v_class"] || "string";
		var k_options = configuration["k_options"];
		var v_options = configuration["v_options"];
		var html = [];
		var embed_dict = "<div class='dict embed' k_class='" + k_class +
			"' v_class='" + v_class + "' name='" + configuration["element_name"] + "'"
		if(k_options) {
			embed_dict = embed_dict + " k_options=" + k_options;
		}
		if(v_options) {
			embed_dict = embed_dict + " v_options=" + v_options;
		}
		embed_dict = embed_dict + ">";

		html.push(embed_dict);
		
		if(v_class==="list")
			html.push("<div class='list_info' element_class='" + 
				configuration["list_element_class"] + "'></div>");
		html.push("</div>");
		return html.join("");
	}

	FIELD_HTML_FN = {
		"boolean": generate_boolean_field_html,
		"int": generate_int_field_html,
		"float": generate_float_field_html,
		"string": generate_string_field_html,
		"enum": generate_enum_field_html,
		"list": generate_list_field_html,
		"dict": generate_dict_field_html,
	}
});

$(function() {
	get_value_from_dom = function(dom, html_type, eval_or_not) {
		var value = null;
		if(html_type==="radio") {
			value = dom.filter(":checked").val();
		}
		else if(html_type==="list_field") {
			value = listapps[dom.attr("name")].value;
			listapps[dom.attr("name")].value = [];
			
		}
		else if(html_type==="dict_field") {
			value = dictapps[dom.attr("name")].value;
			dictapps[dom.attr("name")].value = {};
		}
		else {
			value = dom.val();
		}
		if(eval_or_not) value = eval(value);
		return value;
	}

	clean_value_of_dom = function(dom, html_type) {
		if(html_type==="radio") {
			dom.filter(":checked").removeAttr("checked");
		}
		else {
			dom.val("");
		}
	}
});

$(function() {

	/*
		ITEM_CONTAINER IS THE HTML FOR DISPLAYING ELEMENTS IN DICT WHICH HAVE EXISTED.
	*/

	var ITEM_CONTAINER =
		'<li class="row">' +
			'<span class="span1 ITEM_KEY" key="<%- key %>"><%- key %></span>' +
			'<span class="span1">:</span><span class="span2 ITEM_VALUE"><%- value %></span>' +
			'<a class="span1 DESTORY icon-trash"></a>'
		'</li>';

	/*
		THE VIEW FOR DICT
	*/

	dictView = Backbone.View.extend({

		/*
			item_template is the template for displaying elements in dict 
			which have existed. It is compiled from ITEM_CONTAINER
		*/

		item_template: _.template(ITEM_CONTAINER),

		events: {
			"click .DESTORY": "delete_item",
			"keypress .KEY": "avoid_submit",
		},

		/*
			Initialize the view of dict, several tasks are finished here:
		*/

		initialize: function() {
			var that = this;

			/*
				k_class === the type of key of element in dict
				v_class === the type of value of element in dict
			*/

			this.k_class = $(this.el).attr("k_class");
			this.v_class = $(this.el).attr("v_class");

			/*
				The configuration parameters for drawing html of 
				editing field of key in dict view
			*/

			this.k_configuration = {};
			this.k_configuration["html_type"] = $(this.el).attr("k_html_type");
			this.k_configuration["options"] = eval("(" + $(this.el).attr("k_options") + ")");
			this.k_configuration["element_name"] = $(this.el).attr("name") + "_k";

			/*
				The configuration parameters for drawing html of 
				editing field of value in dict view
			*/

			this.v_configuration = {};
			this.v_configuration["html_type"] = $(this.el).attr("v_html_type");
			this.v_configuration["options"] = eval("(" + $(this.el).attr("v_options") + ")");
			this.v_configuration["element_name"] = $(this.el).attr("name") + "_v";

			if(this.v_class==="list") {
				var list_info = $(this.el).find(".list_info");
				this.v_configuration["element_class"] = (list_info && list_info.attr("element_class")) || "string";
				this.v_configuration["html_type"] = "list_field";
				if(this.v_configuration["element_class"]==="dict") {
					this.v_configuration["k_class"] = 
						(list_info && list_info.attr("k_class")) || "string";
					this.v_configuration["k_options"] = 
						(list_info && list_info.attr("k_options"));
					this.v_configuration["v_class"] =
						(list_info && list_info.attr("v_class")) || "string";
					this.v_configuration["v_options"] = 
						(list_info && list_info.attr("v_options"));
				}
			}

			/*
				Display dict view
			*/

			this.INITIAL_TEMPLATE = this.generate_initial_template();
			$(this.el).append(_.template(this.INITIAL_TEMPLATE));

			/*
				The fields for editing key and value to create element
			*/

			var creation_item_container = $(this.el).children(".CREATION_CONTAINER");
			this.k_field = creation_item_container.children(".KEY");
			this.v_field = creation_item_container.children(".VALUE");
			
			/*
				The container for displaying added or existed elements in dict
			*/

			this.ELEMENT_CONTAINER = $(this.el).children(".ADDED_ITEMS_CONTAINER").children("ul");
			
			/*
				The button for adding an new key-value item into dict view
			*/

			this.ADD_BUTTON = $(this.el).children(".CREATION_CONTAINER").children(".ADD_TO_DICT");
			
			/*
				Create list views dynamically which are recursively defined 
				in dict view
			*/

			dynamic_lists = $(this.el).find("div.list");
			for(var i=0, length=dynamic_lists.length; i<length; i++) {
				var field = $(dynamic_lists[i]);
				listapps[field.attr("name")] = new listView({el: field});
			}

			/*
				Display existing dict
			*/

			var data = $(this.el).attr("data");
			if(data===undefined)
				this.value = {};
			else {
				this.value = eval("(" + data +")");
				var that = this;
				var keys = Object.keys(this.value);
				keys.forEach(function(k) {
					var v_display_value = (that.value)[k];
					if(that.v_class==="list")
						v_display_value = JSON.stringify(v_display_value);
					that.ELEMENT_CONTAINER.append(that.item_template({key:k,value:v_display_value}));
				});
			}

			/*
				Bind event functions
			*/

			this.ADD_BUTTON.click(function(event) {
				that.add_to_dict_ByClick();	
			});

			this.v_field.filter(":not(.list)").keypress(function(event) {
				that.add_to_dict_ByEnter(event);
			});
		},

		/*
			Generate the template of dict view
		*/

		generate_initial_template: function() {
			
			var k_field = $("<div>" + FIELD_HTML_FN[this.k_class](this.k_configuration) + "</div>");
			k_field.children().addClass("KEY");
			var v_field = $("<div>" + FIELD_HTML_FN[this.v_class](this.v_configuration) + "</div>");
			v_field.children().addClass("VALUE");
			var INITIAL_TEMPLATE = '<div class="CREATION_CONTAINER">'+
				k_field.html() + " : " + v_field.html() + '<button class="btn ADD_TO_DICT" type="button">Add To Dict</button>' + '</div>' +
				'<div class="ADDED_ITEMS_CONTAINER"><ul class="unstyled"></ul></div>';
			return INITIAL_TEMPLATE;

		},

		/*
			Avoid the enter keypress from triggering the action of posting form
		*/

		avoid_submit: function(event) {
			if(event.keyCode==13) event.preventDefault();
		},

		clean_embed_value: function() {
			var embed_container = this.ADD_BUTTON.prev(".embed");
			if(embed_container.length!==0) {
				embed_container = $(embed_container[0]);
				embed_container.children(".ADDED_ITEMS_CONTAINER").children("ul").html("");
			}
		},

		/*
			Add k-v pair as a new element into dict
		*/

		add_to_item: function(k,v) {
			
			if(this.value[k]!==undefined) {

				var deleted_item = this.$(".ADDED_ITEMS_CONTAINER ul .ITEM_KEY[key='"+ k + "']").parent("li");
				$(deleted_item).remove();
			}
			this.value[k] = v;
			if(typeof v==="object" && typeof v[0]==="object")
				v = JSON.stringify(v);
			this.ELEMENT_CONTAINER.prepend(this.item_template({key:k,value:v}));
			clean_value_of_dom(this.k_field, this.k_configuration["html_type"]);
			clean_value_of_dom(this.v_field, this.v_configuration["html_type"]);
			this.clean_embed_value();
		},

		/*
			Function triggered by clicking ADD_TO_DICT button
		*/

		add_to_dict_ByClick: function() {
			var k = get_value_from_dom(
				this.k_field, 
				this.k_configuration["html_type"],
				0);
			var v = get_value_from_dom(
				this.v_field, 
				this.v_configuration["html_type"],
				this.v_class!=="string" && this.v_class!=="list");
			if(k!==undefined&&v!==undefined&&k!=="") {
				this.add_to_item(k,v);
			}

		},

		/*
			Function triggered by press enter key in the v_field
		*/

		add_to_dict_ByEnter: function(event) {	
			if(event.keyCode==13) {
				event.preventDefault();
				this.ADD_BUTTON.trigger("click");
			}
		},

		/*
			Delete an element from dict triggered by clicking DELETE icon
		*/

		delete_item: function(event) {
			var item_container = $(event.currentTarget).parent("li");
			delete this.value[$(item_container).find(".ITEM_KEY").attr("key")];
			item_container.remove();
		},
	});
	


});

$(function() {

	/*
		ITEM_CONTAINER IS THE HTML FOR DISPLAYING ELEMENTS IN LIST WHICH HAVE EXISTED.
	*/

	var ITEM_CONTAINER =
		'<li class="row">' +
			'<span class="span2"><%- item_content %></span>' +
			'<a class="span1 DESTORY icon-trash"></a>'
		'</li>';

	/*
		THE VIEW FOR LIST
	*/

	listView = Backbone.View.extend({

		/*
			item_template is the template for displaying elements in list 
			which have existed. It is compiled from ITEM_CONTAINER
		*/

		item_template: _.template(ITEM_CONTAINER),

		events: {
			"click .DESTORY": "delete_item",
		},

		/*
			Initialize the view of list, several tasks are finished here:
		*/

		initialize: function() {
			var that = this;

			/* 
				The name of list, which you want to be the variable to store list content 
				and also to be post.
			*/

			this.name = $(this.el).attr("name");

			/*
				The type of element in list
			*/

			this.element_class = $(this.el).attr("element_class") || "string";


			/*
				The configuration parameters for drawing html of 
				editing field of list view
			*/

			this.configuration = {};
			this.configuration["element_name"] = this.name + "_element";
			this.configuration["options"] = eval("(" + $(this.el).attr("options") + ")");
			this.configuration["html_type"] = $(this.el).attr("html_type");

			if(this.element_class==="dict") {
				var dict_info = $(this.el).find(".dict_info");
				this.configuration["k_class"] = (dict_info && dict_info.attr("k_class")) || "string";
				this.configuration["v_class"] = (dict_info && dict_info.attr("v_class")) || "string";
				this.configuration["k_options"] = (dict_info && dict_info.attr("k_options"));
				this.configuration["v_options"] = (dict_info && dict_info.attr("v_options"));
				if(this.configuration["v_class"]==="list")
					this.configuration["list_element_class"] = 
						(dict_info && dict_info.attr("v_element_class")) || "string";
				this.configuration["html_type"] = "dict_field";
			}

			/*
				Display list view
			*/

			this.INITIAL_TEMPLATE = this.generate_initial_template();
			$(this.el).append(_.template(this.INITIAL_TEMPLATE));

			/*
				The button for adding an new element into list view
			*/

			this.ADD_BUTTON = $(this.el).children(".CREATION_CONTAINER").children(".ADD_TO_LIST");
			
			/*
				The container for displaying added or existed elements in list
			*/

			this.ELEMENT_CONTAINER = $(this.el).children(".ADDED_ITEMS_CONTAINER").children("ul");

			/*
				The field for editing and creating element
			*/

			this.ELEMENT_EDIT_FIELD = $(this.el).children(".CREATION_CONTAINER").children(".ELEMENT");

			/*
				Display existing list
			*/

			var data = $(this.el).attr("data");
			if(data===undefined || data==="")
				this.value = [];
			else {
				this.value = eval("(" + data +")");
				var keys = Object.keys(this.value);
				keys.forEach(function(k) {
					var display_value = that.value[k];
					if(that.element_class==="dict")
						display_value = JSON.stringify(display_value);
					that.ELEMENT_CONTAINER.append(that.item_template({item_content:display_value}));
				});
			}

			/*
				Create dict views dynamically which are recursively defined 
				in list view
			*/

			dynamic_dicts = $(this.el).find("div.dict");
			for(var i=0, length=dynamic_dicts.length; i<length; i++) {
				var field = $(dynamic_dicts[i]);
				dictapps[field.attr("name")] = new dictView({el:field});
			}

			/*
				Bind event functions
			*/

			this.ADD_BUTTON.click(function(event) {
				that.add_item_ByClick();	
			});

			this.ELEMENT_EDIT_FIELD.filter(":not(.dict)").keypress(function(event) {
				that.add_item_ByEnter(event);
			});
		},

		/*
			Generate the template of list view
		*/

		generate_initial_template: function() {

			var LIST_ELEMENT_HTML = $("<div>" + FIELD_HTML_FN[this.element_class](this.configuration) + "</div>");
			LIST_ELEMENT_HTML.children().addClass("ELEMENT");
			var INITIAL_TEMPLATE = '<div class="CREATION_CONTAINER">' +
  				LIST_ELEMENT_HTML.html() +
  				'<button class="btn ADD_TO_LIST" type="button">Add To List</button>' +
			'</div>';
		
			INITIAL_TEMPLATE = INITIAL_TEMPLATE + '<div class="ADDED_ITEMS_CONTAINER">' +
				'<ul class="unstyled"></ul></div>';
			return INITIAL_TEMPLATE;
 		},


		clean_embed_value: function() {
			var embed_container = this.ADD_BUTTON.prev(".embed");
			if(embed_container.length!==0) {
				embed_container = $(embed_container[0]);
				embed_container.children(".ADDED_ITEMS_CONTAINER").children("ul").html("");
			}
		},

 		/*
 			Add an element to list
 		*/

		addItem: function(item_content) {
			this.value.unshift(item_content);
			if(typeof item_content==="object")
				item_content = JSON.stringify(item_content);
			this.ELEMENT_CONTAINER.prepend(this.item_template({item_content: item_content}));
		},

		/*
			Function triggered by clicking ADD_TO_LIST button
		*/

		add_item_ByClick: function() {
		//	var item = this.$(".CREATION_CONTAINER").children(".ELEMENT");
			var html_type = this.configuration["html_type"];
			var eval_or_not = 
				(this.element_class==="enum" && $(this.el).attr("enum_value_type")!=="string") 
				|| (this.element_class!=="enum" && this.element_class!=="string" && this.element_class!=="dict");
			item_content = get_value_from_dom(
				this.ELEMENT_EDIT_FIELD, html_type, eval_or_not);
			if(item_content!=="" && item_content!==undefined) {
				this.addItem(item_content);
				clean_value_of_dom(this.ELEMENT_EDIT_FIELD, html_type);
				this.clean_embed_value();
			}
		},

		/*
			Function triggered by press enter key in the creating field
		*/

		add_item_ByEnter: function(event) {
			if(event.keyCode==13) {
				event.preventDefault();
				this.ADD_BUTTON.trigger("click");	
			}
		},

		/*
			Delete an element from list triggered by clicking DELETE icon
		*/

		delete_item: function(event) {
			var ct = $(event.currentTarget);
			var item_container = ct.parent("li");
			var index = ct.parents(".ADDED_ITEMS_CONTAINER").find("ul li").index(item_container);
			this.value.splice(index,1);
			item_container.remove();
		}
	});
});

$(function() {

	var lists = $("div.list");
	var dicts = $("div.dict");

	/*
		Keep listapps and dictapps as global variables,
		since list and dict views also can be defined recursively.
		Global variables are able to keep those list views and dict views dynamically
	*/

	listapps = {};
	dictapps = {};

	for(var i=0, length=lists.length; i<length; i++) {
		listapps[$(lists[i]).attr("name")] = new listView({el:$(lists[i])});
	}
	
	for(var i=0, length=dicts.length; i<length; i++) {
		dictapps[$(dicts[i]).attr("name")] = new dictView({el:$(dicts[i])});
	}

	/*
		Define accessing functions in order to get value of list and dict
	*/

	$("div.list").__proto__.getListValue = function(name) {
		return JSON.stringify(listapps[name].value);
	}

	$("div.dict").__proto__.getDictValue = function(name) {
		return JSON.stringify(dictapps[name].value);
	}
});