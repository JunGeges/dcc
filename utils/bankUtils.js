

export const getBankBg = (name) => {
	console.log("name", name);
	// var n = name.indexOf("pinan");
	// console.log("name", n);
	if (name.indexOf("农业") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_ny.png';
	}
	if (name.indexOf("中信") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_zxyh.png';
	}
	if (name.indexOf("兴业") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_xyyh.png';
	}
	if (name.indexOf("邮政") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_yz.png';
	}
	if (name.indexOf("农村信用") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_ncxyhzs.png';
	}
	if (name.indexOf("平安") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_payh.png';
	}
	if (name.indexOf("招商") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_zsyh.png';
	}
	if (name.indexOf("民生") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_msyh.png';
	}
	if (name.indexOf("广发") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_gfyh.png';
	}
	if (name.indexOf("光大") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_gdyh.png';
	}
	if (name.indexOf("华夏") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_hxyh.png';
	}
	if (name.indexOf("交通") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_jtyh.png';
	}
	if (name.indexOf("工商") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_gs.png';
	}
	if (name.indexOf("中国银行") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_zg.png';
	}
	if (name.indexOf("建设") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_js.png';
	}
	if (name.indexOf("浦东") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_bg_pdfzyh.png';
	}
	return 'https://mall.sycncp.cn/static/bankimg/bank_bg_nc_or_cs_syyh.png';
}
	
export const getBankLogo = (name) => {
	if (name.indexOf("农业") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_ny.png';
	}
	if (name.indexOf("中信") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_zxyh.png';
	}
	if (name.indexOf("兴业") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_xyyh.png';
	}
	if (name.indexOf("邮政") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_yz.png';
	}
	if (name.indexOf("农村信用") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_ncxyhzs.png';
	}
	if (name.indexOf("平安") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_payh.png';
	}
	if (name.indexOf("招商") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_zsyh.png';
	}
	if (name.indexOf("民生") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_msyh.png';
	}
	if (name.indexOf("广发") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_gfyh.png';
	}
	if (name.indexOf("光大") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_gdyh.png';
	}
	if (name.indexOf("华夏") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_hxyh.png';
	}
	if (name.indexOf("交通") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_jtyh.png';
	}
	if (name.indexOf("工商") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_gs.png';
	}
	if (name.indexOf("中国银行") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_zg.png';
	}
	if (name.indexOf("建设") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_js.png';
	}
	if (name.indexOf("浦东") >= 0) {
		return 'https://mall.sycncp.cn/static/bankimg/bank_icon_pdfzyh.png';
	}
	return '';
}