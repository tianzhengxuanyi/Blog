// 将表单中输入值转换为json格式
function serializeToJson(form){
    var result = {};
    // 将表单输入的内容转换为数组
    var f = form.serializeArray();
    f.forEach(function(item) {
        result[item.name] = item.value;
    })
    return result;
} 