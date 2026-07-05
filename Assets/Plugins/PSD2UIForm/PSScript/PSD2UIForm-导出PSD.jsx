// ============================================
// PSD优化导出脚本 v2.12
// 功能：自动优化PSD文件结构，便于交付和插件解析
// 作者：sunsvip
// 更新日期：2025-11-21
// ============================================

// ========== 配置选项 ==========
var CONFIG = {
    // 调试模式：true = 只处理不导出不还原，false = 完整流程（处理->导出->还原）
    DEBUG_MODE: false,
    
    // 是否跳过隐藏图层
    SKIP_HIDDEN_LAYERS: false,
    // 导出文件名后缀
    EXPORT_SUFFIX: "_UGUI",
    // 当PSD因2GB限制保存失败时，是否自动回退导出为PSB
    AUTO_FALLBACK_TO_PSB: true
};

var GROUP_FX_MODE_KEEP_STRUCTURE = "keepStructure";
var GROUP_FX_MODE_MERGE = "merge";

var EXPORT_SETTINGS_KEY_NAME = "PSD2UIForm.ExportPSD.Settings";
var EXPORT_SETTINGS_FIELD_LAST_DIR = "lastExportDir";

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
// =============================

// 检查是否有打开的文档
if (app.documents.length === 0) {
    alert("请先打开一个PSD文件！");
} else {
    processAndExport();
}

function parseLayerTagState(layerName) {
    var workingName = String(layerName || "").replace(/^\s+|\s+$/g, "");

    if (/^refp\s+/i.test(workingName)) {
        workingName = workingName.replace(/^refp\s+/i, "");
    } else if (/^ref\s+/i.test(workingName)) {
        workingName = workingName.replace(/^ref\s+/i, "");
    }

    var orderedTags = [];
    while (workingName.length > 0) {
        var splitIndex = workingName.lastIndexOf(".");
        if (splitIndex <= 0 || splitIndex >= workingName.length - 1) {
            break;
        }

        var token = workingName.substring(splitIndex + 1).toLowerCase();
        var mapping = TAG_CONFIG.aliasMap[token];
        if (!mapping) {
            break;
        }

        orderedTags.unshift(mapping);
        workingName = workingName.substring(0, splitIndex).replace(/\s+$/g, "");
    }

    var winners = {};
    for (var i = 0; i < orderedTags.length; i++) {
        var tagMapping = orderedTags[i];
        for (var familyKey in tagMapping) {
            if (tagMapping.hasOwnProperty(familyKey)) {
                winners[familyKey] = tagMapping[familyKey];
            }
        }
    }

    return {
        winners: winners
    };
}

function hasRasterizeAsImageTag(tagSet, tagId) {
    return !!(tagSet && tagId && tagSet[tagId] === true);
}

function isRasterizeAsImageMainTag(mainTag) {
    return hasRasterizeAsImageTag(TAG_CONFIG.rasterizeAsImage.main, mainTag);
}

function isRasterizeAsImageExportTag(exportTag) {
    return hasRasterizeAsImageTag(TAG_CONFIG.rasterizeAsImage.export, exportTag);
}

function isRasterizeAsImageRoleTag(roleTag) {
    return hasRasterizeAsImageTag(TAG_CONFIG.rasterizeAsImage.role, roleTag);
}

function hasExplicitRasterizeAsImageTag(layerName) {
    var winners = parseLayerTagState(layerName).winners;
    return isRasterizeAsImageMainTag(winners.main)
        || isRasterizeAsImageExportTag(winners.export)
        || isRasterizeAsImageRoleTag(winners.role);
}

/**
 * 检查图层是否包含需要栅格化/合并的特性
 * 只检测必须栅格化才能保持效果的特性：图层特效、蒙版
 * @param {Layer} layer - 要检查的图层
 * @returns {Boolean} - 是否需要栅格化
 */
function hasLayerEffect(layer) {
    try {
        var ref = new ActionReference();
        ref.putIdentifier(app.charIDToTypeID('Lyr '), layer.id);
        var desc = executeActionGet(ref);

        function getBooleanIfPresent(targetDesc, keyID) {
            try {
                if (targetDesc.hasKey(keyID)) {
                    return targetDesc.getBoolean(keyID);
                }
            } catch (ignored) {}
            return null;
        }

        function getFirstBoolean(targetDesc, keyIDs) {
            for (var idx = 0; idx < keyIDs.length; idx++) {
                var value = getBooleanIfPresent(targetDesc, keyIDs[idx]);
                if (value !== null) {
                    return value;
                }
            }
            return null;
        }

        function isEffectEntryEnabled(effectDesc) {
            var enabled = getFirstBoolean(effectDesc, [
                app.charIDToTypeID('enab'),
                app.stringIDToTypeID('enabled')
            ]);

            if (enabled !== null) {
                return enabled;
            }

            // 某些旧版 PS 的单个特效对象不返回 enabled，
            // 此时交给外层总开关判断，不在这里误判为关闭。
            return true;
        }

        function hasEnabledLayerStyles(layerDesc) {
            var keyLayerEffects = app.charIDToTypeID('Lefx');
            if (!layerDesc.hasKey(keyLayerEffects)) {
                return false;
            }

            var keyLayerFXVisible = app.stringIDToTypeID('layerFXVisible');
            var layerFXVisible = getBooleanIfPresent(layerDesc, keyLayerFXVisible);
            if (layerFXVisible === false) {
                return false;
            }

            var effectsDesc = layerDesc.getObjectValue(keyLayerEffects);

            var effectsRootEnabled = getFirstBoolean(effectsDesc, [
                app.charIDToTypeID('enab'),
                app.stringIDToTypeID('enabled')
            ]);
            if (effectsRootEnabled === false) {
                return false;
            }
            
            // Photoshop 所有版本支持的10种图层特效
            var effectTypeIDs = [
                app.charIDToTypeID('DrSh'),        // Drop Shadow 投影
                app.charIDToTypeID('IrSh'),        // Inner Shadow 内阴影
                app.charIDToTypeID('OrGl'),        // Outer Glow 外发光
                app.charIDToTypeID('IrGl'),        // Inner Glow 内发光
                app.charIDToTypeID('ebbl'),        // Bevel and Emboss 斜面和浮雕
                app.charIDToTypeID('SoFi'),        // Satin 光泽
                app.charIDToTypeID('FrFX'),        // Stroke 描边
                app.charIDToTypeID('GrFl'),        // Gradient Overlay 渐变叠加
                app.charIDToTypeID('ClrO'),        // Color Overlay 颜色叠加
                app.stringIDToTypeID('patternFill') // Pattern Overlay 图案叠加
            ];
            
            for (var i = 0; i < effectTypeIDs.length; i++) {
                var effectID = effectTypeIDs[i];
                if (effectsDesc.hasKey(effectID)) {
                    try {
                        var effectValueType = effectsDesc.getType(effectID);

                        if (effectValueType === DescValueType.OBJECTTYPE) {
                            if (isEffectEntryEnabled(effectsDesc.getObjectValue(effectID))) {
                                return true;
                            }
                        } else if (effectValueType === DescValueType.LISTTYPE) {
                            var effectList = effectsDesc.getList(effectID);
                            for (var listIndex = 0; listIndex < effectList.count; listIndex++) {
                                try {
                                    if (effectList.getType(listIndex) === DescValueType.OBJECTTYPE &&
                                        isEffectEntryEnabled(effectList.getObjectValue(listIndex))) {
                                        return true;
                                    }
                                } catch (ignoredListItem) {}
                            }
                        }
                    } catch (ignoredEffectType) {
                        try {
                            if (isEffectEntryEnabled(effectsDesc.getObjectValue(effectID))) {
                                return true;
                            }
                        } catch (ignoredEffectObject) {}
                    }
                }
            }

            return false;
        }
        
        // ===== 1. 检查图层特效 (Layer Effects/Styles) =====
        if (hasEnabledLayerStyles(desc)) {
            return true;
        }
        
        // ===== 2. 检查图层蒙版 (Layer Mask) =====
        // 旧版 PS 中 LayerSet 的 UsrM 兼容性不稳定，优先使用显式的 has/enabled 组合判断。
        var hasUserMask = getBooleanIfPresent(desc, app.stringIDToTypeID('hasUserMask'));
        var userMaskEnabled = getFirstBoolean(desc, [
            app.stringIDToTypeID('userMaskEnabled'),
            app.charIDToTypeID('UsrM')
        ]);
        if (hasUserMask === true && userMaskEnabled === true) {
            return true;
        }
        if (hasUserMask === null && userMaskEnabled === true) {
            // 兼容更老的描述符：没有 hasUserMask 时才退回使用 UsrM。
            return true;
        }
        
        // ===== 3. 检查矢量蒙版 (Vector Mask) =====
        var hasVectorMask = getBooleanIfPresent(desc, app.stringIDToTypeID('hasVectorMask'));
        var keyVectorMaskEnabled = app.stringIDToTypeID('vectorMaskEnabled');
        var vectorMaskEnabled = getBooleanIfPresent(desc, keyVectorMaskEnabled);
        if (hasVectorMask === true && vectorMaskEnabled === true) {
            return true;
        }
        if (hasVectorMask === null && vectorMaskEnabled === true) {
            // 兼容缺少 hasVectorMask 字段的旧描述符。
            return true;
        }

        return false;
    } catch(e) {
        return false;
    }
}

/**
 * 检查图层是否是剪贴蒙版
 * @param {Layer} layer - 要检查的图层
 * @returns {Boolean}
 */
function isClippingMask(layer) {
    try {
        if (layer.typename === "ArtLayer") {
            return layer.grouped;
        }
        return false;
    } catch(e) {
        return false;
    }
}

/**
 * 将剪贴蒙版图层向下合并
 * @param {Layer} layer - 要合并的剪贴蒙版图层
 * @returns {Boolean} - 合并是否成功
 */
function mergeClippingMaskDown(layer) {
    try {
        // 检查图层是否是剪贴蒙版
        if (!isClippingMask(layer)) {
            return false;
        }
        
        // 检查图层类型
        if (layer.typename !== "ArtLayer") {
            return false;
        }
        
        var doc = app.activeDocument;
        
        // 激活要合并的图层
        doc.activeLayer = layer;
        
        // 执行向下合并操作
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(app.charIDToTypeID('Lyr '), app.charIDToTypeID('Ordn'), app.charIDToTypeID('Trgt'));
        desc.putReference(app.charIDToTypeID('null'), ref);
        executeAction(app.charIDToTypeID('Mrg2'), desc, DialogModes.NO); // Mrg2 = Merge Down
        
        return true;
    } catch(e) {
        return false;
    }
}

// 转换为智能对象（使用原始代码的方法）
function convertToSmartObject(layer) {
    try {
        app.activeDocument.activeLayer = layer;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID('Lyr '), layer.id);
        desc.putReference(charIDToTypeID('null'), ref);
        var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
        executeAction(idnewPlacedLayer, desc, DialogModes.NO);
        return true;
    } catch(e) {
        return false;
    }
}

// 栅格化图层（包含特效）
function rasterizeLayerWithEffects(layer) {
    try {
        app.activeDocument.activeLayer = layer;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc.putReference(charIDToTypeID('null'), ref);
        desc.putEnumerated(stringIDToTypeID('what'), stringIDToTypeID('rasterizeItem'), stringIDToTypeID('layerStyle'));
        executeAction(stringIDToTypeID('rasterizeLayer'), desc, DialogModes.NO);
        return true;
    } catch(e) {
        try {
            app.activeDocument.activeLayer = layer;
            var desc2 = new ActionDescriptor();
            var ref2 = new ActionReference();
            ref2.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
            desc2.putReference(charIDToTypeID('null'), ref2);
            executeAction(charIDToTypeID('Mrg2'), desc2, DialogModes.NO);
            return true;
        } catch(e2) {
            return false;
        }
    }
}

// 栅格化组（合并组）
function rasterizeGroup(group) {
    var mergedLayer = null;
    var originalName = null;
    try {
        originalName = group.name;
    } catch(ignoreNameError) {}

    try {
        // LayerSet.merge() 是 Photoshop DOM 对“合并组”的直接调用，
        // 比上下文相关的 Mrg2 动作更稳定。
        mergedLayer = group.merge();
        if (mergedLayer != null) {
            if (originalName) {
                try {
                    mergedLayer.name = originalName;
                } catch(ignoreRenameError) {}
            }
            return true;
        }
    } catch(ignoreMergeMethodError) {}

    try {
        app.activeDocument.activeLayer = group;
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc.putReference(charIDToTypeID('null'), ref);
        executeAction(charIDToTypeID('Mrg2'), desc, DialogModes.NO);
        return true;
    } catch(e) {
        return false;
    }
}

// 处理图层（递归）
function processLayers(layers, statusCallback, options) {
    options = options || buildDefaultExportOptions(app.activeDocument, []);
    var stats = {
        textConverted: 0,                 // 文本图层转为图片
        effectRasterized: 0,              // 普通图层特效栅格化
        groupWithEffectMerged: 0,         // 带特效组已合并
        groupMerged: 0,                   // 图片类标签组已合并
        clippingMaskMerged: 0,            // 剪贴蒙版向下合并
        skipped: 0,
        errors: []
    };

    function processLayerRecursive(layers) {
        // 从后向前处理
        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i];
            
            // 更新状态
            if (statusCallback) {
                var shortName = layer.name.length > 20 ? layer.name.substring(0, 20) + "..." : layer.name;
                statusCallback("处理中: " + shortName);
            }
            
            try {
                var layerName = layer.name;
                var layerType = layer.typename;
                
                // 跳过隐藏的图层
                if (options.skipHiddenLayers && !layer.visible) {
                    stats.skipped++;
                    continue;
                }
                
                var isGroup = (layerType === "LayerSet");
                
                // ===== 处理图层组 =====
                if (isGroup) {
                    // 1. 优先检查是否显式标记为图片类输出
                    if (hasExplicitRasterizeAsImageTag(layerName)) {
                        if (rasterizeGroup(layer)) {
                            stats.groupMerged++;
                            continue; 
                        } else {
                            stats.errors.push("组(图片类标签)合并失败: " + layerName + "，尝试处理子图层");
                            processLayerRecursive(layer.layers);
                        }
                    } 
                    // 2. 检查组是否有特效
                    else if (hasLayerEffect(layer)) {
                        if (options.groupFxMode === GROUP_FX_MODE_MERGE) {
                            if (rasterizeGroup(layer)) {
                                stats.groupWithEffectMerged++;
                                continue;
                            } else {
                                stats.errors.push("带特效组合并失败: " + layerName);
                                processLayerRecursive(layer.layers);
                            }
                        } else {
                            processLayerRecursive(layer.layers);
                        }
                    } 
                    // 3. 普通组，递归处理
                    else {
                        processLayerRecursive(layer.layers);
                    }
                    continue;
                }

                // ===== 处理剪贴蒙版图层 =====
                if (isClippingMask(layer)) {
                    if (mergeClippingMaskDown(layer)) {
                        stats.clippingMaskMerged++;
                        continue;
                    } else {
                        stats.errors.push("剪贴蒙版合并失败: " + layerName);
                    }
                }

                // ===== 检查是否为文本图层 =====
                    var isText = false;
                    try {
                        isText = (layer.kind === LayerKind.TEXT);
                    } catch(e) {}
                    if (isText) {
                        //if (convertToSmartObject(layer))
                        if (hasExplicitRasterizeAsImageTag(layerName))
                        {
                            if( rasterizeLayerWithEffects(layer))
                                stats.textConverted++;
                            else {
                                stats.errors.push("文本转换失败: " + layerName);
                                stats.skipped++;
                            }
                        } 
                        continue; 
                    }
                // ===== 后续处理普通图层特效 =====
                if (hasLayerEffect(layer)) {
                    if (rasterizeLayerWithEffects(layer)) {
                        stats.effectRasterized++;
                    } else {
                        stats.errors.push("图层特效栅格化失败: " + layerName);
                    }
                    continue;
                }

            } catch(e) {
                stats.errors.push("处理图层异常 [" + layer.name + "]: " + e.message);
                stats.skipped++;
            }
        }
    }

    processLayerRecursive(layers);
    return stats;
}

// 获取文件大小（KB）
function getFileSizeKB(file) {
    try {
        if (file.exists) {
            return (file.length / 1024).toFixed(2);
        }
    } catch(e) {}
    return "未知";
}

function buildPhotoshopSaveOptions() {
    var saveOptions = new PhotoshopSaveOptions();
    saveOptions.embedColorProfile = true;
    saveOptions.alphaChannels = true;
    saveOptions.layers = true;
    saveOptions.maximizeCompatibility = true;
    return saveOptions;
}

function replaceFileExtension(file, extensionWithDot) {
    var fsName = file.fsName;
    if (/\.[^\.\\\/]+$/i.test(fsName)) {
        fsName = fsName.replace(/\.[^\.\\\/]+$/i, extensionWithDot);
    } else {
        fsName += extensionWithDot;
    }
    return new File(fsName);
}

function trimString(value) {
    return String(value || "").replace(/^\s+|\s+$/g, "");
}

function normalizeFolderPath(pathValue) {
    var normalized = trimString(pathValue).replace(/\\/g, "/");
    normalized = normalized.replace(/\/+$/g, "");
    return normalized;
}

function loadLastExportFolderPath() {
    try {
        var desc = app.getCustomOptions(app.stringIDToTypeID(EXPORT_SETTINGS_KEY_NAME));
        var key = app.stringIDToTypeID(EXPORT_SETTINGS_FIELD_LAST_DIR);
        if (!desc.hasKey(key)) {
            return "";
        }
        return normalizeFolderPath(desc.getString(key));
    } catch (ignoredLoadExportSettings) {}
    return "";
}

function saveLastExportFolderPath(pathValue) {
    var normalized = normalizeFolderPath(pathValue);
    try {
        if (!normalized) {
            app.eraseCustomOptions(app.stringIDToTypeID(EXPORT_SETTINGS_KEY_NAME));
            return;
        }

        var desc = new ActionDescriptor();
        desc.putString(app.stringIDToTypeID(EXPORT_SETTINGS_FIELD_LAST_DIR), normalized);
        app.putCustomOptions(app.stringIDToTypeID(EXPORT_SETTINGS_KEY_NAME), desc, true);
    } catch (ignoredSaveExportSettings) {}
}

function resolveDefaultExportFolder(doc) {
    var lastExportFolderPath = loadLastExportFolderPath();
    if (lastExportFolderPath) {
        var lastExportFolder = new Folder(lastExportFolderPath);
        if (lastExportFolder.exists) {
            return lastExportFolder;
        }
    }

    try {
        if (doc.path) {
            return doc.path;
        }
    } catch (ignoredDocPath) {}

    return Folder.myDocuments;
}

function getLayerDescriptor(layer) {
    var ref = new ActionReference();
    ref.putIdentifier(app.charIDToTypeID('Lyr '), layer.id);
    return executeActionGet(ref);
}

function getDescriptorNumber(desc, keyID) {
    try {
        var valueType = desc.getType(keyID);
        if (valueType === DescValueType.UNITDOUBLE) {
            return desc.getUnitDoubleValue(keyID);
        }
        if (valueType === DescValueType.DOUBLETYPE) {
            return desc.getDouble(keyID);
        }
        if (valueType === DescValueType.INTEGERTYPE) {
            return desc.getInteger(keyID);
        }
    } catch (ignoredNumberRead) {}
    return null;
}

function getArtboardBounds(layer) {
    try {
        if (layer.typename !== "LayerSet") {
            return null;
        }

        var desc = getLayerDescriptor(layer);
        var artboardKey = app.stringIDToTypeID("artboard");
        if (!desc.hasKey(artboardKey)) {
            return null;
        }

        var artboardDesc = desc.getObjectValue(artboardKey);
        var rectKey = app.stringIDToTypeID("artboardRect");
        if (!artboardDesc.hasKey(rectKey)) {
            return null;
        }

        var rectDesc = artboardDesc.getObjectValue(rectKey);
        var left = getDescriptorNumber(rectDesc, app.stringIDToTypeID("left"));
        var top = getDescriptorNumber(rectDesc, app.stringIDToTypeID("top"));
        var right = getDescriptorNumber(rectDesc, app.stringIDToTypeID("right"));
        var bottom = getDescriptorNumber(rectDesc, app.stringIDToTypeID("bottom"));
        if (left === null || top === null || right === null || bottom === null) {
            return null;
        }

        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom
        };
    } catch (ignoredArtboardRead) {}
    return null;
}

function collectTopLevelArtboards(doc) {
    var artboards = [];
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        var bounds = getArtboardBounds(layer);
        if (bounds != null) {
            artboards.push({
                layerIndex: i,
                name: layer.name,
                bounds: bounds
            });
        }
    }
    return artboards;
}

function sanitizeFileName(name) {
    var sanitized = String(name || "Untitled").replace(/[\\\/\:\*\?\"\<\>\|]/g, "_");
    sanitized = sanitized.replace(/^\s+|\s+$/g, "");
    return sanitized || "Untitled";
}

function buildDefaultExportOptions(doc, artboards) {
    return {
        outputFolderPath: resolveDefaultExportFolder(doc).fsName,
        exportSuffix: CONFIG.EXPORT_SUFFIX,
        exportMode: "document",
        artboards: artboards || [],
        selectedArtboardIndexes: [],
        groupFxMode: GROUP_FX_MODE_KEEP_STRUCTURE,
        skipHiddenLayers: CONFIG.SKIP_HIDDEN_LAYERS,
        debugMode: CONFIG.DEBUG_MODE
    };
}

function showExportOptionsDialog(doc, artboards) {
    var options = buildDefaultExportOptions(doc, artboards);
    var win = new Window("dialog", "PSD2UIForm 导出配置");
    win.orientation = "column";
    win.alignChildren = "fill";

    var outputPanel = win.add("panel", undefined, "输出");
    outputPanel.orientation = "column";
    outputPanel.alignChildren = "fill";

    var folderGroup = outputPanel.add("group");
    folderGroup.orientation = "row";
    folderGroup.alignChildren = ["fill", "center"];
    folderGroup.add("statictext", undefined, "目录:");
    var folderText = folderGroup.add("edittext", undefined, options.outputFolderPath);
    folderText.characters = 42;
    var browseButton = folderGroup.add("button", undefined, "选择...");
    browseButton.onClick = function() {
        var selectedFolder = Folder.selectDialog("选择 PSD2UIForm 导出目录", new Folder(folderText.text));
        if (selectedFolder != null) {
            folderText.text = selectedFolder.fsName;
        }
    };

    var suffixGroup = outputPanel.add("group");
    suffixGroup.orientation = "row";
    suffixGroup.add("statictext", undefined, "后缀:");
    var suffixText = suffixGroup.add("edittext", undefined, options.exportSuffix);
    suffixText.characters = 18;

    var rangePanel = win.add("panel", undefined, "导出范围");
    rangePanel.orientation = "column";
    rangePanel.alignChildren = "fill";
    var documentRadio = rangePanel.add("radiobutton", undefined, "整个 PSD");
    var artboardRadio = rangePanel.add("radiobutton", undefined, "选择画板，每个画板导出一个 PSD/PSB");
    documentRadio.value = true;
    artboardRadio.enabled = artboards.length > 0;

    var artboardListPanel = rangePanel.add("panel", undefined, "画板");
    artboardListPanel.orientation = "column";
    artboardListPanel.alignChildren = "left";
    var artboardChecks = [];
    if (artboards.length > 0) {
        for (var i = 0; i < artboards.length; i++) {
            var check = artboardListPanel.add("checkbox", undefined, artboards[i].name);
            check.value = true;
            check.enabled = false;
            artboardChecks.push(check);
        }
    } else {
        var emptyArtboardText = artboardListPanel.add("statictext", undefined, "未检测到 Photoshop 画板。");
        emptyArtboardText.enabled = false;
    }

    function syncArtboardChecks() {
        var enabled = artboardRadio.value && artboards.length > 0;
        for (var i = 0; i < artboardChecks.length; i++) {
            artboardChecks[i].enabled = enabled;
        }
    }
    documentRadio.onClick = syncArtboardChecks;
    artboardRadio.onClick = syncArtboardChecks;

    var groupFxPanel = win.add("panel", undefined, "Group FX");
    groupFxPanel.orientation = "column";
    groupFxPanel.alignChildren = "left";
    var keepGroupFxRadio = groupFxPanel.add("radiobutton", undefined, "保留组结构，不合并带 FX 的 Group");
    var mergeGroupFxRadio = groupFxPanel.add("radiobutton", undefined, "合并带 FX 的 Group，完整保留组特效视觉");
    keepGroupFxRadio.value = true;

    var miscPanel = win.add("panel", undefined, "其他");
    miscPanel.orientation = "column";
    miscPanel.alignChildren = "left";
    var skipHiddenCheck = miscPanel.add("checkbox", undefined, "跳过隐藏图层");
    skipHiddenCheck.value = options.skipHiddenLayers;
    var debugCheck = miscPanel.add("checkbox", undefined, "调试模式：直接处理当前文档，不导出");
    debugCheck.value = options.debugMode;

    var buttons = win.add("group");
    buttons.alignment = "right";
    var okButton = buttons.add("button", undefined, "开始", { name: "ok" });
    buttons.add("button", undefined, "取消", { name: "cancel" });

    okButton.onClick = function() {
        var outputFolder = new Folder(folderText.text);
        if (!debugCheck.value && !outputFolder.exists) {
            alert("导出目录不存在:\n" + folderText.text);
            return;
        }

        var suffix = trimString(suffixText.text);
        if (!suffix) {
            alert("文件名后缀不能为空。");
            return;
        }

        options.outputFolderPath = outputFolder.fsName;
        options.exportSuffix = suffix;
        options.exportMode = artboardRadio.value ? "artboards" : "document";
        options.groupFxMode = mergeGroupFxRadio.value ? GROUP_FX_MODE_MERGE : GROUP_FX_MODE_KEEP_STRUCTURE;
        options.skipHiddenLayers = skipHiddenCheck.value;
        options.debugMode = debugCheck.value;
        options.selectedArtboardIndexes = [];

        if (options.debugMode && artboardRadio.value) {
            alert("调试模式会直接修改当前文档，只支持整个 PSD 处理。");
            return;
        }

        if (options.exportMode === "artboards") {
            for (var i = 0; i < artboardChecks.length; i++) {
                if (artboardChecks[i].value) {
                    options.selectedArtboardIndexes.push(i);
                }
            }
            if (options.selectedArtboardIndexes.length === 0) {
                alert("请至少选择一个画板。");
                return;
            }
        }

        win.close(1);
    };

    return win.show() === 1 ? options : null;
}

function saveAsPSB(doc, saveFile) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(stringIDToTypeID("maximizeCompatibility"), true);
    desc1.putObject(charIDToTypeID("As  "), charIDToTypeID("Pht8"), desc2);
    desc1.putPath(charIDToTypeID("In  "), saveFile instanceof File ? saveFile : new File(saveFile));
    desc1.putBoolean(charIDToTypeID("LwCs"), true);
    executeAction(charIDToTypeID("save"), desc1, DialogModes.NO);
}

function buildExportFile(outputFolderPath, baseName, suffix) {
    return new File(outputFolderPath + "/" + sanitizeFileName(baseName + suffix) + ".psd");
}

function exportPSDToFile(doc, saveFile) {
    if (!/\.(psd|psb)$/i.test(saveFile.name)) {
        saveFile = new File(saveFile.fsName + ".psd");
    }

    if (/\.psb$/i.test(saveFile.name)) {
        saveAsPSB(doc, saveFile);
        if (saveFile.parent) {
            saveLastExportFolderPath(saveFile.parent.fsName || saveFile.parent.fullName);
        }
        return saveFile;
    }

    try {
        doc.saveAs(saveFile, buildPhotoshopSaveOptions(), true, Extension.LOWERCASE);
        if (saveFile.parent) {
            saveLastExportFolderPath(saveFile.parent.fsName || saveFile.parent.fullName);
        }
        return saveFile;
    } catch (e) {
        var shouldFallbackToPSB = CONFIG.AUTO_FALLBACK_TO_PSB && /2\s*GB/i.test(String(e.message || ""));
        if (!shouldFallbackToPSB) {
            throw e;
        }

        var psbFile = replaceFileExtension(saveFile, ".psb");
        saveAsPSB(doc, psbFile);
        if (psbFile.parent) {
            saveLastExportFolderPath(psbFile.parent.fsName || psbFile.parent.fullName);
        }
        return psbFile;
    }
}

// 格式化统计信息
function formatStats(stats, duration, savedFile, options) {
    options = options || buildDefaultExportOptions(app.activeDocument, []);
    var message = "";
    
    if (options.debugMode) {
        message += "调试模式处理完成。\n\n";
    } else {
        message += "PSD优化导出成功。\n\n";
    }
    
    message += "处理统计：\n";
    message += "--------------------\n";
    
    var totalProcessed = stats.textConverted + 
                        stats.effectRasterized + 
                        stats.groupWithEffectMerged +
                        stats.groupMerged +
                        stats.clippingMaskMerged;
    
    if (stats.textConverted > 0) {
        message += "文本图层转为图片: " + stats.textConverted + "\n";
    }
    if (stats.groupMerged > 0) {
        message += "图片类标签组已合并: " + stats.groupMerged + "\n";
    }
    if (stats.groupWithEffectMerged > 0) {
        message += "带特效组已合并: " + stats.groupWithEffectMerged + "\n";
    }
    if (stats.clippingMaskMerged > 0) {
        message += "剪贴蒙版向下合并: " + stats.clippingMaskMerged + "\n";
    }
    if (stats.effectRasterized > 0) {
        message += "普通图层特效已栅格化: " + stats.effectRasterized + "\n";
    }
    if (stats.skipped > 0) {
        message += "跳过图层: " + stats.skipped + "\n";
    }
    
    message += "--------------------\n";
    message += "总计处理: " + totalProcessed + " 个图层\n\n";
    
    if (stats.errors.length > 0) {
        message += "错误或警告 (" + stats.errors.length + "):\n";
        message += "--------------------\n";
        for (var i = 0; i < Math.min(stats.errors.length, 10); i++) {
            message += "- " + stats.errors[i] + "\n";
        }
        if (stats.errors.length > 10) {
            message += "... 还有 " + (stats.errors.length - 10) + " 个错误\n";
        }
        message += "\n";
    }
    
    if (savedFile != null) {
        var savedFiles = savedFile instanceof Array ? savedFile : [savedFile];
        message += "文件信息：\n";
        message += "--------------------\n";
        if (savedFiles.length === 1) {
            message += "文件大小: " + getFileSizeKB(savedFiles[0]) + " KB\n";
        } else {
            message += "导出文件数: " + savedFiles.length + "\n";
        }
        message += "处理耗时: " + duration + " 秒\n";
        message += "保存路径:\n";
        for (var pathIndex = 0; pathIndex < Math.min(savedFiles.length, 10); pathIndex++) {
            message += "  " + savedFiles[pathIndex].fsName + "\n";
        }
        if (savedFiles.length > 10) {
            message += "  ... 还有 " + (savedFiles.length - 10) + " 个文件\n";
        }
        message += "\n";
        message += "原始文档未被修改，可继续编辑。";
    } else if (options.debugMode) {
        message += "处理耗时: " + duration + " 秒\n\n";
        message += "当前文档已被修改，请检查图层面板。\n";
        message += "--------------------\n";
        message += "检查要点：\n";
        message += "1. 显式图片类文本是否已转为图片。\n";
        message += "2. 图片类标签的组是否已合并。\n";
        message += "3. 带特效的组是否按配置处理。\n";
        message += "4. 剪贴蒙版是否已向下合并。\n";
        message += "5. 特效图层是否已正确栅格化。\n";
        message += "6. 栅格化图层是否已无 fx 标记。\n\n";
        message += "如需还原: Ctrl+Z 或关闭文档不保存";
    } else {
        message += "处理耗时: " + duration + " 秒";
    }
    
    return message;
}

function duplicateDocument(doc) {
    try {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc.putReference(charIDToTypeID('null'), ref);
        desc.putString(charIDToTypeID('Nm  '), doc.name + " copy");
        desc.putBoolean(charIDToTypeID('Mrgd'), false);
        executeAction(charIDToTypeID('Dplc'), desc, DialogModes.NO);
        return app.activeDocument;
    } catch(e) {
        return null;
    }
}

function createEmptyStats() {
    return {
        textConverted: 0,
        effectRasterized: 0,
        groupWithEffectMerged: 0,
        groupMerged: 0,
        clippingMaskMerged: 0,
        skipped: 0,
        errors: []
    };
}

function mergeStats(target, source) {
    target.textConverted += source.textConverted;
    target.effectRasterized += source.effectRasterized;
    target.groupWithEffectMerged += source.groupWithEffectMerged;
    target.groupMerged += source.groupMerged;
    target.clippingMaskMerged += source.clippingMaskMerged;
    target.skipped += source.skipped;
    for (var i = 0; i < source.errors.length; i++) {
        target.errors.push(source.errors[i]);
    }
}

function removeTopLevelLayersExcept(doc, keepLayerIndex, stats) {
    for (var i = doc.layers.length - 1; i >= 0; i--) {
        if (i === keepLayerIndex) {
            continue;
        }

        try {
            doc.layers[i].remove();
        } catch (removeError) {
            try {
                doc.layers[i].visible = false;
                stats.errors.push("画板导出时无法删除顶层图层，已隐藏: " + doc.layers[i].name);
            } catch (hideError) {
                stats.errors.push("画板导出时无法隔离顶层图层: " + removeError.message);
            }
        }
    }
}

function cropDocumentToArtboard(doc, artboard, stats) {
    try {
        doc.crop([
            UnitValue(artboard.bounds.left, "px"),
            UnitValue(artboard.bounds.top, "px"),
            UnitValue(artboard.bounds.right, "px"),
            UnitValue(artboard.bounds.bottom, "px")
        ]);
    } catch (cropError) {
        stats.errors.push("画板裁剪失败 [" + artboard.name + "]: " + cropError.message);
    }
}

// 主处理流程
function processAndExport() {
    var originalDoc = app.activeDocument;
    var artboards = collectTopLevelArtboards(originalDoc);
    var options = showExportOptionsDialog(originalDoc, artboards);
    if (options == null) {
        return;
    }

    var tempDoc = null;
    var startTime = new Date();
    var previousDisplayDialogs = app.displayDialogs;

    // 创建进度窗口
    var progressWin = new Window("palette", "PSD处理中...", undefined);
    var statusText = progressWin.add("statictext", [0, 0, 450, 20], "正在初始化...");
    statusText.justify = "left";
    progressWin.center();
    
    function updateStatus(msg) {
        statusText.text = msg;
        progressWin.update();
    }

    try {
        app.displayDialogs = DialogModes.NO;
        progressWin.show();
        
        if (options.debugMode) {
            var confirmDebug = confirm(
                "调试模式已启用。\n\n" +
                "将直接在当前文档上进行处理，不会导出新文件。\n" +
                "处理后的修改将保留在当前文档中！\n\n" +
                "处理规则：\n" +
                "1. 显式图片类文本图层转为图片。\n" +
                "2. 显式图片类标签组会合并图层。\n" +
                "3. 带特效的组按导出配置处理。\n" +
                "4. 剪贴蒙版图层会向下合并。\n" +
                "5. 带特效的图层会栅格化。\n" +
                "是否继续？"
            );
            
            if (!confirmDebug) {
                app.displayDialogs = previousDisplayDialogs;
                progressWin.close();
                return;
            }
            
            var stats = processLayers(originalDoc.layers, updateStatus, options);
            
            progressWin.close();
            var endTime = new Date();
            var duration = ((endTime - startTime) / 1000).toFixed(2);
            app.displayDialogs = previousDisplayDialogs;
            alert(formatStats(stats, duration, null, options));
            
        } else if (options.exportMode === "artboards") {
            var aggregateStats = createEmptyStats();
            var savedFiles = [];

            for (var artboardIndex = 0; artboardIndex < options.selectedArtboardIndexes.length; artboardIndex++) {
                var selectedIndex = options.selectedArtboardIndexes[artboardIndex];
                var artboard = options.artboards[selectedIndex];

                updateStatus("正在创建画板副本: " + artboard.name);
                tempDoc = originalDoc.duplicate(sanitizeFileName(artboard.name) + " copy", false);
                app.activeDocument = tempDoc;

                updateStatus("正在隔离画板: " + artboard.name);
                removeTopLevelLayersExcept(tempDoc, artboard.layerIndex, aggregateStats);
                cropDocumentToArtboard(tempDoc, artboard, aggregateStats);

                var artboardStats = processLayers(tempDoc.layers, updateStatus, options);
                mergeStats(aggregateStats, artboardStats);

                updateStatus("正在保存画板: " + artboard.name);
                var artboardFile = buildExportFile(options.outputFolderPath, artboard.name, options.exportSuffix);
                savedFiles.push(exportPSDToFile(tempDoc, artboardFile));

                updateStatus("正在清理画板副本...");
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
                tempDoc = null;
                app.activeDocument = originalDoc;
            }

            progressWin.close();
            var artboardEndTime = new Date();
            var artboardDuration = ((artboardEndTime - startTime) / 1000).toFixed(2);
            app.displayDialogs = previousDisplayDialogs;
            alert(formatStats(aggregateStats, artboardDuration, savedFiles, options));
        } else {
            updateStatus("正在创建副本...");
            tempDoc = originalDoc.duplicate(originalDoc.name, false);
            app.activeDocument = tempDoc;

            var stats = processLayers(tempDoc.layers, updateStatus, options);
            
            updateStatus("正在保存文件...");
            var originalName = originalDoc.name;
            var baseName = originalName.replace(/\.(psd|psb)$/i, "");
            var saveFile = buildExportFile(options.outputFolderPath, baseName, options.exportSuffix);
            var savedFile = exportPSDToFile(tempDoc, saveFile);

            updateStatus("正在清理...");
            tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            tempDoc = null;
            app.activeDocument = originalDoc;

            progressWin.close();
            var endTime = new Date();
            var duration = ((endTime - startTime) / 1000).toFixed(2);

            app.displayDialogs = previousDisplayDialogs;

            if (savedFile != null) {
                alert(formatStats(stats, duration, savedFile, options));
            } else {
                alert("导出已取消。\n\n处理统计：已转换 " + 
                    stats.textConverted + 
                    " 个文本图层，合并 " + stats.groupMerged + " 个图片类标签组，合并 " + stats.groupWithEffectMerged +
                    " 个特效组，合并 " + stats.clippingMaskMerged + " 个剪贴蒙版，栅格化 " + 
                    stats.effectRasterized + 
                    " 个特效图层。");
            }
        }

    } catch(e) {
        if (tempDoc != null) {
            try {
                tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            } catch(closeError) {}
        }
        if (progressWin) progressWin.close();
        
        app.activeDocument = originalDoc;
        app.displayDialogs = previousDisplayDialogs;
        alert("处理过程中发生严重错误:\n\n" + e.message + "\n\n行号: " + e.line);
    }
}
