DictAndListPlugin
=================

It is a plugin for editable Dict and List html, their values can be attached into form as stringifyJSON 
when jQuery post.

It is written in backbonejs, so when you use list_dict.js, **jquery.js**, **backbone.js**, **underscore.js**
are necessary.

List
----

###Example###
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

Dict
----

###Example###

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


