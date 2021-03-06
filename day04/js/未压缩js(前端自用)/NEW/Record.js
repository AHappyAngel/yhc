/**
 * Created by Administrator on 2016/4/26.
 */
function noData(){
    $(".zkbom").hide();
    $(".zktxt").show();
    setTimeout(function(){
        $(".zktxt").hide();
    }, 1000);
}

function showMsg(page){
    //非首次加载
    if(page != 0){
        $(".zkbom").show();
        $(".zktxt").hide();
    }

    $.ajax({
        url:"/InterFace/PersonalCenter/Record.ashx",
        type:"post",
        dataType:"json",
        data:{
            "type":"loaddata",
            "page":page
        },
        success:function(msg){
            $(".zkbom").hide();
            var data = msg.LoanData, imgClass01 = "", imgClass02 = "", month = "每月还款", period = "月";
            if(0 == data.length){
                noData();
                return;
            }

            for(var i = 0; i < data.length; i++){
                var state, refuse = "", type_text = data[i].Ftype_text,
                    typeClass = getApplyType(data[i].Ftype_text);
                if (type_text.indexOf("任性花") > -1) {
                    type_text = "任性花";
                } else if (type_text.indexOf("短借") > -1) {
                    month = "应 还 款";
                    period = "周";
                }
               
                if(data[i].Fstate == "2" || data[i].Fstate == "101"){
                    state = "不通过";
                    imgClass01 = "reshzt_pic03_h";
                    imgClass02 = "reshzt_pic01_h";
                }else if((parseInt(data[i].Fstate)>=0 && parseInt(data[i].Fstate) <= 7)
                    || data[i].Fstate == "9"){
                    state = "审核中";
                    imgClass01 = 'reshzt_pic03_h';
                    imgClass02 = "reshzt_pic01";
                }else {
                    state = "已放款";
                    imgClass01 = 'reshzt_pic03';
                    imgClass02 = "reshzt_pic01";
                }


                var html = '<div class="fl repay_lf record_lf"><p></p><i></i></div><div class="fl repay_rt">'+
                    '<div class="record_tt"><p class="fl repayrt_tt">'+ data[i].Fcreate_time +'</p><div class="fr record_shzt"><p class="fr wzwz">'+ state +'</p>'+
                    '<p class="fr '+ imgClass01 +'"></p><p class="fr reshzt_pic02 zt_shz"></p><p class="fr '+ imgClass02 +'"></p></div></div><div class="rert_nr">'+
                    '<div class="rert_cont"><div class="fl fqlx"><p class="fqlx_pic ' + typeClass.typeClass + '"></p><p>' + type_text + '</p></div><div class="fl fqzlwz">' +
                    '<p>分期金额:<span>' + data[i].Floan_money + '元</span></p><p>期　　数:<span>' + data[i].Floan_month + period + '</span>' +
                    '<i class="arr"></i>' +
                    '</p><p>' + month + ':<span>' + data[i].Fmonthly_repayment + '元</span></p></div></div>' +
                    '<div class="record_bom"><p class="fl recbom_wzwz"><img src="/InterFace/images/NEW/repay02.png"><span>申请时间:' + data[i].Fcreate_time + '</span></p>' +
                    refuse +'</div></div></div><input type="hidden" value="'+ data[i].Ftrans_id +'">';

                var li = document.createElement("li");
                li.innerHTML = html;
                li.onclick = function(){
                    lookDetail(this);
                }
                var ul = document.getElementById("data");
                ul.appendChild(li);
            }
        }
    })
}

function lookDetail(obj){
    var transid = $(obj).find("input").val();
    window.location.href = "/InterFace/PersonalCenter/Record.ashx?type=Detail&Ftrans_id=" + transid;
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