﻿var Params={
		Tickets:"",
		ReturnUrl:"",
		Fid:"",
		PayType:"",
		PlanID:""
	};

function showDiscount(PlanID){
	$.ajax({
		url: '/InterFace/RepayMentCenter/DiscountCenter.ashx',
		type: 'post',
		dataType: "json",
		cache: false,
		data:{
			'Type': 'loaddata',
			'PlanID': PlanID
		},
		success: function(msg){
			var IsLoan = msg.IsLoan,
				DiscountData = msg.DiscountData;
			if(PlanID.length<=0){
				$(".coupon_can,.coupon_bom").css("display","none");
			} else {
				$(".coupon_can,.coupon_bom").css("display","block");
			}
			if(DiscountData.length <= 0){
				$("#no_discount").css("display", "block");
				return;
			}
			$.each(DiscountData, function (k ,v){
				var Money = DiscountData[k].Money,
					State = DiscountData[k].State,
					OutTime = DiscountData[k].OutTime,
					TickID = DiscountData[k].TickID;
				$("#Discount").append(
					'<li>' + 
					'	<p class="fl normal"><i></i></p>' + 
					'	<div class="counr_cont fr">' + 
					'		<div class="cont_lf fl">' + 
					'			<p class="text01">仅用于申请分期使用</p>' + 
					'			<p class="text02"><span>¥</span><b class="money">' + Money + '</b></p>' + 
					'			<p class="text03">' + State + '</p>' +
					'		</div>' + 
					'		<i class="fl borpic"></i>' + 
					'		<div class="cont_rt fl">' + 
					'			<p class="text01">分期x优惠券</p>' + 
					'			<p class="text02">有效期至' + OutTime + '</p>' + 
					'			<p class="text03">仅用于申请分期使用</p>' + 
					'		</div>' + 
					'	</div>' + 
					'	<input name="" id="radio_0' + k + '" type="checkbox" money="' + Money + '" tickID="' + TickID + '">' + 
					'	<label for="radio_0' + k + '"></label>' + 
					'</li>'
				);
				
				if(State == "已使用"){
					$(".counr_cont").eq(k).addClass("used");
					$(".counr_cont").eq(k).append('<i class="pic"></i>');
				} else if(State == "已过期"){
					$(".counr_cont").eq(k).addClass("expired");
					$(".counr_cont").eq(k).append('<i class="pic"></i>');
				}
			});
			
			tabDiscount(IsLoan)
		}
	});
	//全不选
	$(".coupon_can").click(function(){
		window.location.href = "/InterFace/RepayMentCenter/" + Params.ReturnUrl + "?Tickets=&Fid=" + Params.Fid + "&PayType=" + Params.PayType + "&PlanID=" + Params.PlanID;
	});
}

function tabDiscount(IsLoan){
	$(".coupon_nr ul li label").each(function(i) {
        $(this).click(function (){
			var used = $(".coupon_nr ul li .counr_cont").eq(i).hasClass("used"),
				expired = $(".coupon_nr ul li .counr_cont").eq(i).hasClass("expired");
			
			//已使用，过期的不可选中
			if( used || expired ){
				$(".coupon_nr ul li label").eq(i).removeAttr("for");
				return
			}
			//可选优惠券个数
			if(IsLoan=="true"){
				only(i)
			} else {
				infinitely(i)
			}
		});
    });
	
	//合计金额
	$(".coupon_nr ul li input:checkbox").change(function(){
		var total = $(".coupon_nr ul li input:checkbox:checked"),
			allTickets = "",
			alltotalMoney = 0;
		for(var x=0; x<total.length; x++){
			totalMoney = Number(total.eq(x).attr("money"));
			alltotalMoney += totalMoney;
			
			Tickets = total.eq(x).attr("tickID"),
			allTickets += Tickets + ",";
		}
		$("#total span").html(alltotalMoney.toFixed(2));
		$("#allTickets").val(allTickets);
	})
	
}

function only(i){
	var cont = $(".counr_cont"),
		normal = $(".normal");
	if( !$(".coupon_nr ul li input").eq(i).is(':checked') ){
		normal.removeClass("pass");
		normal.eq(i).addClass("pass");
		cont.removeClass("pass");
		cont.eq(i).addClass("pass");
		
		$(".coupon_nr ul li input").attr("checked",false);
		$(".coupon_nr ul li").eq(i).parent("input").attr("checked",true);
		cont.eq(i).css("transition","width ease-in-out .2s");
	} else {
		normal.eq(i).removeClass("pass");
		cont.eq(i).removeClass("pass");
	}
}

function infinitely(i){
	var cont = $(".counr_cont"),
		normal = $(".normal");
	if( !$(".coupon_nr ul li input").eq(i).is(':checked') ){
		normal.eq(i).addClass("pass");
		cont.eq(i).addClass("pass");
		
		$(".coupon_nr ul li").eq(i).parent("input").attr("checked",true);
		cont.eq(i).css("transition","width ease-in-out .2s");
	} else {
		normal.eq(i).removeClass("pass");
		cont.eq(i).removeClass("pass");
	}
}

function subbtn(){
	var Tickets = $("#allTickets").val();
	$.ajax({
		url: '/InterFace/RepayMentCenter/DiscountCenter.ashx',
		type: 'post',
		dataType: "json",
		cache: false,
		data:{
			'Type': 'Submit',
			'Tickets': Tickets,
			"ReturnUrl": Params.ReturnUrl,
			"Fid": Params.Fid,
			"PayType": Params.PayType,
			"PlanID": Params.PlanID
		},
		success: function(){
			$("#submit").attr("action",Params.ReturnUrl);
			$("#submit").submit();
		}
	});
}