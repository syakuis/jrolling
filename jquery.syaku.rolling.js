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
			'item': null,
			'move': null,

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
		var $item = $(object.options.item);
		var $total = $item.length;
		var $index = 0;
		var $timer = null;
		var $move = object.options.move;

		var style = {
			'position': 'relative',
			'overflow': 'hidden'
		};

		$target.css(style);

		var fn = {
			'o': function(T) {
				var index = T.index();
				if (index == 0)
			},
			'move': function() {
				$item.animate({ 'top': '-=' + $move}, 1000, function() {
					console.log($(this).index());
				});

				$index++;

				if ($index == 1) $this.stop();
			}
		};

		this.init = function() {
			$($item).each(function(i) {
				var top = parseInt($move) * -1;
				if (i < 2) top = parseInt($move) * i;

				$(this).css({
					'position': 'absolute',
					'top': top + 'px'
				});
			});
		}


		this.play = function() {
			$timer = setInterval(fn.move, 2000);
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
		instance.init();
		instance.play();

		return instance;
	};
	
}));