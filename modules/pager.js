const pagerMaker = (totCnt, grpCnt, divCnt, page) => {
	const obj = {
		totCnt,
		grpCnt,
		divCnt,
		page
	};
	
	return obj;
}

module.exports = {
	pagerMaker
}