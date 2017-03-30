/**
 * Created by Administrator on 2016/4/7.
 */
var params = {
    email:"",
    role01:"",
    role02:"",
    role03:"",
    name01:"",
    name02:"",
    name03:"",
    phone01:"",
    phone02:"",
    phone03:"",
    emlhei:"2.66rem",
    conhei: "16.8rem"
};

var wait = 60;
function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value = "发送邮件";
        wait = 60;
        o.style.fontSize = "0.8rem";
        o.style.background = "#f64349";
    } else {
        o.setAttribute("disabled", true);
        o.value = wait + "秒后重新发送";
        o.style.fontSize = "0.6rem";
        o.style.background = "#ccc";
        wait--;
        setTimeout(function () {
                time(o)
            },
            1000)
    }
}

function IsGB(obj) {
    Reg = /^[\u4e00-\u9fa5]+$/;
    if (Reg.test(obj)) {
        return true;
    } else {
        return false;
    }
}

function IsPhone(obj) {
    Reg11 = /^1\d{10}$/;
    Reg10_12 = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/;
    if (obj.substr(0, 1).indexOf("0") > -1) {
        if (Reg10_12.test(obj)) {
            return true;
        } else {
            return false;
        }
    } else if (obj.substr(0, 1).indexOf("1") > -1) {
        if (Reg11.test(obj)) {
            return true;
        } else {
            return false;
        }
    }
    else {
        return false;
    }
}

function showMsg(){
    $.ajax({
        url:"/InterFace/ValidateCenter/ValidateEmail.ashx",
        type:"post",
        dataType:"json",
        cache:false,
        data:{
            "type": "loaduserdata"
        },
        success: function(msg){
            params.email = msg.email;
            params.role01 = msg.role01;
            params.role02 = msg.role02;
            params.role03 = msg.role03;
            params.name01 = msg.name01;
            params.name02 = msg.name02;
            params.name03 = msg.name03;
            params.phone01 = msg.phone01;
            params.phone02 = msg.phone02;
            params.phone03 = msg.phone03;

            if (params.email) {
                $('.rzyzm,.rz_tips').remove();
                $('.emailspan').html(params.email);
                params.emlhei = '2.66rem';
                $('.email_nr').css('height', params.emlhei);
                $("#yxrz_mail").val(params.email);
            }

            if (params.role01) {
                $('#role01').val(params.role01);
            }
            if (params.role02) {
                $('#role02').val(params.role02);
            }
            if (params.role03) {
                $('#role03').val(params.role03);
            }
            chasele();
        }
    });
}

function chasele() {
    if (params.name01) {
        $('#name01').val(params.name01);
    }
    if (params.name02) {
        $('#name02').val(params.name02);
    }
    if (params.name03) {
        $('#name03').val(params.name03);
    }
    if (params.phone01) {
        $('#phone01').val(params.phone01);
    }
    if (params.phone02) {
        $('#phone02').val(params.phone02);
    }
    if (params.phone03) {
        $('#phone03').val(params.phone03);
    }
    if (IsGB($("#name01").val()) && IsGB($("#name02").val()) && IsGB($("#name03").val()) && IsPhone($("#phone01").val()) && IsPhone($("#phone02").val()) && IsPhone($("#phone03").val())) {
        $("#rzbtn").attr("class", "pass");
        $("#rzbtn").removeAttr("disabled");
    } else {
        $("#rzbtn").attr({ "disabled": "", "class": "" });
    }
}

function errShow(obj) {
    if (obj.errmsg || obj.errcode) {
        $("#remind02 .motwo_wz").html(obj.errmsg);
        if (obj.errcode) {
            $("#remind02 .motwo_wz404").html("错误码:" + obj.errcode);
        } else {
            $("#remind02 .motwo_wz404").css("display", "none");
        }
        $("#remind02").css("display", "block");
        return false;
    }
    return true;
}