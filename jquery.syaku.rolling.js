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
			'frame': 500,
			'delay': 2000,
			'move': 'left',
			'auto': true,
			'prev': null,
			'next': null

		},

		'config': function(options) {
			var O = $.extend(true, { }, _jrolling.options, options);
			O = $.extend({ }, _jrolling, { 'options': O });
			return O;
		},

		'first2last': function(arr) {
			var b = arr.shift();
			arr.push(b);
			return arr;
		},

		'last2first': function(arr) {
			var b = arr.pop();
			arr.unshift(b);
			return arr;
		},

		'order': function(arr, index1, index2) {
			if (index2 >= arr.length) {
				var k = index2 - arr.length;
				while ((k--) + 1) {
					arr.push(undefined);
				}
			}
			arr.splice(index2, 0, arr.splice(index1, 1)[0]);
			return arr; 
		},
		'move': function(move) {
			if ( move == 'left' || move == 'right') {
				return 'left';
			} else {
				return 'top';
			}
		},

		'prevHandler': function(instance) {
			$(instance.object.options.prev).click(function(event) {
				instance.prev(event);
			});
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
		var $size = $items.length;
		var $index = 0;
		var $timer = null;

		var $width = parseInt(object.options.width);
		var $height = parseInt(object.options.height);

		var $flow = [];

		var $container = $('<div></div>').css({
			'position': 'relative',
			'overflow': 'hidden',
			'width': object.options.width,
			'height': object.options.height,
		});

		this.init = function() {
			$items.each(function(i) {
				$(this).css({
					'position': 'absolute',
					'left': '0px',
					'top': '0px',
					'width': object.options.width,
					'height': object.options.height,
					'z-index': 0
				});

				$flow.push(i);
			});

			this.distance(true);

			$target.append($container.append($items));
		}

		// 거리 계산
		this.distance = function(next) {
			var arr = (next == true) ? this.nextDistance() : this.prevDistance();

			// 방향구하기.
			var move = _jrolling.move(object.options.move);

			$items.each(function(i) {
				var _move = JSON.parse( '{ "' + move + '": "' + arr[i] + 'px" }' );
				$(this).css(_move);
			});
		}

		// <- 이동
		this.prevMotion = function(callback) {
			$flow = _jrolling.last2first($flow); // 시작점 정리

			this.distance(false);

			// 방향구하기.
			var move = _jrolling.move(object.options.move);
			var direction = (move == 'top') ? object.options.height : object.options.width;
			var _move = JSON.parse( '{ "' + move + '": "+=' + direction + '" }' );

			$items.each(function() {
				$(this).animate(_move, object.options.frame, function() {
					if ($size-1 == $(this).index()) {
						if (typeof callback === 'function') callback();
					}
				});
			});

			$index++;
			if ($size == $index) $index = 0;
		}
		
		// 이전 거리 계산
		this.prevDistance = function() {
			var move = _jrolling.move(object.options.move);
			var direction = (move == 'top') ? $height : $width;

			var arr = [];
			$items.each(function(i) {
				var index = $flow.indexOf(i);
				var v = null;
				switch(index) {
					case 0: 
						v  = -1; 
					break;
					case 1: 
						v = 0; 
					break;
					default:
						v = index  - 1;
					break;
				}
				var distance = direction * v;
				arr.push(distance);
			});

			return arr;
		}

		// -> 이동
		this.nextMotion = function(callback) {
			this.distance(true);

			$flow = _jrolling.first2last($flow); // 시작점 정리

			// 방향구하기.
			var move = _jrolling.move(object.options.move);
			var direction = (move == 'top') ? object.options.height : object.options.width;
			var _move = JSON.parse( '{ "' + move + '": "-=' + direction + '" }' );
			//console.log(_move);

			$items.each(function(i) {
				$(this).animate(_move, object.options.frame, function() {
					if ($size-1 == $(this).index()) {
						if (typeof callback === 'function') callback();
					}
				});
			});

			$index++;
			if ($size == $index) $index = 0;
		}

		// 다음 거리 계산
		this.nextDistance = function() {
			var move = _jrolling.move(object.options.move);
			var direction = (move == 'top') ? $height : $width;

			var arr = [];
			$items.each(function(i) {
				var index = $flow.indexOf(i);
				var v = null;

				switch(index) {
					case 0: 
						v  = 0; 
					break;
					default:
						v = index;
					break;
				}
				var distance = direction * v;
				arr.push(distance);
			});

			return arr;
		}

		this.motion = function() {
			switch(object.options.move) {
				case 'left':
				case 'up':
					$this.nextMotion();
				break;
				case 'right':
				case 'down':
					$this.prevMotion();
				break;
			}
		}

		this.play = function() {
			if (object.options.auto == true) {
				$timer = setInterval(this.motion, object.options.delay);
			}
		}

		this.stop = function() {
			clearInterval($timer);
		}

		this.timer = function(enable) {
			if (enable == true) this.play();
		}

		this.prev = function(event) {
			this.stop();
			console.log(this.timer());
			$(object.options.prev).unbind('click');

			this.prevMotion(function() {
				$(object.options.prev).click(function(event) {
					$this.prev(event);
				});

				$this.play();
			});

			console.log(this.timer());
		}

		this.next = function(event) {
			this.stop();
			$(object.options.next).unbind('click');

			this.nextMotion(function() {
				$(object.options.next).click(function(event) {
					$this.next(event);
				});

				$this.play();
			});
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

		object.target.mouseover(function() {
			instance.stop();
		}).mouseout(function() {
			instance.play();
		});

		if (object.options.prev != null) {
			$(object.options.prev).click(function(event) {
				instance.prev(event);
			});
		}

		if (object.options.next != null) {
			$(object.options.next).click(function(event) {
				instance.next(event);
			});
		}

		return instance;
	};
	
}));