﻿
function loading(page){
	$.ajax({
        url: 'InterFace/RepayMentCenter/RepayPlan.ashx',
        type: 'post',
        dataType: 'json',
        cache: false,
		data: {
			"type" : "loaddata",
			"page" : page
        },
        success: function (msg) {
			var DataList = msg.DataList;
			if(DataList.length<=0){
				window.location.href = "/InterFace/RepayMentCenter/NoPlan.ashx";
				return
			}
			$.each(DataList, function (k ,v){
				var inttype = DataList[k].inttype;
				$("#RepayPlanAdd").append(
					'<li>' + 
					'	<div class="fl repay_lf"><p></p><i></i></div>' + 
					'	<div class="fl repay_rt">' + 
					'		<p class="repayrt_tt">' + DataList[k].repay_month + '</p>' + 
					'		<div class="rert_nr">' + 
					'			<div class="rert_cont">' + 
					'				<div class="fl fqlx">' +
					'					<p class="fqlx_pic"></p>' + 
					'					<p>' + DataList[k].type + '</p>' + 
					'				</div>' + 
					'				<div class="fl fqzlwz">' + 
					'					<p>应还本金:<span>' + DataList[k].left_money + '元</span></p>' + 
					'					<p>利　　息:<span>' + DataList[k].interest_money + '元</span></p>' + 
					'					<p>服 务 费:<span>' + DataList[k].service_money + '元</span></p>' + 
					'				</div>' + 
					'			</div>' + 
					'			<div class="rert_bom"><img src="../../images/NEW/repay01.png"><span>到期还款时间:' + DataList[k].repay_date + '</span></div>' + 
					'		</div>' + 
					'	</div>' + 
					'</li>'
				);
				
				switch (inttype)
				{
					case "0":
						$(".fqlx_pic").eq(k).addClass("zf");
						break;
						
					case "1":
						$(".fqlx_pic").eq(k).addClass("jx");
						break;
						
					case "16":
						$(".fqlx_pic").eq(k).addClass("knrxh");
						break;
						
					case "17":
						$(".fqlx_pic").eq(k).addClass("djb");
						break;
						
					default:
						$(".fqlx_pic").eq(k).addClass("other");
						break;
				}
			});
		}
	});
}