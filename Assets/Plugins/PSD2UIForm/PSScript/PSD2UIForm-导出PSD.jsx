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
    EXPORT_SUFFIX: "_UGUI"
};

var TAG_CONFIG = {
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

function hasExplicitImageMainTag(layerName) {
    return parseLayerTagState(layerName).winners.main === "img";
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
function processLayers(layers, statusCallback) {
    var stats = {
        textConverted: 0,                 // 文本图层 → 图片(艺术字)
        effectRasterized: 0,              // 普通图层+特效 → 栅格化
        groupWithEffectMerged: 0,         // 组+特效 → 合并
        groupMerged: 0,                   // 最终主标签为.img 的组 → 合并
        clippingMaskMerged: 0,            // 剪贴蒙版 → 向下合并
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
                if (CONFIG.SKIP_HIDDEN_LAYERS && !layer.visible) {
                    stats.skipped++;
                    continue;
                }
                
                var isGroup = (layerType === "LayerSet");
                
                // ===== 处理图层组 =====
                if (isGroup) {
                    // 1. 优先检查最终主标签是否显式落在 .img
                    if (hasExplicitImageMainTag(layerName)) {
                        if (rasterizeGroup(layer)) {
                            stats.groupMerged++;
                            continue; 
                        } else {
                            stats.errors.push("组(显式.img)合并失败: " + layerName + "，尝试处理子图层");
                            processLayerRecursive(layer.layers);
                        }
                    } 
                    // 2. 检查组是否有特效
                    else if (hasLayerEffect(layer)) {
                        if (rasterizeGroup(layer)) {
                            stats.groupWithEffectMerged++;
                            continue; 
                        } else {
                            stats.errors.push("带特效组合并失败: " + layerName);
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
                        if (hasExplicitImageMainTag(layerName))
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

// 导出处理后的PSD文件
function exportPSD(doc) {
    var originalName = doc.name;
    var baseName = originalName.replace(/\.psd$/i, "");

    // 选择保存文件，默认文件名为 原文件名 + _UGUI.psd
    var defaultFileName = baseName + CONFIG.EXPORT_SUFFIX + ".psd";
    var defaultFolder = null;
    try {
        defaultFolder = doc.path;
    } catch(e) {
        defaultFolder = Folder.myDocuments;
    }

    var saveFile = new File(defaultFolder + "/" + defaultFileName);
    saveFile = saveFile.saveDlg("选择PSD导出文件");
    if (saveFile == null) {
        return null;
    }

    if (!/\.psd$/i.test(saveFile.name)) {
        saveFile = new File(saveFile.fsName + ".psd");
    }

    // 保存选项
    var saveOptions = new PhotoshopSaveOptions();
    saveOptions.embedColorProfile = true;
    saveOptions.alphaChannels = true;
    saveOptions.layers = true;
    saveOptions.maximizeCompatibility = true;

    doc.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
    return saveFile;
}

// 格式化统计信息
function formatStats(stats, duration, savedFile) {
    var message = "";
    
    if (CONFIG.DEBUG_MODE) {
        message += "🔍 调试模式 - 处理完成！\n\n";
    } else {
        message += "✓ PSD优化导出成功！\n\n";
    }
    
    message += "处理统计：\n";
    message += "━━━━━━━━━━━━━━━━━━━━\n";
    
    var totalProcessed = stats.textConverted + 
                        stats.effectRasterized + 
                        stats.groupWithEffectMerged +
                        stats.groupMerged +
                        stats.clippingMaskMerged;
    
    if (stats.textConverted > 0) {
        message += "📄 文本图层 → 图片(艺术字图片): " + stats.textConverted + "\n";
    }
    if (stats.groupMerged > 0) {
        message += "📁🔨 组(显式.img) → 合并为单图: " + stats.groupMerged + "\n";
    }
    if (stats.groupWithEffectMerged > 0) {
        message += "📁✨ 组+特效 → 合并为单图: " + stats.groupWithEffectMerged + "\n";
    }
    if (stats.clippingMaskMerged > 0) {
        message += "🔗 剪贴蒙版 → 向下合并: " + stats.clippingMaskMerged + "\n";
    }
    if (stats.effectRasterized > 0) {
        message += "🖼️✨ 普通图层+特效 → 栅格化: " + stats.effectRasterized + "\n";
    }
    if (stats.skipped > 0) {
        message += "⏭️ 跳过图层: " + stats.skipped + "\n";
    }
    
    message += "━━━━━━━━━━━━━━━━━━━━\n";
    message += "总计处理: " + totalProcessed + " 个图层\n\n";
    
    if (stats.errors.length > 0) {
        message += "⚠️ 错误/警告 (" + stats.errors.length + "):\n";
        message += "━━━━━━━━━━━━━━━━━━━━\n";
        for (var i = 0; i < Math.min(stats.errors.length, 10); i++) {
            message += "• " + stats.errors[i] + "\n";
        }
        if (stats.errors.length > 10) {
            message += "... 还有 " + (stats.errors.length - 10) + " 个错误\n";
        }
        message += "\n";
    }
    
    if (savedFile != null) {
        var fileSize = getFileSizeKB(savedFile);
        message += "文件信息：\n";
        message += "━━━━━━━━━━━━━━━━━━━━\n";
        message += "• 文件大小: " + fileSize + " KB\n";
        message += "• 处理耗时: " + duration + " 秒\n";
        message += "• 保存路径:\n  " + savedFile.fsName + "\n\n";
        message += "✓ 原始文档未被修改，可继续编辑。";
    } else if (CONFIG.DEBUG_MODE) {
        message += "处理耗时: " + duration + " 秒\n\n";
        message += "⚠️ 当前文档已被修改，请检查图层面板。\n";
        message += "━━━━━━━━━━━━━━━━━━━━\n";
        message += "检查要点：\n";
        message += "• 所有文本图层是否变成智能对象 📄→📦\n";
        message += "• 最终主标签为.img 的组是否已合并 📁🔨\n";
        message += "• 带特效的组是否已合并 📁✨\n";
        message += "• 剪贴蒙版是否已向下合并 🔗→🖼️\n";
        message += "• 特效图层是否被正确栅格化 ✨→🖼️\n";
        message += "• 栅格化图层是否已无 fx 标记\n\n";
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

// 主处理流程
function processAndExport() {
    var originalDoc = app.activeDocument;
    var tempDoc = null;
    var startTime = new Date();

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
        
        if (CONFIG.DEBUG_MODE) {
            var confirmDebug = confirm(
                "⚠️ 调试模式已启用\n\n" +
                "将直接在当前文档上进行处理，不会导出新文件。\n" +
                "处理后的修改将保留在当前文档中！\n\n" +
                "处理规则：\n" +
                "• 所有文本图层 → 智能对象 ✅\n" +
                "• 最终主标签为.img 或 带特效的组 → 合并图层\n" +
                "• 剪贴蒙版图层 → 向下合并 🔗\n" +
                "• 带特效的图层 → 栅格化\n" +
                "是否继续？"
            );
            
            if (!confirmDebug) {
                app.displayDialogs = DialogModes.ALL;
                progressWin.close();
                return;
            }
            
            var stats = processLayers(originalDoc.layers, updateStatus);
            
            progressWin.close();
            var endTime = new Date();
            var duration = ((endTime - startTime) / 1000).toFixed(2);
            app.displayDialogs = DialogModes.ALL;
            alert(formatStats(stats, duration, null));
            
        } else {
            updateStatus("正在创建副本...");
            tempDoc = originalDoc.duplicate(originalDoc.name, false);
            app.activeDocument = tempDoc;

            var stats = processLayers(tempDoc.layers, updateStatus);
            
            updateStatus("正在保存文件...");
            var savedFile = exportPSD(tempDoc);

            updateStatus("正在清理...");
            tempDoc.close(SaveOptions.DONOTSAVECHANGES);
            tempDoc = null;
            app.activeDocument = originalDoc;

            progressWin.close();
            var endTime = new Date();
            var duration = ((endTime - startTime) / 1000).toFixed(2);

            app.displayDialogs = DialogModes.ALL;

            if (savedFile != null) {
                alert(formatStats(stats, duration, savedFile));
            } else {
                alert("导出已取消。\n\n处理统计：已转换 " + 
                    stats.textConverted + 
                    " 个文本图层，合并 " + stats.groupMerged + " 个显式.img组，合并 " + stats.groupWithEffectMerged + 
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
        app.displayDialogs = DialogModes.ALL;
        alert("❌ 处理过程中发生严重错误:\n\n" + e.message + "\n\n行号: " + e.line);
    }
}
