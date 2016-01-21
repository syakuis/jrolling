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
			'items': null, // 대상
			'width': null, // 대상 width
			'height': null, // 대상 height
			'frame': 500, // 흐르는 속도
			'delay': 2000, // 초 후에 흐름
			'move': 'left', // 흐름 방향
			'auto': true, // 자동 흐름 설정
			'prev': null, // 이전 클릭 이벤트
			'next': null, // 다음 클릭 이벤트
			'play': null, // 실행 클릭 이벤트
			'stop': null // 종료 클릭 이벤트
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
		this.version = '1.0.0';

		this.object = object;
		this.target = object.target;
		var $target = this.target;
		// 현재 아이템
		var $index = 0;
		var $timer = null;

		var $width = parseInt(object.options.width);
		var $height = parseInt(object.options.height);

		var $flow = [];
		var $items = null;
		var $size = null;

		var $container = $('<div></div>').css({
			'position': 'relative',
			'overflow': 'hidden',
			'width': object.options.width,
			'height': object.options.height,
		});

		// 현재상태
		var $state = object.options.auto;

		this.init = function() {
			var item_type = typeof object.options.items;
			var items = [];
			// 아이템에 div 덮기.
			if (item_type == 'string') {
				$(object.options.items).each(function(i) {
					var item = $('<div></div>').css({
						'position': 'absolute',
						'left': '0px',
						'top': '0px',
						'width': object.options.width,
						'height': object.options.height,
						'z-index': 0
					}).append($(this));

					$flow.push(i);
					items.push(item);
				});
			} else {

				for(var i in object.options.items) {
					var item = $('<div>' + object.options.items[i] + '</div>').css({
						'position': 'absolute',
						'left': '0px',
						'top': '0px',
						'width': object.options.width,
						'height': object.options.height,
						'z-index': 0
					});

					$flow.push(parseInt(i));
					items.push(item);
				}
			}

			// 대상에 컨테이너 생성.
			$target.append($container.append(items));

			$items = $(items);
			$size = $items.length;

			// 초기 정렬
			this.distance(true);

			// 배열이 한개 인 경우 종료
			if ($size == 1) return;

			// 마우스 오버
			$container.mouseover(function() {
				$this.stop();
			}).mouseout(function() {
				$this.play();
			});

			// 이전 다음 클릭
			if (object.options.prev != null) {
				$(object.options.prev).click(function(event) {
					$this.clickBefore(event, false);
				});
			}

			if (object.options.next != null) {
				$(object.options.next).click(function(event) {
					$this.clickBefore(event, true);
				});
			}

			if (object.options.play != null) {
				$(object.options.play).click(function(event) {
					$this.stop();
					$state = true;
					$this.play();

				});
			}

			if (object.options.stop != null) {
				$(object.options.stop).click(function(event) {
					$state = false;
					$this.stop();
				});
			}

			$this.play();
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

			$target.trigger( "motionBefore", [ $index ] );

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

			$index--;
			if ($index < 0) $index = ($size - 1);

			$target.trigger( "motionAfter", [ $index ] );
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
			$target.trigger( "motionBefore", [ $index ] );
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
			if ($size <= $index) $index = 0;

			$target.trigger( "motionAfter", [ $index ] );
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
			$(object.options.prev).unbind('click');
			$(object.options.next).unbind('click');

			switch(object.options.move) {
				case 'left':
				case 'up':
					$this.nextMotion(function() {
						$this.clickAfter(false);
					});
				break;
				case 'right':
				case 'down':
					$this.prevMotion(function() {
						$this.clickAfter(false);
					});
				break;
			}
		}

		this.play = function() {
			if ($state == true) {
				$timer = setInterval(this.motion, object.options.delay);
			}
		}

		this.stop = function() {
			$timer = clearInterval($timer);
		}

		this.clickBefore = function(event, next) {
			$this.stop();
			$(object.options.prev).unbind('click');
			$(object.options.next).unbind('click');


			if (next == true) {
				this.nextMotion(function() {
					$this.clickAfter();
				});
			} else {
				this.prevMotion(function() {
					$this.clickAfter();
				});
			}
		}

		this.clickAfter = function(play) {
			$(object.options.prev).click(function(event) {
				$this.clickBefore(event, false);
			});

			$(object.options.next).click(function(event) {
				$this.clickBefore(event, true);
			});

			if (play != false) $this.play();
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

		return instance;
	};
	
}));