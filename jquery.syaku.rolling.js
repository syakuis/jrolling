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
			'step': null,
			'frame': 100,
			'delay': 1000,
			'move': 'left' // top, right, bottom, left

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

		// 최종 옵션
		this.object = object;
		this.target = object.target;
		var $target = this.target;
		var $items = $(object.options.items);
		var $count = $items.length;
		var $index = 0;
		var $timer = null;

		$target.css({
			'position': 'relative',
			'overflow': 'hidden'
		});

		$items.css({ 'position': 'relative' });
/*
		$items.css({
			'position': 'absolute',
			'white-space': 'nowrap'
		});
*/
		var move = {};
		move[object.options.move] = null;

		var fn = {

			'move': function() {
				$index++;
				if ($count == $index) $index = 0;

				console.log($count);

				var step = null;
				if ($index == 0) {
					move[object.options.move] = '0';
				} else {
					move[object.options.move] = '-=' + object.options.step;
				}

				$items.animate(move, object.options.frame, function() {
				});
			}
		};

		this.play = function() {
			$timer = setInterval(fn.move, object.options.delay);
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