// PSD2UGUI Layer Tag Menu
// 规则：
// 1. 尾部连续 .tag 按从右到左识别
// 2. 同 family 后方优先
// 3. 写回时统一规范化顺序：export -> main -> textBackend -> imageType -> role
// 4. 保留 ref / refp 前缀

#target photoshop

var TAG_CONFIG = {
    canonicalOrder: ["export", "main", "textBackend", "imageType", "role"],
    reuseMarkers: [
        { "id": "ref", "prefix": "ref ", "label": "ref 复用共享图片资源" },
        { "id": "refp", "prefix": "refp ", "label": "refp 复用共享预制体" }
    ],
    familyLabels: {
        "export": "导出标签",
        "main": "结构标签",
        "textBackend": "文本后端",
        "imageType": "Image Type",
        "role": "角色标签"
    },
    families: {
        "export": [
            { "id": "img", "suffix": ".img", "label": "Image 图片" }
        ],
        "main": [
            { "id": "rimg", "suffix": ".rimg", "label": "RawImage 原始贴图" },
            { "id": "txt", "suffix": ".txt", "label": "Text 文本" },
            { "id": "msk", "suffix": ".msk", "label": "Mask 遮罩" },
            { "id": "col", "suffix": ".col", "label": "FillColor 纯色矩形" },
            { "id": "bt", "suffix": ".bt", "label": "Button 按钮" },
            { "id": "dpd", "suffix": ".dpd", "label": "Dropdown 下拉框" },
            { "id": "ipt", "suffix": ".ipt", "label": "InputField 输入框" },
            { "id": "tg", "suffix": ".tg", "label": "Toggle 勾选/单选框" },
            { "id": "panel", "suffix": ".panel", "label": "Panel 普通容器" },
            { "id": "tgg", "suffix": ".tgg", "label": "ToggleGroup 单选组容器" },
            { "id": "sld", "suffix": ".sld", "label": "Slider 滑动条/进度条" },
            { "id": "sv", "suffix": ".sv", "label": "ScrollView 滚动视图/列表" }
        ],
        "textBackend": [
            { "id": "tmp", "suffix": ".tmp", "label": "TMP文本后端" },
            { "id": "ugui", "suffix": ".ugui", "label": "原生文本后端" }
        ],
        "imageType": [
            { "id": "simple", "suffix": ".simple", "label": "普通" },
            { "id": "sliced", "suffix": ".sliced", "label": "九宫格" },
            { "id": "tiled", "suffix": ".tiled", "label": "平铺" },
            { "id": "filled", "suffix": ".filled", "label": "填充" }
        ],
        "role": [
            { "id": "bg", "suffix": ".bg", "label": "Background 控件背景" },
            { "id": "onover", "suffix": ".onover", "label": "Button_Highlight 按钮高亮图" },
            { "id": "press", "suffix": ".press", "label": "Button_Press 按钮按下图" },
            { "id": "select", "suffix": ".select", "label": "Button_Select 按钮选中图" },
            { "id": "disable", "suffix": ".disable", "label": "Button_Disable 按钮禁用图" },
            { "id": "bttxt", "suffix": ".bttxt", "label": "Button_Text 按钮文字" },
            { "id": "dpdlb", "suffix": ".dpdlb", "label": "Dropdown_Label 下拉框显示文字" },
            { "id": "dpdicon", "suffix": ".dpdicon", "label": "Dropdown_Arrow 下拉框箭头" },
            { "id": "placeholder", "suffix": ".placeholder", "label": "InputField_Placeholder 输入框占位文本" },
            { "id": "ipttxt", "suffix": ".ipttxt", "label": "InputField_Text 输入框内容文本" },
            { "id": "mark", "suffix": ".mark", "label": "Toggle_Checkmark 勾选标记" },
            { "id": "tglb", "suffix": ".tglb", "label": "Toggle_Label 勾选框文字" },
            { "id": "fill", "suffix": ".fill", "label": "Slider_Fill 滑动条填充" },
            { "id": "handle", "suffix": ".handle", "label": "Slider_Handle 滑动条手柄" },
            { "id": "vpt", "suffix": ".vpt", "label": "ScrollView_Viewport 滚动视图视口" },
            { "id": "hbarbg", "suffix": ".hbarbg", "label": "ScrollView_HorizontalBarBG 水平滚动条背景" },
            { "id": "hbar", "suffix": ".hbar", "label": "ScrollView_HorizontalBar 水平滚动条滑块" },
            { "id": "vbarbg", "suffix": ".vbarbg", "label": "ScrollView_VerticalBarBG 垂直滚动条背景" },
            { "id": "vbar", "suffix": ".vbar", "label": "ScrollView_VerticalBar 垂直滚动条滑块" }
        ]
    },
    rasterizeAsImage: {
        "main": {
            "rimg": true
        },
        "export": {
            "img": true
        },
        "role": {
            "bg": true,
            "disable": true,
            "dpdicon": true,
            "fill": true,
            "handle": true,
            "hbar": true,
            "hbarbg": true,
            "mark": true,
            "onover": true,
            "press": true,
            "select": true,
            "vbar": true,
            "vbarbg": true
        }
    },
    aliasMap: {
        "arrow": {"role": "dpdicon" },
        "background": {"role": "bg" },
        "bg": {"role": "bg" },
        "bt": {"main": "bt" },
        "btlabel": {"role": "bttxt" },
        "btlb": {"role": "bttxt" },
        "btn": {"main": "bt" },
        "bttext": {"role": "bttxt" },
        "bttxt": {"role": "bttxt" },
        "button": {"main": "bt" },
        "buttonlabel": {"role": "bttxt" },
        "buttontext": {"role": "bttxt" },
        "checkbox": {"main": "tg" },
        "click": {"role": "press" },
        "col": {"main": "col" },
        "color": {"main": "col" },
        "disable": {"role": "disable" },
        "dpd": {"main": "dpd" },
        "dpdarrow": {"role": "dpdicon" },
        "dpdicon": {"role": "dpdicon" },
        "dpdlabel": {"role": "dpdlb" },
        "dpdlb": {"role": "dpdlb" },
        "dpdtext": {"role": "dpdlb" },
        "dpdtxt": {"role": "dpdlb" },
        "dropdown": {"main": "dpd" },
        "dropdownarrow": {"role": "dpdicon" },
        "dropdownlabel": {"role": "dpdlb" },
        "dropdownlb": {"role": "dpdlb" },
        "dropdowntext": {"role": "dpdlb" },
        "dropdowntxt": {"role": "dpdlb" },
        "fill": {"role": "fill" },
        "fillcolor": {"main": "col" },
        "filled": {"imageType": "filled" },
        "focus": {"role": "select" },
        "forbid": {"role": "disable" },
        "handle": {"role": "handle" },
        "hbar": {"role": "hbar" },
        "hbarbackground": {"role": "hbarbg" },
        "hbarbg": {"role": "hbarbg" },
        "hbarpanel": {"role": "hbarbg" },
        "highlight": {"role": "onover" },
        "image": {"export": "img" },
        "img": {"export": "img" },
        "input": {"main": "ipt" },
        "inputbox": {"main": "ipt" },
        "inputfield": {"main": "ipt" },
        "inputlabel": {"role": "ipttxt" },
        "inputtext": {"role": "ipttxt" },
        "inputtips": {"role": "placeholder" },
        "ipt": {"main": "ipt" },
        "iptlabel": {"role": "ipttxt" },
        "iptlb": {"role": "ipttxt" },
        "ipttext": {"role": "ipttxt" },
        "ipttips": {"role": "placeholder" },
        "ipttxt": {"role": "ipttxt" },
        "label": {"main": "txt" },
        "light": {"role": "onover" },
        "listview": {"main": "sv" },
        "listviewport": {"role": "vpt" },
        "lst": {"main": "sv" },
        "lsthbar": {"role": "hbar" },
        "lstmask": {"role": "vpt" },
        "lstvbar": {"role": "vbar" },
        "mark": {"role": "mark" },
        "mask": {"main": "msk" },
        "msk": {"main": "msk" },
        "onover": {"role": "onover" },
        "panel": {"main": "panel" },
        "placeholder": {"role": "placeholder" },
        "press": {"role": "press" },
        "radiogroup": {"main": "tgg" },
        "rawimage": {"main": "rimg" },
        "rawimg": {"main": "rimg" },
        "rimg": {"main": "rimg" },
        "scrollview": {"main": "sv" },
        "scrollviewport": {"role": "vpt" },
        "select": {"role": "select" },
        "simple": {"imageType": "simple" },
        "sld": {"main": "sld" },
        "sldfill": {"role": "fill" },
        "sldhandle": {"role": "handle" },
        "sliced": {"imageType": "sliced" },
        "slider": {"main": "sld" },
        "sliderfill": {"role": "fill" },
        "sliderhandle": {"role": "handle" },
        "sv": {"main": "sv" },
        "svhbar": {"role": "hbar" },
        "svmask": {"role": "vpt" },
        "svvbar": {"role": "vbar" },
        "tex": {"main": "rimg" },
        "text": {"main": "txt" },
        "tg": {"main": "tg" },
        "tgg": {"main": "tgg" },
        "tglb": {"role": "tglb" },
        "tgmark": {"role": "mark" },
        "tgtxt": {"role": "tglb" },
        "tiled": {"imageType": "tiled" },
        "tips": {"role": "placeholder" },
        "tmp": {"textBackend": "tmp" },
        "tmpbt": {"main": "bt", "textBackend": "tmp" },
        "tmpbtn": {"main": "bt", "textBackend": "tmp" },
        "tmpbutton": {"main": "bt", "textBackend": "tmp" },
        "tmpcheckbox": {"main": "tg", "textBackend": "tmp" },
        "tmpdpd": {"main": "dpd", "textBackend": "tmp" },
        "tmpdropdown": {"main": "dpd", "textBackend": "tmp" },
        "tmpinput": {"main": "ipt", "textBackend": "tmp" },
        "tmpinputbox": {"main": "ipt", "textBackend": "tmp" },
        "tmpinputfield": {"main": "ipt", "textBackend": "tmp" },
        "tmpipt": {"main": "ipt", "textBackend": "tmp" },
        "tmplabel": {"main": "txt", "textBackend": "tmp" },
        "tmptext": {"main": "txt", "textBackend": "tmp" },
        "tmptg": {"main": "tg", "textBackend": "tmp" },
        "tmptoggle": {"main": "tg", "textBackend": "tmp" },
        "tmptxt": {"main": "txt", "textBackend": "tmp" },
        "toggle": {"main": "tg" },
        "togglegroup": {"main": "tgg" },
        "togglelabel": {"role": "tglb" },
        "togglemark": {"role": "mark" },
        "toggletext": {"role": "tglb" },
        "touch": {"role": "press" },
        "txt": {"main": "txt" },
        "ugui": {"textBackend": "ugui" },
        "vbar": {"role": "vbar" },
        "vbarbackground": {"role": "vbarbg" },
        "vbarbg": {"role": "vbarbg" },
        "vbarpanel": {"role": "vbarbg" },
        "viewport": {"role": "vpt" },
        "vpt": {"role": "vpt" }
    }
};

var REUSE_SETTINGS_KEY_NAME = "PSD2UIForm.LayerTagMenu.ReuseSettings";
var REUSE_TYPE_IMAGE = "ref";
var REUSE_TYPE_PREFAB = "refp";
var REUSE_SETTINGS_FIELD_IMAGE = "imageRoot";
var REUSE_SETTINGS_FIELD_PREFAB = "prefabRoot";
var REUSE_SETTINGS_FOLDER_NAME = "PSD2UIForm";
var REUSE_SETTINGS_FILE_NAME = "LayerTagMenu-ReuseSettings.txt";
var REUSE_DIALOG_TITLES = {
    "ref": "选择复用图片",
    "refp": "选择复用预制体"
};
var REUSE_DEFAULT_SETTINGS = {
    imageRoot: "D:/Workspace/UnityProjects/Psd2UIForm/Assets/Examples/Common",
    prefabRoot: "D:/Workspace/UnityProjects/Psd2UIForm/Assets/Examples/CommonPrefab"
};

(function() {
    if (!app.documents.length) {
        alert("请先打开一个 PSD 文档");
        return;
    }

    var layerInfos = getSelectedLayerInfosFast();
    if (layerInfos.length < 1) {
        alert("请先选择一个或多个图层");
        return;
    }

    var helpers = createTagHelpers(TAG_CONFIG);
    var savedSelection = saveSelection();
    var previewParsed = layerInfos.length === 1 ? helpers.parseLayerName(layerInfos[0].name) : null;
    var reuseSettings = loadReuseSettings();

    var w = new Window("dialog", "PSD2UGUI - 图层标签");
    w.alignChildren = "fill";
    w.spacing = 10;
    w.margins = 14;

    var infoPanel = w.add("panel", undefined, "当前选择");
    infoPanel.alignChildren = "fill";
    infoPanel.margins = 10;

    if (layerInfos.length === 1) {
        infoPanel.add("statictext", undefined, layerInfos[0].name);
        var tagText = helpers.getDisplayTags(previewParsed).join(" ");
        infoPanel.add("statictext", undefined, tagText.length > 0 ? ("标签: " + tagText) : "标签: 无");
        if (previewParsed.prefix.length > 0) {
            infoPanel.add("statictext", undefined, "前缀: " + previewParsed.prefix);
        }
    } else {
        infoPanel.add("statictext", undefined, "已选择 " + layerInfos.length + " 个图层");
    }

    for (var familyIndex = 0; familyIndex < TAG_CONFIG.canonicalOrder.length; familyIndex++) {
        var familyKey = TAG_CONFIG.canonicalOrder[familyIndex];
        buildFamilyPanel(w, helpers, familyKey, previewParsed, layerInfos, savedSelection);
    }

    buildReusePanel(w, helpers, previewParsed, layerInfos, savedSelection, reuseSettings);

    var actionPanel = w.add("panel", undefined, "移除");
    actionPanel.alignChildren = "left";
    actionPanel.margins = 10;

    var actionRow = actionPanel.add("group");
    actionRow.spacing = 6;

    var removeLastBtn = actionRow.add("button", undefined, "移除最后标签");
    removeLastBtn.onClick = function() {
        batchTransformLayerNames(layerInfos, function(currentName) {
            return helpers.removeLastTag(currentName);
        });
        restoreSelection(savedSelection);
        w.close();
    };

    var removeAllBtn = actionRow.add("button", undefined, "移除全部标签");
    removeAllBtn.onClick = function() {
        batchTransformLayerNames(layerInfos, function(currentName) {
            return helpers.removeAllTags(currentName);
        });
        restoreSelection(savedSelection);
        w.close();
    };

    var bottomGroup = w.add("group");
    bottomGroup.alignment = "center";
    bottomGroup.add("button", undefined, "关闭(ECS)", { name: "cancel" });

    w.center();
    w.show();

    function buildReusePanel(root, helpersRef, singleParsed, selectedLayerInfos, selectionState, settings) {
        var panel = root.add("panel", undefined, "复用标记");
        panel.alignChildren = "fill";
        panel.margins = 8;

        var dirPanel = panel.add("panel", undefined, "复用目录");
        dirPanel.alignChildren = "fill";
        dirPanel.margins = 8;

        buildReusePathRow(dirPanel, "图片目录", REUSE_TYPE_IMAGE, settings);
        buildReusePathRow(dirPanel, "预制体目录", REUSE_TYPE_PREFAB, settings);

        var headRow = panel.add("group");
        headRow.spacing = 6;

        var currentPrefix = singleParsed ? singleParsed.prefix : "";
        var clearBtn = headRow.add("button", undefined, "移除");
        clearBtn.preferredSize = [64, 28];
        clearBtn.helpTip = "移除 ref / refp 前缀";
        clearBtn.onClick = createReuseHandler(null, selectedLayerInfos, selectionState, helpersRef);

        var markers = helpersRef.getReuseMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            var buttonText = marker.prefix;
            if (singleParsed && currentPrefix === marker.prefix) {
                buttonText = "* " + buttonText;
            }
            var btn = headRow.add("button", undefined, buttonText);
            btn.preferredSize = [84, 28];
            btn.helpTip = marker.label;
            btn.onClick = createReuseHandler(marker.id, selectedLayerInfos, selectionState, helpersRef, settings);
        }
    }

    function buildReusePathRow(root, label, prefix, settings) {
        var row = root.add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "center"];
        row.spacing = 6;

        var labelText = row.add("statictext", undefined, label);
        labelText.preferredSize.width = 60;

        var edit = row.add("edittext", undefined, getReuseRootPath(settings, prefix));
        edit.characters = 34;
        edit.preferredSize.width = 300;
        edit.onChange = function() {
            var normalized = normalizeFolderPath(edit.text);
            setReuseRootPath(settings, prefix, normalized);
            edit.text = normalized;
            saveReuseSettings(settings);
        };

        var browseBtn = row.add("button", undefined, "浏览");
        browseBtn.onClick = function() {
            var selectedFolder = Folder.selectDialog("选择" + label);
            if (!selectedFolder) {
                return;
            }

            var normalized = normalizeFolderPath(selectedFolder.fsName || selectedFolder.fullName);
            setReuseRootPath(settings, prefix, normalized);
            edit.text = normalized;
            saveReuseSettings(settings);
        };
    }

    function createReuseHandler(reuseType, selectedLayerInfos, selectionState, helpersRef, settings) {
        return function() {
            if (!reuseType) {
                batchTransformLayerNames(selectedLayerInfos, function(currentName) {
                    return helpersRef.applyReusePrefix(currentName, null);
                });
                restoreSelection(selectionState);
                w.close();
                return;
            }

            var selectedReusePath = pickReuseTargetPath(reuseType, settings);
            if (!selectedReusePath) {
                return;
            }

            batchTransformLayerNames(selectedLayerInfos, function(currentName) {
                return helpersRef.applyReuseTarget(currentName, getReusePrefixFromType(reuseType), selectedReusePath);
            });
            restoreSelection(selectionState);
            w.close();
        };
    }

    function buildFamilyPanel(root, helpersRef, familyKey, singleParsed, selectedLayerInfos, selectionState) {
        var panel = root.add("panel", undefined, TAG_CONFIG.familyLabels[familyKey] || familyKey);
        panel.alignChildren = "fill";
        panel.margins = 8;

        var headRow = panel.add("group");
        headRow.spacing = 6;
        var clearBtn = headRow.add("button", undefined, "清除");
        clearBtn.preferredSize = [52, 24];
        clearBtn.onClick = function() {
            batchTransformLayerNames(selectedLayerInfos, function(currentName) {
                return helpersRef.applyFamilySelection(currentName, familyKey, null);
            });
            restoreSelection(selectionState);
            w.close();
        };

        var currentId = singleParsed ? singleParsed.winners[familyKey] : null;
        var currentLabel = currentId ? ("当前: ." + currentId) : "当前: 无";
        headRow.add("statictext", undefined, currentLabel);

        var items = helpersRef.getFamilyItems(familyKey);
        var row = null;
        for (var i = 0; i < items.length; i++) {
            if (i % 4 === 0) {
                row = panel.add("group");
                row.spacing = 6;
            }

            var item = items[i];
            var buttonText = item.suffix;
            if (currentId && currentId === item.id) {
                buttonText = "* " + buttonText;
            }
            var btn = row.add("button", undefined, buttonText);
            btn.preferredSize = [84, 28];
            btn.helpTip = item.label;
            btn.onClick = createApplyHandler(familyKey, item.id, selectedLayerInfos, selectionState, helpersRef);
        }
    }

    function createApplyHandler(familyKey, itemId, selectedLayerInfos, selectionState, helpersRef) {
        return function() {
            batchTransformLayerNames(selectedLayerInfos, function(currentName) {
                return helpersRef.applyFamilySelection(currentName, familyKey, itemId);
            });
            restoreSelection(selectionState);
            w.close();
        };
    }

    function createTagHelpers(config) {
        var familyItemMap = {};
        var familyItems = {};
        var aliasMap = {};

        for (var familyKey in config.families) {
            if (!config.families.hasOwnProperty(familyKey)) continue;
            familyItems[familyKey] = config.families[familyKey];
            familyItemMap[familyKey] = {};
            for (var i = 0; i < config.families[familyKey].length; i++) {
                var item = config.families[familyKey][i];
                familyItemMap[familyKey][item.id] = item;
            }
        }

        for (var alias in config.aliasMap) {
            if (!config.aliasMap.hasOwnProperty(alias)) continue;
            aliasMap[String(alias).toLowerCase()] = shallowClone(config.aliasMap[alias]);
        }

        function parseLayerName(layerName) {
            var rawName = layerName || "";
            var workingName = trimString(rawName);
            var prefix = "";

            if (startsWithIgnoreCase(workingName, "refp ")) {
                prefix = "refp ";
                workingName = trimString(workingName.substring(5));
            } else if (startsWithIgnoreCase(workingName, "ref ")) {
                prefix = "ref ";
                workingName = trimString(workingName.substring(4));
            }

            var orderedTags = [];
            while (workingName.length > 0) {
                var splitIndex = workingName.lastIndexOf(".");
                if (splitIndex <= 0 || splitIndex >= workingName.length - 1) {
                    break;
                }

                var token = workingName.substring(splitIndex + 1).toLowerCase();
                if (!aliasMap.hasOwnProperty(token)) {
                    break;
                }

                orderedTags.unshift({
                    token: token,
                    mapping: shallowClone(aliasMap[token])
                });
                workingName = trimRightWhitespace(workingName.substring(0, splitIndex));
            }

            return {
                rawName: rawName,
                prefix: prefix,
                baseName: trimString(workingName),
                orderedTags: orderedTags,
                winners: resolveWinners(orderedTags)
            };
        }

        function resolveWinners(orderedTags) {
            var winners = {};
            for (var i = 0; i < orderedTags.length; i++) {
                var mapping = orderedTags[i].mapping;
                for (var familyKey in mapping) {
                    if (!mapping.hasOwnProperty(familyKey)) continue;
                    winners[familyKey] = mapping[familyKey];
                }
            }
            return winners;
        }

        function composeLayerName(parsed) {
            var name = parsed.baseName || "";
            if (parsed.prefix.length > 0) {
                name = parsed.prefix + name;
            }

            for (var i = 0; i < config.canonicalOrder.length; i++) {
                var familyKey = config.canonicalOrder[i];
                var winnerId = parsed.winners[familyKey];
                if (!winnerId) continue;
                if (!familyItemMap[familyKey] || !familyItemMap[familyKey][winnerId]) continue;
                name += familyItemMap[familyKey][winnerId].suffix;
            }
            return name;
        }

        function applyFamilySelection(layerName, familyKey, itemId) {
            var parsed = parseLayerName(layerName);
            if (itemId) {
                parsed.winners[familyKey] = itemId;
            } else {
                delete parsed.winners[familyKey];
            }
            return composeLayerName(parsed);
        }

        function applyReusePrefix(layerName, prefix) {
            var parsed = parseLayerName(layerName);
            parsed.prefix = prefix || "";
            return composeLayerName(parsed);
        }

        function applyReuseTarget(layerName, prefix, reusePath) {
            var parsed = parseLayerName(layerName);
            parsed.prefix = prefix || "";
            parsed.baseName = normalizeRelativeReusePath(reusePath);
            return composeLayerName(parsed);
        }

        function removeLastTag(layerName) {
            var parsed = parseLayerName(layerName);
            if (parsed.orderedTags.length < 1) {
                return layerName;
            }
            parsed.orderedTags.pop();
            parsed.winners = resolveWinners(parsed.orderedTags);
            return composeLayerName(parsed);
        }

        function removeAllTags(layerName) {
            var parsed = parseLayerName(layerName);
            return (parsed.prefix || "") + (parsed.baseName || "");
        }

        function getDisplayTags(parsed) {
            if (!parsed) return [];
            var result = [];
            for (var i = 0; i < config.canonicalOrder.length; i++) {
                var familyKey = config.canonicalOrder[i];
                var winnerId = parsed.winners[familyKey];
                if (!winnerId) continue;
                if (!familyItemMap[familyKey] || !familyItemMap[familyKey][winnerId]) continue;
                result.push(familyItemMap[familyKey][winnerId].suffix);
            }
            return result;
        }

        return {
            parseLayerName: parseLayerName,
            applyFamilySelection: applyFamilySelection,
            applyReusePrefix: applyReusePrefix,
            applyReuseTarget: applyReuseTarget,
            removeLastTag: removeLastTag,
            removeAllTags: removeAllTags,
            getDisplayTags: getDisplayTags,
            getReuseMarkers: function() {
                return config.reuseMarkers || [];
            },
            getFamilyItems: function(familyKey) {
                return familyItems[familyKey] || [];
            }
        };
    }

    function shallowClone(source) {
        var target = {};
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    function trimString(value) {
        return String(value || "").replace(/^\s+|\s+$/g, "");
    }

    function trimRightWhitespace(value) {
        return String(value || "").replace(/\s+$/g, "");
    }

    function startsWithIgnoreCase(text, prefix) {
        if (text.length < prefix.length) return false;
        return text.substring(0, prefix.length).toLowerCase() === prefix.toLowerCase();
    }

    function loadReuseSettings() {
        var settings = createDefaultReuseSettings();

        if (loadReuseSettingsFromFile(settings)) {
            return settings;
        }

        try {
            var desc = app.getCustomOptions(app.stringIDToTypeID(REUSE_SETTINGS_KEY_NAME));
            var imageKey = app.stringIDToTypeID(REUSE_SETTINGS_FIELD_IMAGE);
            var prefabKey = app.stringIDToTypeID(REUSE_SETTINGS_FIELD_PREFAB);
            var loaded = false;

            if (desc.hasKey(imageKey)) {
                settings.imageRoot = normalizeFolderPath(desc.getString(imageKey));
                loaded = true;
            }
            if (desc.hasKey(prefabKey)) {
                settings.prefabRoot = normalizeFolderPath(desc.getString(prefabKey));
                loaded = true;
            }

            if (loaded) {
                saveReuseSettingsToFile(settings);
            }
        } catch (ignoredLoadSettings) {}

        return settings;
    }

    function saveReuseSettings(settings) {
        saveReuseSettingsToFile(settings);

        try {
            var imageRoot = normalizeFolderPath(settings.imageRoot);
            var prefabRoot = normalizeFolderPath(settings.prefabRoot);

            if (!imageRoot && !prefabRoot) {
                app.eraseCustomOptions(app.stringIDToTypeID(REUSE_SETTINGS_KEY_NAME));
                return;
            }

            var desc = new ActionDescriptor();
            if (imageRoot) {
                desc.putString(app.stringIDToTypeID(REUSE_SETTINGS_FIELD_IMAGE), imageRoot);
            }
            if (prefabRoot) {
                desc.putString(app.stringIDToTypeID(REUSE_SETTINGS_FIELD_PREFAB), prefabRoot);
            }
            app.putCustomOptions(app.stringIDToTypeID(REUSE_SETTINGS_KEY_NAME), desc, true);
        } catch (ignoredSaveSettings) {}
    }

    function getReuseSettingsFile() {
        var settingsFolder = new Folder(normalizeFolderPath(getUserDataFolderPath()) + "/" + REUSE_SETTINGS_FOLDER_NAME);
        return new File(settingsFolder.fullName + "/" + REUSE_SETTINGS_FILE_NAME);
    }

    function createDefaultReuseSettings() {
        return {
            imageRoot: normalizeFolderPath(REUSE_DEFAULT_SETTINGS.imageRoot),
            prefabRoot: normalizeFolderPath(REUSE_DEFAULT_SETTINGS.prefabRoot)
        };
    }

    function getUserDataFolderPath() {
        var userDataFolder = Folder.userData;
        if (userDataFolder instanceof Folder) {
            return userDataFolder.fullName || userDataFolder.fsName || String(userDataFolder);
        }
        return String(userDataFolder || "");
    }

    function ensureReuseSettingsFolder() {
        var settingsFile = getReuseSettingsFile();
        var settingsFolder = settingsFile.parent;
        if (settingsFolder && !settingsFolder.exists) {
            return settingsFolder.create();
        }
        return true;
    }

    function loadReuseSettingsFromFile(settings) {
        try {
            var settingsFile = getReuseSettingsFile();
            if (!settingsFile.exists) {
                return false;
            }

            settingsFile.encoding = "UTF8";
            if (!settingsFile.open("r")) {
                return false;
            }

            var content = settingsFile.read();
            settingsFile.close();
            if (!content) {
                return false;
            }

            var lines = content.split(/\r?\n/);
            var loaded = false;

            for (var i = 0; i < lines.length; i++) {
                var line = trimString(lines[i]);
                if (!line) {
                    continue;
                }

                var splitIndex = line.indexOf("=");
                if (splitIndex <= 0) {
                    continue;
                }

                var key = trimString(line.substring(0, splitIndex));
                var value = normalizeFolderPath(line.substring(splitIndex + 1));
                if (key === REUSE_SETTINGS_FIELD_IMAGE) {
                    settings.imageRoot = value;
                    loaded = true;
                } else if (key === REUSE_SETTINGS_FIELD_PREFAB) {
                    settings.prefabRoot = value;
                    loaded = true;
                }
            }

            return loaded;
        } catch (ignoredLoadReuseFile) {}
        return false;
    }

    function saveReuseSettingsToFile(settings) {
        try {
            var imageRoot = normalizeFolderPath(settings.imageRoot);
            var prefabRoot = normalizeFolderPath(settings.prefabRoot);
            var settingsFile = getReuseSettingsFile();

            if (!imageRoot && !prefabRoot) {
                if (settingsFile.exists) {
                    settingsFile.remove();
                }
                return true;
            }

            if (!ensureReuseSettingsFolder()) {
                return false;
            }

            settingsFile.encoding = "UTF8";
            if (!settingsFile.open("w")) {
                return false;
            }

            var lines = [];
            lines.push(REUSE_SETTINGS_FIELD_IMAGE + "=" + imageRoot);
            lines.push(REUSE_SETTINGS_FIELD_PREFAB + "=" + prefabRoot);
            settingsFile.write(lines.join("\n"));
            settingsFile.close();
            return true;
        } catch (ignoredSaveReuseFile) {}
        return false;
    }

    function getReuseRootPath(settings, prefix) {
        if (prefix === REUSE_TYPE_PREFAB) {
            return settings.prefabRoot || "";
        }
        return settings.imageRoot || "";
    }

    function setReuseRootPath(settings, prefix, value) {
        if (prefix === REUSE_TYPE_PREFAB) {
            settings.prefabRoot = value || "";
            return;
        }
        settings.imageRoot = value || "";
    }

    function normalizeFolderPath(pathValue) {
        var normalized = trimString(pathValue).replace(/\\/g, "/");
        normalized = normalized.replace(/\/+$/g, "");
        return normalized;
    }

    function normalizeRelativeReusePath(pathValue) {
        var normalized = trimString(pathValue).replace(/\\/g, "/");
        normalized = normalized.replace(/^\/+/g, "").replace(/\/+$/g, "");
        return normalized;
    }

    function getReusePrefixFromType(reuseType) {
        return reuseType === REUSE_TYPE_PREFAB ? "refp " : "ref ";
    }

    function pickReuseTargetPath(prefix, settings) {
        var rootPath = getReuseRootPath(settings, prefix);
        if (!rootPath) {
            alert("请先配置" + (prefix === REUSE_TYPE_PREFAB ? "预制体目录" : "图片目录") + "。");
            return null;
        }

        var rootFolder = new Folder(rootPath);
        if (!rootFolder.exists) {
            alert("复用目录不存在：\n" + rootPath);
            return null;
        }

        var scanResult = collectReuseCandidates(rootFolder);
        if (scanResult.items.length < 1) {
            alert("复用目录中没有可用文件：\n" + rootPath);
            return null;
        }

        return showReusePickerDialog(prefix, rootPath, scanResult.items, scanResult.duplicateCount);
    }

    function collectReuseCandidates(rootFolder) {
        var items = [];
        var duplicateCount = 0;
        var itemLookup = {};

        function walk(folder) {
            var entries = folder.getFiles();
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry instanceof Folder) {
                    walk(entry);
                    continue;
                }

                if (!(entry instanceof File)) {
                    continue;
                }

                var fileName = String(entry.name || "");
                if (!fileName || /\.meta$/i.test(fileName)) {
                    continue;
                }

                var relativePath = buildRelativeReusePath(rootFolder, entry);
                if (!relativePath) {
                    continue;
                }

                var lookupKey = relativePath.toLowerCase();
                if (itemLookup.hasOwnProperty(lookupKey)) {
                    duplicateCount++;
                    continue;
                }

                itemLookup[lookupKey] = true;
                items.push(relativePath);
            }
        }

        walk(rootFolder);
        items.sort(function(a, b) {
            var aa = a.toLowerCase();
            var bb = b.toLowerCase();
            if (aa < bb) return -1;
            if (aa > bb) return 1;
            return 0;
        });

        return {
            items: items,
            duplicateCount: duplicateCount
        };
    }

    function buildRelativeReusePath(rootFolder, file) {
        var rootPath = normalizeFolderPath(rootFolder.fsName || rootFolder.fullName);
        var filePath = normalizeFolderPath(file.fsName || file.fullName);
        var rootLower = rootPath.toLowerCase();
        var fileLower = filePath.toLowerCase();

        if (fileLower.indexOf(rootLower) !== 0) {
            return null;
        }

        var relativePath = filePath.substring(rootPath.length);
        relativePath = relativePath.replace(/^\/+/g, "");
        if (!relativePath) {
            return null;
        }

        relativePath = relativePath.replace(/\.[^\/\.]+$/g, "");
        relativePath = normalizeRelativeReusePath(relativePath);
        return relativePath || null;
    }

    function showReusePickerDialog(prefix, rootPath, items, duplicateCount) {
        var dialog = new Window("dialog", REUSE_DIALOG_TITLES[prefix] || "选择复用项");
        dialog.alignChildren = "fill";
        dialog.spacing = 8;
        dialog.margins = 12;

        var rootText = dialog.add("statictext", undefined, "复用目录: " + rootPath);
        rootText.preferredSize.width = 520;

        if (duplicateCount > 0) {
            dialog.add("statictext", undefined, "说明: 检测到同名无扩展名文件，已按相对路径去重 " + duplicateCount + " 项。");
        }

        var searchRow = dialog.add("group");
        searchRow.orientation = "row";
        searchRow.alignChildren = ["left", "center"];
        searchRow.spacing = 6;
        searchRow.add("statictext", undefined, "搜索");

        var searchInput = searchRow.add("edittext", undefined, "");
        searchInput.characters = 32;
        searchInput.active = true;

        var countText = searchRow.add("statictext", undefined, "");
        countText.preferredSize.width = 120;

        var listBox = dialog.add("listbox", undefined, [], { multiselect: false });
        listBox.preferredSize = [520, 320];

        var bottomRow = dialog.add("group");
        bottomRow.alignment = "right";
        bottomRow.spacing = 6;

        var cancelButton = bottomRow.add("button", undefined, "取消", { name: "cancel" });
        var addButton = bottomRow.add("button", undefined, "添加");

        var filteredItems = items.slice(0);
        var selectedValue = null;

        function refreshList() {
            var keyword = trimString(searchInput.text).toLowerCase();
            filteredItems = [];
            listBox.removeAll();

            for (var i = 0; i < items.length; i++) {
                var itemValue = items[i];
                if (keyword && itemValue.toLowerCase().indexOf(keyword) < 0) {
                    continue;
                }

                filteredItems.push(itemValue);
                listBox.add("item", itemValue);
            }

            countText.text = "共 " + filteredItems.length + " 项";
        }

        function commitSelection() {
            if (!listBox.selection) {
                return;
            }

            selectedValue = String(listBox.selection.text || "");
            dialog.close(1);
        }

        searchInput.onChanging = refreshList;
        listBox.onDoubleClick = commitSelection;
        addButton.onClick = commitSelection;
        cancelButton.onClick = function() {
            dialog.close(0);
        };

        refreshList();

        return dialog.show() == 1 ? selectedValue : null;
    }

    var __batchContext = null;

    function beginBatchRename() {
        if (!__batchContext) {
            __batchContext = { selection: saveSelection() };
        }
    }

    function endBatchRename() {
        if (__batchContext) {
            restoreSelection(__batchContext.selection);
            __batchContext = null;
        }
    }

    function batchTransformLayerNames(layerInfosToEdit, transformFn) {
        beginBatchRename();
        try {
            for (var i = 0; i < layerInfosToEdit.length; i++) {
                try {
                    var info = layerInfosToEdit[i];
                    var currentName = getLayerNameById(info.id) || info.name;
                    var nextName = transformFn(currentName, info);
                    if (nextName && nextName !== currentName) {
                        setLayerNameById(info.id, nextName);
                    }
                } catch (ignoredRename) {}
            }
        } finally {
            endBatchRename();
        }
    }

    function saveSelection() {
        var selection = { layerIDs: [] };
        try {
            var ref = new ActionReference();
            ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("targetLayersIDs"));
            ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var desc = executeActionGet(ref);
            if (desc.hasKey(stringIDToTypeID("targetLayersIDs"))) {
                var list = desc.getList(stringIDToTypeID("targetLayersIDs"));
                for (var i = 0; i < list.count; i++) {
                    selection.layerIDs.push(list.getReference(i).getIdentifier());
                }
            }
        } catch (ignoredSelection) {}
        return selection;
    }

    function restoreSelection(selection) {
        if (!selection || !selection.layerIDs || selection.layerIDs.length < 1) return;
        try {
            var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putIdentifier(charIDToTypeID("Lyr "), selection.layerIDs[0]);
            desc.putReference(charIDToTypeID("null"), ref);
            desc.putBoolean(charIDToTypeID("MkVs"), false);
            executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);

            for (var i = 1; i < selection.layerIDs.length; i++) {
                var desc2 = new ActionDescriptor();
                var ref2 = new ActionReference();
                ref2.putIdentifier(charIDToTypeID("Lyr "), selection.layerIDs[i]);
                desc2.putReference(charIDToTypeID("null"), ref2);
                desc2.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
                desc2.putBoolean(charIDToTypeID("MkVs"), false);
                executeAction(charIDToTypeID("slct"), desc2, DialogModes.NO);
            }
        } catch (ignoredRestore) {}
    }

    function getSelectedLayerInfosFast() {
        var infos = [];
        try {
            var ref = new ActionReference();
            ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("targetLayersIDs"));
            ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var desc = executeActionGet(ref);
            if (desc.hasKey(stringIDToTypeID("targetLayersIDs"))) {
                var list = desc.getList(stringIDToTypeID("targetLayersIDs"));
                for (var i = 0; i < list.count; i++) {
                    var layerID = list.getReference(i).getIdentifier();
                    var layerRef = new ActionReference();
                    layerRef.putIdentifier(charIDToTypeID("Lyr "), layerID);
                    var layerDesc = executeActionGet(layerRef);
                    infos.push({
                        id: layerID,
                        name: layerDesc.getString(charIDToTypeID("Nm  "))
                    });
                }
                return infos;
            }
        } catch (ignoredBatchRead) {}

        if (app.activeDocument.activeLayer) {
            try {
                var activeRef = new ActionReference();
                activeRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
                var activeDesc = executeActionGet(activeRef);
                infos.push({
                    id: activeDesc.getInteger(stringIDToTypeID("layerID")),
                    name: app.activeDocument.activeLayer.name
                });
            } catch (ignoredActiveLayer) {}
        }
        return infos;
    }

    function getLayerNameById(layerId) {
        try {
            var ref = new ActionReference();
            ref.putIdentifier(charIDToTypeID("Lyr "), layerId);
            var layerDesc = executeActionGet(ref);
            return layerDesc.getString(charIDToTypeID("Nm  "));
        } catch (ignoredGetName) {}
        return null;
    }

    function selectLayerById(layerId) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID("Lyr "), layerId);
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putBoolean(charIDToTypeID("MkVs"), false);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }

    function trySetLayerNameByIdAM(layerId, newName) {
        var oldDialogs = null;
        try {
            oldDialogs = app.displayDialogs;
            app.displayDialogs = DialogModes.NO;
        } catch (ignoredDialogs) {}

        try {
            var desc = new ActionDescriptor();
            var ref = new ActionReference();
            ref.putIdentifier(charIDToTypeID("Lyr "), layerId);
            desc.putReference(charIDToTypeID("null"), ref);

            var nameDesc = new ActionDescriptor();
            nameDesc.putString(charIDToTypeID("Nm  "), newName);
            desc.putObject(charIDToTypeID("T   "), charIDToTypeID("Lyr "), nameDesc);

            executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
            return true;
        } catch (ignoredSetd) {
            return false;
        } finally {
            try {
                if (oldDialogs !== null && oldDialogs !== undefined) {
                    app.displayDialogs = oldDialogs;
                }
            } catch (ignoredRestoreDialogs) {}
        }
    }

    function setLayerNameById(layerId, newName) {
        if (trySetLayerNameByIdAM(layerId, newName)) return;

        var hasBatch = !!__batchContext;
        var selection = hasBatch ? null : saveSelection();
        try {
            selectLayerById(layerId);
            var layer = app.activeDocument.activeLayer;
            if (!layer) return;
            try {
                if (layer.name === newName) return;
            } catch (ignoredSameName) {}

            try {
                layer.name = newName;
            } catch (ignoredFastRename) {}
            try {
                if (layer.name === newName) return;
            } catch (ignoredCheckFastRename) {}

            var parentLocks = [];
            try {
                var parent = layer.parent;
                while (parent && parent.typename !== "Document") {
                    if (parent.typename === "LayerSet") {
                        var parentLocked = null;
                        try { parentLocked = parent.allLocked; } catch (ignoredParentLockRead) { parentLocked = null; }
                        parentLocks.push({ layer: parent, allLocked: parentLocked });
                        try { if (parentLocked) parent.allLocked = false; } catch (ignoredParentUnlock) {}
                    }
                    parent = parent.parent;
                }
            } catch (ignoredParentWalk) {}

            var layerLocks = {};
            try { layerLocks.allLocked = layer.allLocked; if (layer.allLocked) layer.allLocked = false; } catch (ignoredAllLocked) {}
            try { layerLocks.positionLocked = layer.positionLocked; if (layer.positionLocked) layer.positionLocked = false; } catch (ignoredPosLocked) {}
            try { layerLocks.transparentPixelsLocked = layer.transparentPixelsLocked; if (layer.transparentPixelsLocked) layer.transparentPixelsLocked = false; } catch (ignoredTransparentLocked) {}
            try { layerLocks.pixelsLocked = layer.pixelsLocked; if (layer.pixelsLocked) layer.pixelsLocked = false; } catch (ignoredPixelsLocked) {}

            var wasBackground = false;
            try {
                wasBackground = layer.isBackgroundLayer;
                if (wasBackground) layer.isBackgroundLayer = false;
            } catch (ignoredBackground) {}

            try { layer.name = newName; } catch (ignoredRename) {}

            try { if (layerLocks.allLocked !== undefined) layer.allLocked = layerLocks.allLocked; } catch (ignoredRestoreAllLocked) {}
            try { if (layerLocks.positionLocked !== undefined) layer.positionLocked = layerLocks.positionLocked; } catch (ignoredRestorePosLocked) {}
            try { if (layerLocks.transparentPixelsLocked !== undefined) layer.transparentPixelsLocked = layerLocks.transparentPixelsLocked; } catch (ignoredRestoreTransparentLocked) {}
            try { if (layerLocks.pixelsLocked !== undefined) layer.pixelsLocked = layerLocks.pixelsLocked; } catch (ignoredRestorePixelsLocked) {}

            if (wasBackground) {
                try { layer.isBackgroundLayer = true; } catch (ignoredRestoreBackground) {}
            }

            for (var i = parentLocks.length - 1; i >= 0; i--) {
                try {
                    if (parentLocks[i].allLocked !== null && parentLocks[i].allLocked !== undefined) {
                        parentLocks[i].layer.allLocked = parentLocks[i].allLocked;
                    }
                } catch (ignoredRestoreParent) {}
            }
        } catch (ignoredDirectRename) {
        } finally {
            if (!hasBatch && selection) {
                restoreSelection(selection);
            }
        }
    }
})();
