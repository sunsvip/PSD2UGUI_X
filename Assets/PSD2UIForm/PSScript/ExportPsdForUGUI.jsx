
    // 联系作者:
    // https://blog.csdn.net/final5788
    // https://github.com/sunsvip
 
function hasLayerEffect(layer) {
    app.activeDocument.activeLayer = layer;
	var hasEffect = false;
	try {
		var ref = new ActionReference();
		var keyLayerEffects = app.charIDToTypeID( 'Lefx' );
		ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyLayerEffects );
		ref.putEnumerated( app.charIDToTypeID( 'Lyr ' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
		var desc = executeActionGet( ref );
		if ( desc.hasKey( keyLayerEffects ) ) {
			hasEffect = true;
		}
	}catch(e) {
		hasEffect = false;
	}
	return hasEffect;
}
function convertLayersToSmartObjects(layers) 
{
    for (var i = layers.length - 1; i >= 0; i--) 
    {
        var layer = layers[i];
        if (layer.typename === "LayerSet")
        {
               convertLayersToSmartObjects(layer.layers); // Recursively convert layers in layer sets
        } 
        else
        {
            if(layer.kind === LayerKind.SOLIDFILL){
                rasterizeLayer(layer);
            }else if (hasLayerEffect(layer) || layer.kind === LayerKind.TEXT){
                convertToSmartObject(layer); // Convert layers with layer effects to smart objects
            }
        }
    }
}
// 栅格化图层
function rasterizeLayer(layer) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), layer.id);
    desc.putReference(charIDToTypeID('null'), ref);
    executeAction(stringIDToTypeID('rasterizeLayer'), desc, DialogModes.NO);
  }
// 递归遍历图层函数
function convertToSmartObject(layer) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), layer.id);
    desc.putReference(charIDToTypeID('null'), ref);
    // 创建一个新的智能对象
    var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
    executeAction(idnewPlacedLayer, desc, DialogModes.NO);
}
// 导出处理后的PSD文件
function exportPSD() {
  var doc = app.activeDocument;
  var savePath = Folder.selectDialog("选择psd导出路径");
  if (savePath != null) {
    var saveOptions = new PhotoshopSaveOptions();
    saveOptions.embedColorProfile = true;
    saveOptions.alphaChannels = true;

    var saveFile = new File(savePath + "/" + doc.name);
    doc.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
    alert("PSD已成功导出!");
  }
}
function convertAndExport(){
    convertLayersToSmartObjects (app.activeDocument.layers);
    //exportPSD();
}
app.activeDocument.suspendHistory("Convert2SmartObject", "convertAndExport();");
//~ convertLayersToSmartObjects (app.activeDocument.layers);
