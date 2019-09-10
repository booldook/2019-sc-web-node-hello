const pagerMaker = (totCnt, grpCnt, divCnt, page) => {
	var cnt = Math.ceil(totCnt / grpCnt); // 전체 페이지 개수
	var stn = 0; // 세트중에 시작페이지
	var edn = 0; // 세트중에 마지막페이지
	var prev = 0; // < 를 클릭시 나타날 페이지 
	var next = 0; // > 를 클릭시 나타날 페이지
	var prevShow = false;	// << 회색(false), 파란색(true)
	var lastShow = false;	// >> 회색(false), 파란색(true)
	var lastIndex = (Math.ceil(cnt / divCnt) - 1); // 페이지 세트의 마지막 index
	var nowIndex = (Math.ceil(page / divCnt) - 1); // 현재페이지 세트의 index
	stn = nowIndex * divCnt + 1; // 세트의 시작페이지 값
	if (cnt < stn + divCnt - 1) edn = cnt;		// 세트의 마지막 페이지 값
	else edn = stn + divCnt - 1;
	if (nowIndex > 0) {
		prevShow = true;
		prev = stn - 1;
	}
	if (lastIndex > nowIndex) {
		lastShow = true;
		next = edn + 1;
	}
	const obj = {totCnt, grpCnt, divCnt, page, cnt, stn, edn, prev, next, prevShow, lastShow, lastIndex, nowIndex};

	return obj;
}

module.exports = {
	pagerMaker
}