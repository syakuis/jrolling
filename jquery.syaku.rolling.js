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
			'delay': 1000,
			'move': 'left'

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

		$target.css({
			'position': 'absolute',
			'overflow': 'hidden'
		});

		var $flow = [];

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

			// ---- ready 
			//$flow = _jrolling.last2first($flow);
			//

			console.log($flow, $index, $size);
			console.log('wait=============');

			this.distance(true);
		}

		// 위치 선정
		this.prepare = function() {
			//console.log('size', $size, $index);

			$items.each(function(i) {

				// $flow 첫번째는 * -1 두번째는 0 : 이지만 이동하지 않음 애니매이션 처리.
				// 이전에 첫번째 배열은 효과를 주지 않는 다. (마지막은 효과를 주지 않는 다.)
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
				var distance = $width * v;
/*
				var animate = true;
				if (next == true) {
					if (index < 2) animate = false;
				} else if(next == false) {
					if (($size-2) < index) animate = false;
				}
*/
				console.log($size, i, index, v, distance);

				$(this).css({ 'left': distance });

				//if (ready != true && ($size-1) != index) {
/*				if (ready != true) {
					$(this).animate({ 'left': distance }, object.options.frame);
				} else {
					$(this).css({ 'left': distance });
				}*/
				//if (index < 1 && ready != true) {
				//	$(this).animate({ 'left': distance }, object.options.frame);
				//} else {
				//	$(this).css({ 'left': distance });
				//}

				
			});

			//return now;
		}

		// <- 이동
		this.prev = function() {
			$flow = _jrolling.last2first($flow); // 시작점 정리

			this.distance();

			$items.each(function(i) {
				$(this).animate({ 'left': '+=' + object.options.width }, object.options.frame);
			});

			$index++;
			if ($size == $index) $index = 0;
		}
		
		// 이전 거리 계산
		this.prevDistance = function() {
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
				var distance = $width * v;
				arr.push(distance);
			});

			return arr;
		}

		// 거리 계산
		this.distance = function(next) {
			var arr = (next == true) ? this.nextDistance() : this.prevDistance();
			$items.each(function(i) {
				$(this).css({ 'left': arr[i] });
			});
		}

		// -> 이동
		this.next = function() {
			this.distance(true);

			$flow = _jrolling.first2last($flow); // 시작점 정리

			$items.each(function(i) {
				$(this).animate({ 'left': '-=' + object.options.width }, object.options.frame);
			});

			$index++;
			if ($size == $index) $index = 0;
		}

		// 다음 거리 계산
		this.nextDistance = function() {
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
				var distance = $width * v;
				arr.push(distance);
				//console.log($size, i, index, v, distance);
				//$(this).css({ 'left': distance });
			});

			return arr;
		}

		this.motion = function() {

			/*
			1. 준비 : 왼쪽에서 오른쪽 위에서 아래로 좌표 지정
			2. 방향에 따른 아이템 위치 선정.
				-> 이동전에 마지막 아이템을 처음으로
				배열($flow) 이동
				애니 작동
				<- 이동후에 처음 아템을 마지막으로
			
			2. 정리
			*/

			if ($index == 1) { $this.next(); } else { $this.prev(); }

			// 이동방향
			

		//	console.log($flow, $index);
	//		console.log('move=============');

			// 방향에 맞는 위치 선정
			//$this.prepare(false);
			
			// 애니메이션
			//console.log($flow, $index);
			//console.log('move=============');
			//$this.prepara().animate({ 'left': 0 }, object.options.frame);
		}

		this.play = function() {
			//this.motion();
			$timer = setInterval(this.motion, object.options.delay);
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