// PSD2UGUI Layer Tag Menu
// 规则：
// 1. 尾部连续 .tag 按从右到左识别
// 2. 同 family 后方优先
// 3. 写回时统一规范化顺序：main -> textBackend -> imageType -> role
// 4. 保留 ref / refp 前缀

#target photoshop

var TAG_CONFIG = {
    canonicalOrder: ["main", "textBackend", "imageType", "role"],
    familyLabels: {
        "main": "结构标签",
        "textBackend": "文本后端",
        "imageType": "Image Type",
        "role": "角色标签"
    },
    families: {
        "main": [
            { "id": "img", "suffix": ".img", "label": "Image\n图片" },
            { "id": "rimg", "suffix": ".rimg", "label": "RawImage\n贴图" },
            { "id": "txt", "suffix": ".txt", "label": "Text\n文本" },
            { "id": "msk", "suffix": ".msk", "label": "Mask\n遮罩" },
            { "id": "col", "suffix": ".col", "label": "FillColor\n纯色" },
            { "id": "bt", "suffix": ".bt", "label": "Button\n按钮" },
            { "id": "dpd", "suffix": ".dpd", "label": "Dropdown\n下拉框" },
            { "id": "ipt", "suffix": ".ipt", "label": "InputField\n输入框" },
            { "id": "tg", "suffix": ".tg", "label": "Toggle\n勾选框" },
            { "id": "sld", "suffix": ".sld", "label": "Slider\n进度条" },
            { "id": "sv", "suffix": ".sv", "label": "ScrollView\n滚动列表" }
        ],
        "textBackend": [
            { "id": "tmp", "suffix": ".tmp", "label": "TMP\nTMP文本后端" },
            { "id": "ugui", "suffix": ".ugui", "label": "UGUI\n原生文本后端" }
        ],
        "imageType": [
            { "id": "simple", "suffix": ".simple", "label": "Simple\n普通" },
            { "id": "sliced", "suffix": ".sliced", "label": "Sliced\n九宫格" },
            { "id": "tiled", "suffix": ".tiled", "label": "Tiled\n平铺" },
            { "id": "filled", "suffix": ".filled", "label": "Filled\n填充" }
        ],
        "role": [
            { "id": "bg", "suffix": ".bg", "label": "Background\n背景" },
            { "id": "onover", "suffix": ".onover", "label": "Button_Highlight\n按钮高亮" },
            { "id": "press", "suffix": ".press", "label": "Button_Press\n按钮按下" },
            { "id": "select", "suffix": ".select", "label": "Button_Select\n按钮选中" },
            { "id": "disable", "suffix": ".disable", "label": "Button_Disable\n按钮禁用" },
            { "id": "bttxt", "suffix": ".bttxt", "label": "Button_Text\n按钮文本" },
            { "id": "dpdlb", "suffix": ".dpdlb", "label": "Dropdown_Label\n下拉框文本" },
            { "id": "dpdicon", "suffix": ".dpdicon", "label": "Dropdown_Arrow\n下拉框箭头" },
            { "id": "placeholder", "suffix": ".placeholder", "label": "InputField_Placeholder\n输入框提示文本" },
            { "id": "ipttxt", "suffix": ".ipttxt", "label": "InputField_Text\n输入框内容文本" },
            { "id": "mark", "suffix": ".mark", "label": "Toggle_Checkmark\n勾选框标记" },
            { "id": "tglb", "suffix": ".tglb", "label": "Toggle_Label\n勾选框文本" },
            { "id": "fill", "suffix": ".fill", "label": "Slider_Fill\n进度条填充图" },
            { "id": "handle", "suffix": ".handle", "label": "Slider_Handle\n进度条滑块" },
            { "id": "vpt", "suffix": ".vpt", "label": "ScrollView_Viewport\n滚动列表视口" },
            { "id": "hbarbg", "suffix": ".hbarbg", "label": "ScrollView_HorizontalBarBG\n水平滑动条背景" },
            { "id": "hbar", "suffix": ".hbar", "label": "ScrollView_HorizontalBar\n水平滑动条滑块" },
            { "id": "vbarbg", "suffix": ".vbarbg", "label": "ScrollView_VerticalBarBG\n垂直滑动条背景" },
            { "id": "vbar", "suffix": ".vbar", "label": "ScrollView_VerticalBar\n垂直滑动条滑块" }
        ]
    },
    aliasMap: {
        "arrow": { "role": "dpdicon" },
        "background": { "role": "bg" },
        "bt": { "main": "bt" },
        "btlb": { "role": "bttxt" },
        "btlabel": { "role": "bttxt" },
        "btn": { "main": "bt" },
        "bttext": { "role": "bttxt" },
        "bttxt": { "role": "bttxt" },
        "button": { "main": "bt" },
        "buttonlabel": { "role": "bttxt" },
        "buttontext": { "role": "bttxt" },
        "checkbox": { "main": "tg" },
        "click": { "role": "press" },
        "col": { "main": "col" },
        "color": { "main": "col" },
        "disable": { "role": "disable" },
        "dpd": { "main": "dpd" },
        "dpdarrow": { "role": "dpdicon" },
        "dpdicon": { "role": "dpdicon" },
        "dpdlb": { "role": "dpdlb" },
        "dpdlabel": { "role": "dpdlb" },
        "dpdtext": { "role": "dpdlb" },
        "dpdtxt": { "role": "dpdlb" },
        "dropdown": { "main": "dpd" },
        "dropdownarrow": { "role": "dpdicon" },
        "dropdownlabel": { "role": "dpdlb" },
        "dropdownlb": { "role": "dpdlb" },
        "dropdowntext": { "role": "dpdlb" },
        "dropdowntxt": { "role": "dpdlb" },
        "fill": { "role": "fill" },
        "filled": { "imageType": "filled" },
        "fillcolor": { "main": "col" },
        "focus": { "role": "select" },
        "forbid": { "role": "disable" },
        "handle": { "role": "handle" },
        "hbar": { "role": "hbar" },
        "hbarbackground": { "role": "hbarbg" },
        "hbarbg": { "role": "hbarbg" },
        "hbarpanel": { "role": "hbarbg" },
        "highlight": { "role": "onover" },
        "image": { "main": "img" },
        "img": { "main": "img" },
        "input": { "main": "ipt" },
        "inputbox": { "main": "ipt" },
        "inputfield": { "main": "ipt" },
        "inputlabel": { "role": "ipttxt" },
        "inputtext": { "role": "ipttxt" },
        "inputtips": { "role": "placeholder" },
        "ipt": { "main": "ipt" },
        "iptlabel": { "role": "ipttxt" },
        "iptlb": { "role": "ipttxt" },
        "ipttext": { "role": "ipttxt" },
        "ipttips": { "role": "placeholder" },
        "ipttxt": { "role": "ipttxt" },
        "label": { "main": "txt" },
        "light": { "role": "onover" },
        "listview": { "main": "sv" },
        "listviewport": { "role": "vpt" },
        "lst": { "main": "sv" },
        "lsthbar": { "role": "hbar" },
        "lstmask": { "role": "vpt" },
        "lstvbar": { "role": "vbar" },
        "mark": { "role": "mark" },
        "mask": { "main": "msk" },
        "msk": { "main": "msk" },
        "onover": { "role": "onover" },
        "panel": { "role": "bg" },
        "placeholder": { "role": "placeholder" },
        "press": { "role": "press" },
        "rawimage": { "main": "rimg" },
        "rawimg": { "main": "rimg" },
        "rimg": { "main": "rimg" },
        "scrollview": { "main": "sv" },
        "scrollviewport": { "role": "vpt" },
        "select": { "role": "select" },
        "simple": { "imageType": "simple" },
        "sld": { "main": "sld" },
        "sldfill": { "role": "fill" },
        "sldhandle": { "role": "handle" },
        "slider": { "main": "sld" },
        "sliderfill": { "role": "fill" },
        "sliderhandle": { "role": "handle" },
        "sliced": { "imageType": "sliced" },
        "sv": { "main": "sv" },
        "svhbar": { "role": "hbar" },
        "svmask": { "role": "vpt" },
        "svvbar": { "role": "vbar" },
        "tex": { "main": "rimg" },
        "text": { "main": "txt" },
        "tg": { "main": "tg" },
        "tgmark": { "role": "mark" },
        "tglb": { "role": "tglb" },
        "tgtxt": { "role": "tglb" },
        "tiled": { "imageType": "tiled" },
        "tips": { "role": "placeholder" },
        "tmp": { "textBackend": "tmp" },
        "tmpbt": { "main": "bt", "textBackend": "tmp" },
        "tmpbtn": { "main": "bt", "textBackend": "tmp" },
        "tmpbutton": { "main": "bt", "textBackend": "tmp" },
        "tmpcheckbox": { "main": "tg", "textBackend": "tmp" },
        "tmpdpd": { "main": "dpd", "textBackend": "tmp" },
        "tmpdropdown": { "main": "dpd", "textBackend": "tmp" },
        "tmpinput": { "main": "ipt", "textBackend": "tmp" },
        "tmpinputbox": { "main": "ipt", "textBackend": "tmp" },
        "tmpinputfield": { "main": "ipt", "textBackend": "tmp" },
        "tmpipt": { "main": "ipt", "textBackend": "tmp" },
        "tmplabel": { "main": "txt", "textBackend": "tmp" },
        "tmptext": { "main": "txt", "textBackend": "tmp" },
        "tmptg": { "main": "tg", "textBackend": "tmp" },
        "tmptoggle": { "main": "tg", "textBackend": "tmp" },
        "tmptxt": { "main": "txt", "textBackend": "tmp" },
        "toggle": { "main": "tg" },
        "togglelabel": { "role": "tglb" },
        "togglemark": { "role": "mark" },
        "toggletext": { "role": "tglb" },
        "touch": { "role": "press" },
        "txt": { "main": "txt" },
        "ugui": { "textBackend": "ugui" },
        "vbar": { "role": "vbar" },
        "vbarbackground": { "role": "vbarbg" },
        "vbarbg": { "role": "vbarbg" },
        "vbarpanel": { "role": "vbarbg" },
        "viewport": { "role": "vpt" },
        "vpt": { "role": "vpt" }
    }
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

    var tipText = infoPanel.add("statictext", undefined, "说明：文本层标 .img 会栅格化；图片层标 .txt 不会变成文本。");
    tipText.preferredSize.width = 340;

    for (var familyIndex = 0; familyIndex < TAG_CONFIG.canonicalOrder.length; familyIndex++) {
        var familyKey = TAG_CONFIG.canonicalOrder[familyIndex];
        buildFamilyPanel(w, helpers, familyKey, previewParsed, layerInfos, savedSelection);
    }

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
    bottomGroup.add("button", undefined, "关闭", { name: "cancel" });

    w.center();
    w.show();

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
                buttonText = "✓ " + buttonText;
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
            removeLastTag: removeLastTag,
            removeAllTags: removeAllTags,
            getDisplayTags: getDisplayTags,
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
