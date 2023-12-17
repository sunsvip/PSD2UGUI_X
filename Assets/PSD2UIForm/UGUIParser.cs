/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using Aspose.PSD.FileFormats.Psd.Layers.FillLayers;
using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using TMPro;
using UnityEditor;
using UnityEngine;

namespace UGF.EditorTools.Psd2UGUI
{
    public enum GUIType
    {
        Null = 0,
        Image,
        RawImage,
        Text,
        Button,
        Dropdown,
        InputField,
        Toggle,
        Slider,
        ScrollView,
        Mask,
        FillColor, //纯色填充
        TMPText,
        TMPButton,
        TMPDropdown,
        TMPInputField,
        TMPToggle,

        //UI的子类型, 以101开始。 0-100预留给UI类型, 新类型从尾部追加
        Background = 101, //通用背景

        //Button的子类型
        Button_Highlight,
        Button_Press,
        Button_Select,
        Button_Disable,
        Button_Text,

        //Dropdown/TMPDropdown的子类型
        Dropdown_Label,
        Dropdown_Arrow,

        //InputField/TMPInputField的子类型
        InputField_Placeholder,
        InputField_Text,

        //Toggle的子类型
        Toggle_Checkmark,
        Toggle_Label,

        //Slider的子类型
        Slider_Fill,
        Slider_Handle,

        //ScrollView的子类型
        ScrollView_Viewport, //列表可视区域的遮罩图
        ScrollView_HorizontalBarBG, //水平滑动栏背景
        ScrollView_HorizontalBar,//水平滑块
        ScrollView_VerticalBarBG, //垂直滑动栏背景
        ScrollView_VerticalBar, //垂直滑动块
    }
    [Serializable]
    public class UGUIParseRule
    {
        public GUIType UIType;
        public string[] TypeMatches; //类型匹配标识
        public GameObject UIPrefab; //UI模板
        public string UIHelper; //UIHelper类型全名
        public string Comment;//注释
    }
    [CustomEditor(typeof(UGUIParser))]
    public class UGUIParserEditor : Editor
    {
        private SerializedProperty readmeProperty;
        SerializedProperty defaultTextType;
        SerializedProperty defaultImageType;
        private string[] textTypesDisplay;
        private int[] textTypes;
        private string[] imageTypesDisplay;
        private int[] imageTypes;
        private void OnEnable()
        {
            readmeProperty = serializedObject.FindProperty("readmeDoc");
            defaultTextType = serializedObject.FindProperty("defaultTextType");
            defaultImageType = serializedObject.FindProperty("defaultImageType");

            var textEnums = new GUIType[] { GUIType.Text, GUIType.TMPText };
            textTypes = new int[textEnums.Length];
            textTypesDisplay = new string[textEnums.Length];
            for (int i = 0; i < textEnums.Length; i++)
            {
                var textEnum = textEnums[i];
                textTypes[i] = (int)textEnum;
                textTypesDisplay[i] = textEnum.ToString();
            }

            var imageEnums = new GUIType[] { GUIType.Image, GUIType.RawImage };
            imageTypes = new int[imageEnums.Length];
            imageTypesDisplay = new string[imageEnums.Length];
            for (int i = 0; i < imageEnums.Length; i++)
            {
                var imageEnum = imageEnums[i];
                imageTypes[i] = (int)imageEnum;
                imageTypesDisplay[i] = imageEnum.ToString();
            }
        }
        public override void OnInspectorGUI()
        {
            serializedObject.Update();
            if (GUILayout.Button("使用教程"))
            {
                Application.OpenURL("https://blog.csdn.net/final5788");
            }
            if (GUILayout.Button("导出使用文档"))
            {
                (target as UGUIParser).ExportReadmeDoc();
            }
            EditorGUILayout.LabelField("使用说明:");
            readmeProperty.stringValue = EditorGUILayout.TextArea(readmeProperty.stringValue, GUILayout.Height(100));

            EditorGUILayout.BeginHorizontal();
            {
                EditorGUILayout.LabelField("默认文本类型:", GUILayout.Width(150));
                defaultTextType.enumValueIndex = EditorGUILayout.IntPopup(defaultTextType.enumValueIndex, textTypesDisplay, textTypes);
                EditorGUILayout.EndHorizontal();
            }
            EditorGUILayout.BeginHorizontal();
            {
                EditorGUILayout.LabelField("默认图片类型:", GUILayout.Width(150));
                defaultImageType.enumValueIndex = EditorGUILayout.IntPopup(defaultImageType.enumValueIndex, imageTypesDisplay, imageTypes);
                EditorGUILayout.EndHorizontal();
            }
            serializedObject.ApplyModifiedProperties();
            base.OnInspectorGUI();
        }
    }
    [CreateAssetMenu(fileName = "Psd2UIFormConfig", menuName = "ScriptableObject/Psd2UIForm Config【Psd2UIForm工具配置】")]
    public class UGUIParser : ScriptableObject
    {
        public const char UITYPE_SPLIT_CHAR = '.';
        public const int UITYPE_MAX = 100;
        [HideInInspector][SerializeField] GUIType defaultTextType = GUIType.Text;
        [HideInInspector][SerializeField] GUIType defaultImageType = GUIType.Image;
        [SerializeField] GameObject uiFormTemplate;
        [SerializeField] UGUIParseRule[] rules;
        [HideInInspector][SerializeField] string readmeDoc = "使用说明";

        public GUIType DefaultText => defaultTextType;
        public GUIType DefaultImage => defaultImageType;
        public GameObject UIFormTemplate => uiFormTemplate;
        private static UGUIParser mInstance = null;
        public static UGUIParser Instance
        {
            get
            {
                if (mInstance == null)
                {
                    var guid = AssetDatabase.FindAssets("t:UGUIParser").FirstOrDefault();
                    mInstance = AssetDatabase.LoadAssetAtPath<UGUIParser>(AssetDatabase.GUIDToAssetPath(guid));
                }
                return mInstance;
            }
        }
        public static bool IsMainUIType(GUIType tp)
        {
            return (int)tp <= UITYPE_MAX;
        }
        public Type GetHelperType(GUIType uiType)
        {
            if (uiType == GUIType.Null) return null;
            var rule = GetRule(uiType);
            if (rule == null || string.IsNullOrWhiteSpace(rule.UIHelper)) return null;

            return Type.GetType(rule.UIHelper);
        }
        public UGUIParseRule GetRule(GUIType uiType)
        {
            foreach (var rule in rules)
            {
                if (rule.UIType == uiType) return rule;
            }
            return null;
        }
        /// <summary>
        /// 根据图层命名解析UI类型
        /// </summary>
        /// <param name="layer"></param>
        /// <param name="comType"></param>
        /// <returns></returns>
        public bool TryParse(PsdLayerNode layer, out UGUIParseRule result)
        {
            result = null;
            var layerName = layer.BindPsdLayer.Name;
            if (HasUITypeFlag(layerName, out var tpFlag))
            {
                var tpTag = tpFlag.Substring(1);
                foreach (var rule in rules)
                {
                    foreach (var item in rule.TypeMatches)
                    {
                        if (tpTag.CompareTo(item.ToLower()) == 0)
                        {
                            result = rule;
                            return true;
                        }
                    }
                }
            }

            switch (layer.LayerType)
            {
                case PsdLayerType.TextLayer:
                    result = rules.First(itm => itm.UIType == defaultTextType);
                    break;
                case PsdLayerType.LayerGroup:
                    result = rules.First(itm => itm.UIType == GUIType.Null);
                    break;
                default:
                    result = rules.First(itm => itm.UIType == defaultImageType);
                    break;
            }
            return result != null;
        }
        public static bool HasUITypeFlag(string layerName, out string tpFlag)
        {
            tpFlag = null;
            if (string.IsNullOrWhiteSpace(layerName) || layerName.EndsWith(UGUIParser.UITYPE_SPLIT_CHAR)) return false;
            int startIdx = -1;
            for (int i = layerName.Length - 1; i >= 0; i--)
            {
                if (layerName[i] == UGUIParser.UITYPE_SPLIT_CHAR)
                {
                    startIdx = i;
                    break;
                }
            }
            if (startIdx <= 0) return false;

            tpFlag = layerName.Substring(startIdx);
            return true;
        }
        /// <summary>
        /// 根据图层大小和位置设置UI节点大小和位置
        /// </summary>
        /// <param name="layerNode"></param>
        /// <param name="uiNode"></param>
        /// <param name="pos">是否设置位置</param>
        public static void SetRectTransform(PsdLayerNode layerNode, UnityEngine.Component uiNode, bool pos = true, bool width = true, bool height = true, int extSize = 0)
        {
            if (uiNode != null && layerNode != null)
            {
                var rect = layerNode.LayerRect;
                var rectTransform = uiNode.GetComponent<RectTransform>();
                if (width) rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Horizontal, rect.size.x + extSize);
                if (height) rectTransform.SetSizeWithCurrentAnchors(RectTransform.Axis.Vertical, rect.size.y + extSize);
                if (pos)
                {
                    //rectTransform.position = rect.position + rectTransform.rect.size * (rectTransform.pivot - Vector2.one * 0.5f) * 0.01f;
                    rectTransform.SetPositionAndRotation(rect.position + rectTransform.rect.size * (rectTransform.pivot - Vector2.one * 0.5f) * 0.01f, Quaternion.identity);
                }
            }
        }

        /// <summary>
        /// 把LayerNode图片保存到本地并返回
        /// </summary>
        /// <param name="layerNode"></param>
        /// <returns></returns>
        public static Texture2D LayerNode2Texture(PsdLayerNode layerNode)
        {
            if (layerNode != null)
            {
                var spAssetName = layerNode.ExportImageAsset(false);
                var texture = AssetDatabase.LoadAssetAtPath<Texture2D>(spAssetName);
                return texture;
            }
            return null;
        }
        /// <summary>
        /// 把LayerNode图片保存到本地并返回
        /// </summary>
        /// <param name="layerNode"></param>
        /// <param name="auto9Slice">若没有设置Sprite的九宫,是否自动计算并设置九宫</param>
        /// <returns></returns>
        public static Sprite LayerNode2Sprite(PsdLayerNode layerNode, bool auto9Slice = false)
        {
            if (layerNode != null)
            {
                var spAssetName = layerNode.ExportImageAsset(true);
                var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(spAssetName);
                if (sprite != null)
                {
                    if (auto9Slice)
                    {
                        var spImpt = AssetImporter.GetAtPath(spAssetName) as TextureImporter;
                        var rawReadable = spImpt.isReadable;
                        if (!rawReadable)
                        {
                            spImpt.isReadable = true;
                            spImpt.SaveAndReimport();
                        }
                        if (spImpt.spriteBorder == Vector4.zero)
                        {
                            spImpt.spriteBorder = CalculateTexture9SliceBorder(sprite.texture, layerNode.BindPsdLayer.Opacity);
                            spImpt.isReadable = rawReadable;
                            spImpt.SaveAndReimport();
                        }
                    }
                    return sprite;
                }
            }
            return null;
        }
        /// <summary>
        /// 自动计算贴图的 9宫 Border
        /// </summary>
        /// <param name="texture"></param>
        /// <param name="alphaThreshold">0-255</param>
        /// <returns></returns>
        public static Vector4 CalculateTexture9SliceBorder(Texture2D texture, byte alphaThreshold = 3)
        {
            int width = texture.width;
            int height = texture.height;

            Color32[] pixels = texture.GetPixels32();
            int minX = width;
            int minY = height;
            int maxX = 0;
            int maxY = 0;

            // 寻找不透明像素的最小和最大边界
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    int pixelIndex = y * width + x;
                    Color32 pixel = pixels[pixelIndex];

                    if (pixel.a >= alphaThreshold)
                    {
                        minX = Mathf.Min(minX, x);
                        minY = Mathf.Min(minY, y);
                        maxX = Mathf.Max(maxX, x);
                        maxY = Mathf.Max(maxY, y);
                    }
                }
            }

            // 计算最优的borderSize
            int borderSizeX = (maxX - minX) / 3;
            int borderSizeY = (maxY - minY) / 3;
            int borderSize = Mathf.Min(borderSizeX, borderSizeY);

            // 根据边界和Border Size计算Nine Slice Border
            int left = minX + borderSize;
            int right = maxX - borderSize;
            int top = minY + borderSize;
            int bottom = maxY - borderSize;

            // 确保边界在纹理范围内
            left = Mathf.Clamp(left, 0, width - 1);
            right = Mathf.Clamp(right, 0, width - 1);
            top = Mathf.Clamp(top, 0, height - 1);
            bottom = Mathf.Clamp(bottom, 0, height - 1);

            return new Vector4(left, top, width - right, height - bottom);
        }

        /// <summary>
        /// 把PS的字体样式同步设置到UGUI Text
        /// </summary>
        /// <param name="txtLayer"></param>
        /// <param name="text"></param>
        public static void SetTextStyle(PsdLayerNode txtLayer, UnityEngine.UI.Text text)
        {
            if (text == null) return;
            text.gameObject.SetActive(txtLayer != null);
            if (txtLayer != null && txtLayer.ParseTextLayerInfo(out var str, out var size, out var charSpace, out float lineSpace, out var col, out var style, out var tmpStyle, out var fName))
            {
                var tFont = FindFontAsset(fName);
                if (tFont != null) text.font = tFont;
                text.text = str;
                text.fontSize = size;
                text.fontStyle = style;
                text.color = col;
                text.lineSpacing = lineSpace;
            }
        }
        /// <summary>
        /// 把PS的字体样式同步设置到TextMeshProUGUI
        /// </summary>
        /// <param name="txtLayer"></param>
        /// <param name="text"></param>
        public static void SetTextStyle(PsdLayerNode txtLayer, TextMeshProUGUI text)
        {
            if (txtLayer != null && txtLayer.ParseTextLayerInfo(out var str, out var size, out var charSpace, out float lineSpace, out var col, out var style, out var tmpStyle, out var fName))
            {
                var tFont = FindTMPFontAsset(fName);
                if (tFont != null) text.font = tFont;
                text.text = str;
                text.fontSize = size;
                text.fontStyle = tmpStyle;
                text.color = col;
                text.characterSpacing = charSpace;
                text.lineSpacing = lineSpace;
            }
        }
        /// <summary>
        /// Warning:Unity导入字库字体FamilyName的特殊字符会被替换为空格,导致按原本的字体名找不到字体
        /// 将字体名特殊字符替换为空格以解决找不到字体的问题
        /// </summary>
        /// <param name="fontName"></param>
        /// <returns></returns>
        public static string GetFixedFontName(string fontName)
        {
            string fixedFontName = Regex.Replace(fontName, "[^A-Za-z0-9]+", " ");
            return fixedFontName;
        }
        /// <summary>
        /// 根据字体名查找TMP_FontAsset
        /// </summary>
        /// <param name="fontName"></param>
        /// <returns></returns>
        public static TMP_FontAsset FindTMPFontAsset(string fontName)
        {
            string fixedFontName = GetFixedFontName(fontName);
            var fontGuids = AssetDatabase.FindAssets("t:TMP_FontAsset");
            foreach (var guid in fontGuids)
            {
                var fontPath = AssetDatabase.GUIDToAssetPath(guid);
                var font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(fontPath);
                if (font != null && (font.faceInfo.familyName == fontName || font.faceInfo.familyName == fixedFontName))
                {
                    return font;
                }
            }

            return null;
        }
        /// <summary>
        /// 根据字体名查找Font Asset
        /// </summary>
        /// <param name="fontName"></param>
        /// <returns></returns>
        public static UnityEngine.Font FindFontAsset(string fontName)
        {
            var fontNameLow = fontName.ToLower();
            string fixedFontName = GetFixedFontName(fontNameLow);
            var fontGuids = AssetDatabase.FindAssets("t:font");
            foreach (var guid in fontGuids)
            {
                var fontPath = AssetDatabase.GUIDToAssetPath(guid);
                var font = AssetImporter.GetAtPath(fontPath) as TrueTypeFontImporter;
                var assetFontNameLow = font.fontTTFName.ToLower();
                if (font != null && (assetFontNameLow.CompareTo(fontNameLow) == 0 || assetFontNameLow.CompareTo(fixedFontName) == 0))
                {
                    return AssetDatabase.LoadAssetAtPath<UnityEngine.Font>(fontPath);
                }
            }
            return null;
        }

        internal static UnityEngine.Color LayerNode2Color(PsdLayerNode fillColor, Color defaultColor)
        {
            if (fillColor != null && fillColor.BindPsdLayer is FillLayer fillLayer)
            {
                var layerColor = fillLayer.GetPixel(fillLayer.Width / 2, fillLayer.Height / 2);
                return new UnityEngine.Color(layerColor.R, layerColor.G, layerColor.B, fillLayer.Opacity) / (float)255;
            }
            return defaultColor;
        }
        /// <summary>
        /// 导出UI设计师使用规则文档
        /// </summary>
        /// <exception cref="NotImplementedException"></exception>
        internal void ExportReadmeDoc()
        {
            var exportDir = EditorUtility.SaveFolderPanel("选择文档导出路径", Application.dataPath, null);
            if (string.IsNullOrWhiteSpace(exportDir) || !Directory.Exists(exportDir))
            {
                return;
            }

            var docFile = Path.Combine(exportDir, "Psd2UGUI设计师使用文档.doc");
            var strBuilder = new StringBuilder();
            strBuilder.AppendLine("使用说明:");
            strBuilder.AppendLine(this.readmeDoc);
            strBuilder.AppendLine(Environment.NewLine + Environment.NewLine);
            strBuilder.AppendLine("UI类型标识: 图层/组命名以'.类型'结尾");
            strBuilder.AppendLine("UI类型标识列表:");

            foreach (var rule in rules)
            {
                if (rule.UIType == GUIType.Null) continue;

                strBuilder.AppendLine($"{rule.UIType}: {rule.Comment}");
                strBuilder.Append("类型标识: ");
                foreach (var tag in rule.TypeMatches)
                {
                    strBuilder.Append($".{tag}, ");
                }
                strBuilder.AppendLine();
                strBuilder.AppendLine();
            }

            try
            {
                File.WriteAllText(docFile, strBuilder.ToString(), System.Text.Encoding.UTF8);
                EditorUtility.RevealInFinder(docFile);
            }
            catch (Exception e)
            {
                Debug.LogException(e);
            }

        }
    }
}
#endif