## jrolling
jrolling 은 jQuery 로 개발된 rolling 플러그인 입니다. 특정 영역을 왼쪽, 오른쪽, 위, 아래로 흐르게 합니다.  
이전에 개발된 `https://github.com/syakuis/jquery-slider-rolling` 을 개선한 플러그인입니다.

> Github: https://github.com/syakuis/jrolling  
데모: http://syakuis.github.io/demo/jrolling/demo.html

### 지원
> 자동 롤링  
왼쪽 오른쪽 위 아래 롤링  
마우스 오버시 작동 멈춤  
버튼을 이용한 이전, 다음 롤링  
자동 흐림 시작 및 멈춤

### 기본 옵션

```
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
```


### 설치

```
bower install jrolling

<script src="./jquery.syaku.rolling.js" /></script>
```

### 실행

```
var jrolling = $('#jrolling').jrolling({
    'items': '#jrolling ul',
    'width': '220px',
    'height': '84px',
    'move': 'up',
    'auto': false,
    'prev': '#prev',
    'next': '#next'
});

jrolling.target.on('motionAfter', function(event, index) {
    $('#jrolling_text').text(index);
});
```

### 이벤트 트리거

```
motionBefore : 이동 전
motionAfter : 이동 후

jrolling.target.on('motionBefore' function(event, index) {
	... todo
});
```