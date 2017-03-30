/**
 * Created by Administrator on 2016/4/6.
 */
var Params = {
    PayType: "",
    appId: "",
    timeStamp: "",
    nonceStr: "",
    _package: "",
    paySign: "",
	PlanID: "",
	Fid: "",
	Tickets: "",
	paymoney:"",
    Discountmoney:"",
    Day: ""
};

function butSubmit(){
    //判断金额是否正确
    if (($("#paymoney").val() == "" || !/^\d+(.\d{1,2})?$/.test($("#paymoney").val()))) {
        errShow({ "errmsg": "金额格式错误", "errcode": "" });
        $("#paymoney").css({ "font-size": "1rem", "color": "#fec2a5" });
        $("#paymoney").val("请输入部分还款金额");
        return;
    }else if($("#paymoney").val() <= 0 || parseFloat($("#paymoney").val()) > parseFloat($("#hidRemoney").val())){
        errShow({ "errmsg": "金额不能小于0或大于应还款金额", "errcode": "" });
        $("#paymoney").css({ "font-size": "1rem", "color": "#fec2a5" });
        $("#paymoney").val("请输入部分还款金额");
        return;
    }else if(parseFloat($("#paymoney").val()) < parseFloat($("#hidRemoney").val()) && Params.Discountmoney.indexOf("元") >= 0){
        errShow({ "errmsg": "部分还款不能使用优惠券", "errcode": "" });
        return;
    }

	if("0" == Params.PayType || "2" == Params.PayType)
	{
		$("#myform").attr("action", "/InterFace/RepayMentCenter/PayMent.ashx?Type=Submit&PartialMoney=" + $("#paymoney").val() +"&PlanID=" + Params.PlanID + "&Fid=" +Params.Fid + "&Tickets=" + Params.Tickets + "&PayType=" + Params.PayType);	
		$("#myform").submit();
		return;
	}
	
    $.ajax({
        url: "/InterFace/RepayMentCenter/PayMent.ashx",
        type: "post",
        dataType: "json",
        data: {
            "Type": "Submit",
            "PartialMoney": $("#paymoney").val(),
			"PlanID": Params.PlanID,
			"Fid": Params.Fid ,
			"Tickets": Params.Tickets,
			"PayType": Params.PayType
        },
        success: function (msg) {
			Params.appId = msg.appId;
			Params.timeStamp = msg.timeStamp;
			Params.nonceStr = msg.nonceStr;
			Params._package = msg._package;
			Params.paySign = msg.paySign;
			if (typeof WeixinJSBridge == "undefined") {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				}
			} else {
				onBridgeReady();
			}
        }
    });
}


function onBridgeReady() {
    var Vison = navigator.userAgent.split('MicroMessenger/')[1].split('.')[0];
    if (Vison < 5) {
        errShow({"errmsg":"微信版本过低，请升级版本后进行支付","errcode":""});
        return;
    }

    if (Params.appId != "") {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": Params.appId,
                "timeStamp": Params.timeStamp,
                "nonceStr": Params.nonceStr,
                "package": Params._package,
                "signType": "MD5",
                "paySign": Params.paySign
            },
            function (res) {
                if (res.err_msg.indexOf("ok") > -1) {
                    location.href = "/PaySucces.aspx";
                }
            }
        );
    }
}


function showMsg(PlanID) {
    $.ajax({
        url: "/InterFace/RepayMentCenter/PayMent.ashx",
        type: "post",
        dataType: "json",
        data: {
            "Type": "loaddata",
			"PlanID": Params.PlanID,
			"Fid": Params.Fid ,
			"Tickets": Params.Tickets,
			"PayType": Params.PayType
        },
        success: function(msg){
            $("#principal").html(msg.Principal);
            $("#interest").html(msg.Interest_rate);
            $("#service").html(msg.Service_charge);
            $("#defaultRate").html(msg.Default_rate + "元");
            $("#paymoney").val(msg.Remoney);
			Params.paymoney = msg.Remoney;
            $("#hidRemoney").val(msg.Remoney);
            $("#ticket").html(msg.Discountmoney);
            Params.Discountmoney = msg.Discountmoney;
            $("#repayTime").html(msg.Fvalid_date);
            paymoneyBlur();
            if("0" == Params.PayType && "False" == msg.HaveBank){
                $("#remind02 .motwo_wz").html("亲，你还未绑定银行卡！");
                $("#remind02 .motwo_wz404").css("display", "none");
                $("#remind02 .motwo_annv").html("立即绑定");
                $("#remind02 .motwo_annv").on("click", function(){
                    window.location.href = msg.Url;
                });
                $("#remind02").css("display", "block");
                return;
            }
            if(msg.BankImage_Url || msg.BankCard_Text || msg.BankName_Text){
                $("#bankli").find("b").css("background-image", "url("+ msg.BankImage_Url +")");
                $("#card").html(msg.BankCard_Text);
                $("#name").html(msg.BankName_Text);
                $("#banka").attr("href", "/Tenant/Personal/BankCenter.aspx?PlanID=" + PlanID);
                $("#bankli").css("display", "block");
            }
        }
    });
}

function paymoneyBlur() {
    $("#paymoney").on("focusout", function () {
        if (($(this).val() == "" || !/^\d+(.\d{1,2})?$/.test($(this).val()))) {
            errShow({ "errmsg": "金额格式错误", "errcode": "" });
            $("#paymoney").css({ "font-size": "1rem", "color": "#fec2a5" });
            $("#paymoney").val("请输入部分还款金额");
        } else if ($(this).val() <= 0 || parseFloat($(this).val()) > parseFloat($("#hidRemoney").val())) {
            errShow({ "errmsg": "金额不能小于0或大于应还款金额", "errcode": "" });
            $("#paymoney").css({ "font-size": "1rem", "color": "#fec2a5" });
            $("#paymoney").val("请输入部分还款金额");
        }
    });
}

function paymoneyFocus(obj){
    if(!$(obj).attr("readonly")){
        $(obj).val("");
        $(obj).css({"font-size": "2.1rem", "color": "#fff"});
    }
}

function payClick(obj){
    if($(obj).val() == "部分还款"){
        $(obj).removeClass("partpayBut");
        $(obj).addClass("partpaySub");
        $(obj).val("确定");
        $("#paymoney").removeAttr("readonly");
        $("#paymoney").css({"font-size": "1rem", "color": "#fec2a5"});
        $("#paymoney").val("请输入部分还款金额");
    } else if($(obj).val()=="确定"){
        if (($("#paymoney").val() == "" || !/^\d+(.\d{1,2})?$/.test($("#paymoney").val()))) {
            errShow({ "errmsg": "金额格式错误", "errcode": "" });
            $("#paymoney").css({ "font-size": "1rem", "color": "#fec2a5" });
            $("#paymoney").val("请输入部分还款金额");
        } else {
            $(obj).removeClass("partpaySub");
            $(obj).addClass("partpayBut");
            $(obj).val("全额还款");
            $("#paymoney").attr("readonly", "readonly");
        }
    } else {
        $(obj).removeClass("partpaySub");
        $(obj).addClass("partpayBut");
        $(obj).val("部分还款");
        $("#paymoney").attr("readonly", "readonly");
        $("#paymoney").val(Params.paymoney);
    }
}

function is_weixn(){
	var u = navigator.userAgent,
		uto = u.toLowerCase(),
		isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
		isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(uto.match(/MicroMessenger/i)=="micromessenger") {
		$("#weixinTips").css("display","block");
		if(isAndroid){
			$(".tpctxt").attr("class","tpctxt Android");
			$(".tpctxt b").html("在浏览器中打开");
		} else if(isiOS){
			$(".tpctxt").attr("class","tpctxt IOS");
			$(".tpctxt b").html("在Safari中打开");
		}
        return true;
    } else {
        return false;
    }
}

function errShow(obj) {
    if (obj.errmsg || obj.errcode) {
        $("#remind02 .motwo_wz").html(obj.errmsg);
        if(obj.errcode){
            $("#remind02 .motwo_wz404").html("错误码:" + obj.errcode);
        }else {
            $("#remind02 .motwo_wz404").css("display", "none");
        }
        $("#remind02").css("display", "block");
        return false;
    }
    return true;
}