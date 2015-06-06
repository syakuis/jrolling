/**
 * jQuery Rolling
 *
 * @depend jQuery http://jquery.com
 *
 * Copyright (c) Seok Kyun. Choi. 최석균
 * Licensed under the MIT license.
 * http://opensource.org/licenses/mit-license.php
 *
 * registered date 2015-06-05
 * http://syaku.tistory.com
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(jQuery);
	}
} (function($) {
	'use strict';

	// private
	var _jrolling = {
		'options': {
			'items': null,
			'width': null,
			'height': null,
			'frame': 100,
			'delay': 1000,
			'move': 'left'

		},

		'config': function(options) {
			var O = $.extend(true, { }, _jrolling.options, options);
			O = $.extend({ }, _jrolling, { 'options': O });
			return O;
		}
	};

	// class
	function jrolling(object) {
		var $this = this;
		this.version = '0.0.1';

		this.object = object;
		this.target = object.target;
		var $target = this.target;
		var $items = $(object.options.items);
		var $count = $items.length;
		var $index = 0;
		var $timer = null;

		var $width = parseInt(object.options.width);
		var $height = parseInt(object.options.height);

		$target.css({
			'position': 'relative',
			'overflow': 'hidden'
		});

		var container_size = {};
		var items_size = {};
		switch(object.options.move) {
			case 'left': 
			case 'right': 
				container_size = { 'width': ($width * $count) + 'px' };
				items_size = { 'width': object.options.width };
			break;
			case 'up': 
			case 'down': 
				container_size = { 'height': ($height * $count) + 'px' };
				items_size = { 'height': object.options.height };
			break;
		}

		//var $container = $('<div style="position: absolute;overflow:hidden;"></div>').css(container_size);
		//$target.append($container);
		//$container.append($items);

		$items.each(function(i) {
			$(this).css({ 'position': 'absolute' , 'left': ($width * i) + 'px' }).css(items_size);
		});

		var fn = {

			'move': function() {
				$target.append( $items.first() );
				$items.animate({ 'left': '-=' + object.options.width }, { 'duration': object.options.frame, 'step': function(x, t) {
					//var t = $(this);
					console.log(t);
					//if (t.index() == 0) 

				} });
			},
			'prepara': function() {
				$target.append($items.first());
				//$items = $(object.options.items);
				//$(object.options.items).first().css({ 'left': '0px' });
				$(object.options.items).first().next().css({ 'left': object.options.width });
			}
		};

		this.play = function() {
			fn.move();
			//$timer = setInterval(fn.move, object.options.delay);
		}

		this.stop = function() {
			clearInterval($timer);
		}
	};

	// api support
	$.jrolling = {
		// 기본 옵션 변경
		'config': function(options) {
			$.extend(true, _jrolling.options, options);
		},
		// 기본 옵션 
		'options': _jrolling.options
	}
	
	$.fn.jrolling = function(options) {
		var object = _jrolling.config(options);
		object.target = this;

		var instance = new jrolling( object );
		//instance.init();
		instance.play();

		return instance;
	};
	
}));