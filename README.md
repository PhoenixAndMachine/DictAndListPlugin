DictAndListPlugin
=================

It is a plugin for editable Dict and List html, their values can be attached into form as stringified JSON 
when processing jQuery post.

It is written in backbonejs, so when you use list_dict.js, list_dict_recursive.js, **jquery.js**, **backbone.js**, 
**underscore.js** are necessary.

There are two files in this plugin, **list_dict.js** and **list_dict_recursive.js**.

1. Using list_dict.js, you can define list and dict without clarifying the type of the elements in them, it simply
	considers all the value as string.
2. Using list_dict_recursive.js. you can define list and dict recursively and also with clarification of the type of 
	elements in them.

```
1. Element in list can be of the type: boolean, int, float, string, enum, dict.
2. Key in item of dict can be of the type: boolean, int, float, string, enum, but since it is the key in dict, 
	it will be always converted into string.
3. Value in item of dict can be of the type: boolean, int, float, string, enum, list.

```

list_dict.js
------------

###List###


####Example####
```
<form id="create_taste_form" action="/create_taste" method="POST">
  <input type="text" name="user"/>
  <div class="list" name="movies"></div>
</form>
```

```<div class="list" name="movies"></div>``` is able to add value as an element to a list named movies.

When posting the form by jQuery, such as 
```
$("#create_taste_form").submit(function(event) {
  event.preventDefault();
	var form = $(event.currentTarget);
	var url = form.attr("action");
	$.post(url, form.serializeArray(), function(data) {
	          ...
	});
});
```

```form.serializeArray()``` or ```form.serializa()``` will look like
```      
      { 
        user: "username",
        movies: ["movie_1_name", "movie_2_name", ...]
      }
```

If you want to have an editable list with initial list, you can define as

```
<div class="list" name="movie" data="['movie_1_name', 'movie_2_name', ..]"></div>
```

If you want to constrain the element value in the list, you can define as

```
<div class="list" options="A,B,C,D"></div>
```
Then it is a select field, you only can select the value from the drop-down.

###Dict###


####Example####

```
<form id="rank_movies_form" action="/rank_movies" method="POST">
  <input type="text" name="user"/>
  <div class="dict" name="rankings"></div>
</form>
```

```<div class="dict" name="rankings"></div>``` is able to add key value pair to a dict named rankings.

When posting the form by jQuery, such as 
```
$("#rank_movies_form").submit(function(event) {
  event.preventDefault();
  var form = $(event.currentTarget);
	var url = form.attr("action");
	$.post(url, form.serializeArray(), function(data) {
	          ...
	});
});
```

```form.serializeArray()``` or ```form.serializa()``` will look like
```      
      { 
        user: "username",
        rankings: {
          "movie_1_name": 4.0, 
          "movie_2_name": 3.5,
                ...     : ...
        }
      }
```

If you want to have an editable dict with initial dict, you can define as

```
<div class="dict" name="ranking" data="{'movie_1_name': 4.0, 'movie_2_name': 3.5, ...}"></div>
```

If you want to constrain the key or value in the dict, you can define as

```
<div class="dict" k_options="m1,m2,m3,m4" v_options="1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0"></div>
```

When **k_options**, **v_options** is defined, the k field or v field is select, you only can select values from
these constrains.

list_dict_recursive.js
----------------------
There are two advantages of list_dict_recursive.js

1. Clarify the type of elements in list or dict
2. Define list and dict recursively

You can find complete examples in [list_dict_recursive.html](https://github.com/PhoenixAndMachine/DictAndListPlugin/blob/master/test/test_recursive.html).
Here, we emphasis on the feature 2: Recursion.

```
<div class="list" element_class="dict" name="lang_explain"
     data="[
     	{	'features':[{'meaning':'m1','pos':'verb'}],
     		'examples':[{'ex':'ex1', 'ex_tr':'ex1 translation'},{'ex':'ex2', 'ex_tr':'ex2 translation'}]
     	}, 
     	{	'features':['menaing':'m2','pos':'noun'}],
     		'examples':[{'ex':'ex1', 'ex_tr':'ex1 translation'}]
     	}]"
     >
     <div class="dict_info" k_class="string" v_class="list" v_element_class="dict"></div>
</div>
```
This piece of code illustrates several points here:

1. A list is called **lang_explain**;
2. Each element of this list stores a dict, which is coded as `element_class="dict"`;
3. Each dict takes a string as its key and a list as its value, which is coded as `k_class="string" v_class="list"`;
4. The value stores a list of dict, which is coded as `v_element_class="dict"`;
5. `data` stores the existing data in this plugin, practically, it stores the data fecth from database.

If you have problems to understand this, in the test suit, there is a full package of example you can play with.
PS: By using console in browser, you can see the post data.

