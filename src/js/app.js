/**
 * Created by chenguojun on 8/10/16.
 */
;
(function ($, window, document, undefined) {
    window.App = {
        href: window.location.origin,
        requestMapping: {}
    };

    /**
     * 下载文件
     * @param href
     */
    App.download = function (href) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', ".." + href, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status === 200) {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                var type = xhr.getResponseHeader('Content-Type');
                var blob = new Blob([this.response], {type: type});
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing
                    // the blob for which they were created. These URLs will no longer resolve as
                    // the data backing the URL has been freed."
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100);
                }
            }
        };
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Auth-Token', App.token);
        xhr.send();
    }

    App.scrollTo = function (el, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;
        if (el) {
            if ($("body").hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            } else if ($('body').hasClass('page-header-top-fixed')) {
                pos = pos - $('.page-header-top').height();
            } else if ($('body').hasClass('page-header-menu-fixed')) {
                pos = pos - $('.page-header-menu').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    };


    App.scrollToDiv = function (el, div, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;
        if (el) {
            if ($("body").hasClass('page-header-fixed')) {
                pos = pos - $('.page-header').height();
            } else if ($('body').hasClass('page-header-top-fixed')) {
                pos = pos - $('.page-header-top').height();
            } else if ($('body').hasClass('page-header-menu-fixed')) {
                pos = pos - $('.page-header-menu').height();
            }
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        div.animate({
            scrollTop: pos
        }, 'slow');
    };

    /**
     * 更改右侧内容标题
     * @param title
     */
    App.title = function (title) {
        $("#main-title").text(title);
    };
    /**
     * 右侧内容方法集合
     * @type {{append: App.body.append, empty: App.body.empty}}
     */
    App.content = {
        append: function (ele) {
            $("#main-body").append(ele);
        },
        empty: function () {
            $("#main-body").empty();
        },
        find: function (ele) {
            return $("#main-body").find(ele);
        }
    };

    /**
     * get请求
     *
     * @param uri
     * @param params
     */
    App.getRequestData = function (uri, params, callback) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result.data);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    } else {
                        App.showMsg(result.message);
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * get请求
     *
     * @param uri
     * @param params
     */
    App.getRequest = function (uri, params, callback) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    } else {
                        App.showMsg(result.message);
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * post请求
     *
     * @param uri
     * @param params
     */
    App.postRequestData = function(uri, params, callback) {
        $.ajax(
            {
                type: 'POST',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result.data);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    } else {
                        App.showMsg(result.message);
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * post请求
     *
     * @param uri
     * @param params
     */
    App.postRequest = function(uri, params, callback) {
        $.ajax(
            {
                type: 'POST',
                url: App.href + uri,
                data: params,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        callback(result);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    } else {
                        App.showMsg(result.message);
                    }
                },
                error: function (err) {
                }
            }
        );
    };

    /**
     * 展示文本
     *
     * @param title
     * @param content
     */
    App.showMsg = function(alertText) {

        $.messager.show({
            height: 42,
            timeout: 1500,
            showSpeed: 200,
            msg: '<i class="fa fa-info-circle"></i>&nbsp; ' + alertText,
            style: {
                right: '',
                top: document.body.scrollTop + document.documentElement.scrollTop + 20,
                bottom: '',
                'z-index': 999,
                'box-shadow': '0 1px 6px rgba(0,0,0,.2)'
            }
        });
    };

    /**
     * 确认窗口展示文本
     *
     * @param confirmText
     */
    App.confirm = function(confirmText, callback) {
        $.messager.confirm('确认', confirmText, function(r) {
            if(r) {
                callback();
            }
        });
    };

    /**
     * 确认窗口输入文本
     *
     * @param promptText
     * @param callback
     */
    App.prompt = function(promptText, callback) {
        $.messager.prompt('提示信息', promptText, function(r) {
            if(r) {
                callback(r);
            }
        });
    }

    App.$content = function () {
        return $("#main-body");
    };

    App.treeSetting = function(data) {
        var chkboxType = data.chkboxType === undefined ? {"Y": "p", "N": "p"} : data.chkboxType;
        var beforeCheck = data.beforeCheck === undefined ? function () {
        } : data.beforeCheck;

        var setting = {
            view: {
                addHoverDom: false,
                removeHoverDom: false,
                selectedMulti: false
            },
            check: {
                enable: true,
                chkStyle: data.chkStyle,
                radioType: "all",
                chkboxType: chkboxType
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true,
                url: data.url,
                type: "POST",
                autoParam: data.autoParam
            },
            edit: {
                enable: false
            },
            callback: {
                beforeCheck: beforeCheck,
                onCheck: function (e, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    var nodes = zTree.getCheckedNodes(true);
                    var ids = [];
                    if (nodes.length > 0) {
                        for (var i in nodes) {
                            ids.push(nodes[i].id);
                        }
                        $("[role='" + treeId + "_input']").val(ids)
                            .attr("value", ids);
                    } else {
                        $("[role='" + treeId + "_input']").val("")
                            .attr("value", "");
                    }
                    $("[role='" + treeId + "_input']").trigger("change");
                },
                onAsyncSuccess: function (event, treeId, treeNode, msg) {
                    var zTree = $.fn.zTree.getZTreeObj(treeId);
                    var value = $("[role='" + treeId + "_input']").attr("value");
                    if (value) {
                        var ids = value.split(",");
                        if (ids.length > 0) {
                            for (var i in ids) {
                                var c_node = zTree.getNodeByParam("id",
                                    ids[i], null);
                                if (c_node) {
                                    zTree.checkNode(c_node, true, false);
                                }
                            }
                        }
                    }
                    zTree.expandAll(true);
                }
            }
        };

        return setting;
    }

    /**
     * 上传图片
     *
     * @param data
     */
    App.uploadImage = function(data) {
        var imageTmpl = '<div><div class="fileinput fileinput-new" data-provides="fileinput">'
            + '<div class="fileinput-preview thumbnail" role="preview" data-trigger="fileinput" style="width: 200px; height: 150px; line-height: 150px;"></div>'
            + '<div role="imageDiv">'
            + '<span class="btn btn-default btn-file">'
            + '<span class="fileinput-new">选择图片 </span>'
            + '<span class="fileinput-exists">更改</span>'
            + '<input drole="main" type="text" role="image-input" id="${id_}" name="${name_}" style="display:none;"><input role="file" type="file" id="image_${id_}" name="file"/>'
            + '</span>'
            + '<a href="javascript:;" class="btn btn-danger fileinput-exists" data-dismiss="fileinput">删除</a>'
            + '</div></div></div>';
        var ele = $.tmpl(imageTmpl, {
            "id_": (data.id === undefined ? data.name : data.id),
            "name_": data.name
        });
        if (data.uploadUrl === undefined) {
            data.uploadUrl = App.href + "/api/common/uploadImage";
        }
        if (data.isAjaxUpload) {
            // 上传符号
            var successIcon = $('<a href="javascript:;" class="btn" style="border-color: white;background:white;cursor:default;"><span class="glyphicon glyphicon-ok" style="color: #45B6AF;cursor:default;"></span></a>');
            successIcon.hide();
            ele.find("[role='imageDiv']").append(successIcon);
            // 删除事件
            /*ele.find('[data-dismiss="fileinput"]').click(function () {
                form._refreshItem(data.name);
            });*/
            // 上传
            var uploadImage = function () {
                if (ele.find("[role='file']").val() == "") {
                    return;
                } else {
                    var file = ele.find("[role='file']").val();
                    var type = file.substring(file.lastIndexOf("."));
                    if (!(type.toLowerCase() == ".jpg"
                        || type.toLowerCase() == ".png"
                        || type.toLowerCase() == ".bmp" || type
                            .toLowerCase() == ".jpeg")) {
                        alert("必须是.jpp,.png,.bmp,.jpeg格式中的一种");
                        return;
                    }
                }

                $.ajaxFileUpload({
                        url: data.uploadUrl,
                        type: "POST",
                        fileElementId: "image_" + data.id,
                        dataType: "json",
                        success: function (json, status) {
                            if (json.code === 200) {
                                json = json.data;
                            } else {
                                alert(json.message);
                                return;
                            }
                            if (ele.find("[role='preview']").length > 0) {
                                var preview = ele
                                    .find("[role='preview']");
                                if (preview.css('height') != 'none') {
                                    var $img = $('<img>');
                                    $img[0].src = json.attachmentUrl;
                                    $img
                                        .css(
                                            'max-height',
                                            parseInt(
                                                preview.css('height'),
                                                10)
                                            - parseInt(
                                            preview
                                                .css('padding-top'),
                                            10)
                                            - parseInt(
                                            preview
                                                .css('padding-bottom'),
                                            10)
                                            - parseInt(
                                            preview
                                                .css('border-top'),
                                            10)
                                            - parseInt(
                                            preview
                                                .css('border-bottom'),
                                            10))
                                    preview.html($img);
                                }

                            }
                            if (data.onSuccess !== undefined) {
                                data.onSuccess(json);
                            } else {
                                if (json.attachmentUrl !== undefined) {
                                    ele
                                        .find(
                                            "[role='image-input']")
                                        .attr("value",
                                            json.attachmentUrl);
                                } else {
                                    console
                                        .error("返回的json数据中为检测到fileUrl值");
                                }
                            }
                            successIcon.show();
                        },
                        error: function (data, status, e) {
                            alert(e);
                        }
                    });
            };
            if (data.autoUpload) {
                ele.find('[role="file"]').on("change", function () {
                    uploadImage();
                });
            } else {
                var upload = $('<a href="javascript:;" role="upload" data-dismiss="fileinput" class="btn btn-primary fileinput-exists">上传 </a>');
                ele.find("[role='imageDiv']").append(upload);
                upload.on("click", function () {
                    uploadImage();
                });
            }
        }
        return ele;
    }

    /**
     * 上传文件
     *
     * @param data
     */
    App.uploadFile = function(data) {
        var fileTmpl = '<div><div class="fileinput fileinput-new" data-provides="fileinput">'
            + '<div class="input-group input-large">'
            + '<div class="form-control uneditable-input span3" data-trigger="fileinput">'
            + '<i class="fa fa-file fileinput-exists"></i>&nbsp; <span class="fileinput-filename "></span>'
            + '</div>'
            + '<span class="input-group-addon btn btn-default btn-file">'
            + '<span class="fileinput-new">选择文件 </span>'
            + '<span class="fileinput-exists">变更 </span>'
            + '<input drole="main" type="text" role="file-input" id="${id_}" name="${name_}" value="" style="display:none;"><input type="file" role="file" id="file_${id_}" name="file"/>'
            + '</span>'
            + '<a href="javascript:;" class="input-group-addon btn btn-danger fileinput-exists" data-dismiss="fileinput">删除 </a>'
            + '</div></div></div>';
        var ele = $.tmpl(fileTmpl, {
            "id_": (data.id === undefined ? data.name : data.id),
            "name_": data.name
        });
        if (data.uploadUrl === undefined) {
            data.uploadUrl = App.href + "/api/common/uploadFile";
        }
        if (data.isAjaxUpload) {

            var uploadFile = function () {
                if ($("#file_" + data.id).val() == "") {
                    return;
                } else {
                    if (data.allowTypes !== undefined) {
                        var file = ele.find("[role='file']").val();
                        var type = file.substring(file.lastIndexOf("."));
                        var allowTypes = data.allowTypes.split(",")
                        var flag = false;
                        for (var i in allowTypes) {
                            if (type.toLowerCase().replace(".", "") == allowTypes[i].toLowerCase().replace(".", "")) {
                                flag = true;
                            }
                        }
                        if (!flag) {
                            alert("只允许上传" + data.allowTypes);
                            return;
                        }
                    }
                }
                $
                    .ajaxFileUpload({
                        url: data.uploadUrl,
                        type: "POST",
                        secureuri: false,
                        fileElementId: "file_" + data.id,
                        dataType: "json",
                        success: function (json, status) {
                            if (json.code === 200) {
                                json = json.data;
                                if (data.onSuccess !== undefined) {
                                    data.onSuccess(json, form);
                                    successIcon.show();
                                } else {
                                    if (json.attachmentUrl !== undefined) {
                                        ele.find("[role='file-input']")
                                            .attr("value", json.attachmentUrl);
                                        successIcon.show();
                                    } else {
                                        console
                                            .error("返回的json数据中未检测到attachmentUrl值");
                                    }
                                }

                                ele.find('[role="file"]').on("change", function () {
                                    uploadFile();
                                });
                            } else {
                                if (data.onError !== undefined) {
                                    data.onError(json, form);
                                    successIcon.show();
                                } else {
                                    App.showMsg(json.message);
                                }

                            }
                        },
                        error: function (data, status, e) {
                            App.showMsg(e);
                        }
                    });
            };
            if (data.autoUpload) {
                ele.find('[role="file"]').on("change", function () {
                    uploadFile();
                });
            } else {
                var upload = $('<a href="javascript:;" role="upload" class="input-group-addon btn btn-primary fileinput-exists">上传 </a>');
                ele.find(".input-group").append(upload);
                upload.click(function () {
                    uploadFile();
                });
            }
            var successIcon = $('<a href="javascript:;" class="input-group-addon btn" style="border-color: white;background:white;cursor:default;"><span class="glyphicon glyphicon-ok" style="color: #45B6AF;cursor:default;"></span></a>');
            successIcon.hide();
            ele.find(".input-group").append(successIcon);
            ele.find('[data-dismiss="fileinput"]').click(function () {
                var file_input = ele.find("[role='file']");
                file_input.attr("value", '');
                file_input.parent().parent().parent().removeClass("fileinput-exists")
                    .addClass("fileinput-new");
                file_input.parent().parent().parent().find(
                    "span.fileinput-filename ").text('');

                if (data.deleteHandle !== undefined) {
                    data.deleteHandle();
                }
            });

            if(data.defaultVal !== undefined) {

                successIcon.show();
            }
        }
        return ele;
    }

    /**
     * 展示图片信息
     *
     * @param ele
     * @param data
     */
    App.showImage = function(ele, attachmentUrl) {
        var preview = $("#"+ele).find("[role='preview']");
        if (preview.css('height') != 'none') {
            var $img = $('<img>');
            $img[0].src = attachmentUrl;
            $img.css('max-height', parseInt(
                preview.css('height'),
                10)
                - parseInt(
                    preview
                        .css('padding-top'),
                    10)
                - parseInt(
                    preview
                        .css('padding-bottom'),
                    10)
                - parseInt(
                    preview
                        .css('border-top'),
                    10)
                - parseInt(
                    preview
                        .css('border-bottom'),
                    10))
            preview.html($img);
        }
    };

    /**
     * 展示文件信息
     *
     * @param ele
     * @param fileUrl
     */
    App.showFile = function(ele, fileUrl) {
        var file_input = $("#"+ele).find("[role='file-input']");
        file_input.attr("value", fileUrl);
        file_input.parent().parent().parent().removeClass("fileinput-new")
            .addClass("fileinput-exists");
        //获得文件全名称
        fileUrl = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        //获取文件原名称
        fileUrl = fileUrl.substring(fileUrl.indexOf("_") + 5);
        file_input.parent().parent().parent().find(
            "span.fileinput-filename ").text(fileUrl);
    };

    $("#index_btn").on('click', function() {
        window.location.href = App.href + "/index.html";
    });

    $("#toLogin_btn").on('click', function(){
        window.location.href = App.href + "/login.html";
    });

})(jQuery, window, document);
