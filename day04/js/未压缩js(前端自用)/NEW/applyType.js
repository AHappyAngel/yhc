/**
 * Created by Administrator on 2016/5/6.
 */
function getApplyType(typeName){
    var obj = {
        typeClass:""
    };
    switch (typeName){
        case"租房":
            obj.typeClass = "zf";
            break;
        case"驾校":
            obj.typeClass = "jx";
            break;
        case"数码":
            obj.typeClass = "sm";
            break;
        case"旅游":
            obj.typeClass = "ly";
            break;
        case"教育":
            obj.typeClass = "jy";
            break;
        case"婚纱摄影":
            obj.typeClass = "hs";
            break;
        case"整形美容":
            obj.typeClass = "mr";
            break;
        case"家用电器":
            obj.typeClass = "jd";
            break;
        case"体验":
            obj.typeClass = "ty";
            break;
        case"健身":
            obj.typeClass = "js";
            break;
        case"家居":
            obj.typeClass = "jj";
            break;
        case"建材":
            obj.typeClass = "jc";
            break;
        case"电商":
            obj.typeClass = "ds";
            break;
        case"现金":
            obj.typeClass = "xjd";
            break;
        case"全网":
            obj.typeClass = "qw";
            break;
        case"任性花-现金":
            obj.typeClass = "knrxh";
            break;
        case"短借":
            obj.typeClass = "djb";
            break;
        default:
            obj.typeClass = "other";
            break;
    }
    return obj;
}