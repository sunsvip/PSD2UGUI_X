/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using UnityEngine;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.ImageOptions;
using UnityEditor;
using System.IO;
using System.Linq;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers.SmartObjects;

namespace UGF.EditorTools.Psd2UGUI
{
    [CanEditMultipleObjects]
    [CustomEditor(typeof(PsdLayerNode))]
    public class PsdLayerNodeInspector : Editor
    {
        PsdLayerNode targetLogic;
        private void OnEnable()
        {
            targetLogic = target as PsdLayerNode;
            targetLogic.RefreshLayerTexture();
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();
            base.OnInspectorGUI();
            EditorGUI.BeginChangeCheck();
            {
                targetLogic.UIType = (GUIType)EditorGUILayout.EnumPopup("UI Type", targetLogic.UIType);
                if (EditorGUI.EndChangeCheck())
                {
                    targetLogic.SetUIType(targetLogic.UIType);
                }
            }
            EditorGUILayout.BeginHorizontal();
            {
                if (GUILayout.Button("导出图片"))
                {
                    foreach (var item in targets)
                    {
                        if (item == null) continue;

                        (item as PsdLayerNode)?.ExportImageAsset();
                    }
                }
                EditorGUILayout.EndHorizontal();
            }
            serializedObject.ApplyModifiedProperties();
        }

        public override bool HasPreviewGUI()
        {
            var layerNode = (target as PsdLayerNode);
            return layerNode != null && layerNode.PreviewTexture != null;
        }

        public override void OnPreviewGUI(Rect r, GUIStyle background)
        {
            var layerNode = (target as PsdLayerNode);
            GUI.DrawTexture(r, layerNode.PreviewTexture, ScaleMode.ScaleToFit);
            //base.OnPreviewGUI(r, background);
        }
        public override string GetInfoString()
        {
            var layerNode = (target as PsdLayerNode);
            return layerNode.LayerInfo;
        }
    }
    [ExecuteInEditMode]
    [DisallowMultipleComponent]
    public class PsdLayerNode : MonoBehaviour
    {
        [ReadOnlyField] public int BindPsdLayerIndex = -1;
        [ReadOnlyField][SerializeField] PsdLayerType mLayerType = PsdLayerType.Unknown;
        [SerializeField] public bool markToExport;
        [HideInInspector] public GUIType UIType;
        public Texture2D PreviewTexture { get; private set; }
        public string LayerInfo { get; private set; }
        public Rect LayerRect { get; private set; }
        public PsdLayerType LayerType { get => mLayerType; }
        public bool IsMainUIType => UGUIParser.IsMainUIType(UIType);
        /// <summary>
        /// 绑定的psd图层
        /// </summary>
        private Layer mBindPsdLayer;

        public Layer BindPsdLayer
        {
            get => mBindPsdLayer;
            set
            {
                mBindPsdLayer = value;
                mLayerType = mBindPsdLayer.GetLayerType();
                LayerRect = mBindPsdLayer.GetLayerRect();
                LayerInfo = $"{LayerRect}";
            }
        }
        private void OnDestroy()
        {
            if (PreviewTexture != null)
            {
                DestroyImmediate(PreviewTexture);
            }
        }
        public void SetUIType(GUIType uiType, bool triggerParseFunc = true)
        {
            this.UIType = uiType;
            RemoveUIHelper();

            if (triggerParseFunc)
            {
                RefreshUIHelper(true);
            }
        }
        public void RefreshUIHelper(bool refreshParent = false)
        {
            if (UIType == GUIType.Null) return;

            var uiHelperTp = UGUIParser.Instance.GetHelperType(UIType);
            if (uiHelperTp != null)
            {
                var helper = (gameObject.GetComponent(uiHelperTp) ?? gameObject.AddComponent(uiHelperTp)) as UIHelperBase;
                helper.ParseAndAttachUIElements();
            }
            if (refreshParent)
            {
                var parentHelper = transform.parent?.GetComponent<UIHelperBase>();
                parentHelper?.ParseAndAttachUIElements();
            }
            EditorUtility.SetDirty(this);
        }
        private void RemoveUIHelper()
        {
            var uiHelpers = this.GetComponents<UIHelperBase>();
            if (uiHelpers != null)
            {
                foreach (var uiHelper in uiHelpers)
                {
                    DestroyImmediate(uiHelper);
                }
            }
            EditorUtility.SetDirty(this);
        }
        /// <summary>
        /// 是否需要导出此图层
        /// </summary>
        /// <returns></returns>
        public bool NeedExportImage()
        {
            return gameObject.activeSelf && markToExport;
        }
        /// <summary>
        /// 导出图片
        /// </summary>
        /// <param name="forceSpriteType">强制贴图类型为Sprite</param>
        /// <returns></returns>
        public string ExportImageAsset(bool forceSpriteType = false)
        {
            string assetName = null;
            if (this.RefreshLayerTexture())
            {
                var bytes = PreviewTexture.EncodeToPNG();
                var imgName = string.Format("{0}_{1}", string.IsNullOrWhiteSpace(name) ? UIType.ToString() : name, BindPsdLayerIndex);
                var exportDir = Psd2UIFormConverter.Instance.GetUIFormImagesOutputDir();
                if (!Directory.Exists(exportDir))
                {
                    try
                    {
                        Directory.CreateDirectory(exportDir);
                        AssetDatabase.Refresh();
                    }
                    catch (System.Exception)
                    {
                        return null;
                    }
                }
                var imgFileName = Path.Combine(exportDir, imgName + ".png");
                File.WriteAllBytes(imgFileName, bytes);
                //if (Psd2UIFormSettings.Instance.CompressImage)
                //{
                //    bool compressResult = Psd2UIFormConverter.CompressImageFile(imgFileName);
                //    if (compressResult)
                //    {
                //        Debug.Log($"成功压缩图片:{imgFileName}");
                //    }
                //    else
                //    {
                //        Debug.LogWarning($"压缩图片失败:{imgFileName}");
                //    }
                //}
                assetName = imgFileName;
                bool isImage = !(this.UIType == GUIType.FillColor || this.UIType == GUIType.RawImage);
                AssetDatabase.Refresh();
                Psd2UIFormConverter.ConvertTexturesType(new string[] { imgFileName }, isImage || forceSpriteType);
            }

            return assetName;
        }
        public bool RefreshLayerTexture(bool forceRefresh = false)
        {
            if (!forceRefresh && PreviewTexture != null)
            {
                return true;
            }

            if (BindPsdLayer == null || BindPsdLayer.Disposed) return false;

            var pngOpt = new PngOptions
            {
                ColorType = Aspose.PSD.FileFormats.Png.PngColorType.TruecolorWithAlpha
            };
            if (BindPsdLayer.CanSave(pngOpt))
            {
                if (PreviewTexture != null)
                {
                    DestroyImmediate(PreviewTexture);
                }
                PreviewTexture = this.ConvertPsdLayer2Texture2D();
            }
            return PreviewTexture != null;
        }

        /// <summary>
        /// 把psd图层转成Texture2D
        /// </summary>
        /// <param name="psdLayer"></param>
        /// <returns>Texture2D</returns>
        public Texture2D ConvertPsdLayer2Texture2D()
        {
            if (BindPsdLayer == null || BindPsdLayer.Disposed) return null;

            MemoryStream ms = new MemoryStream();
            var pngOpt = new Aspose.PSD.ImageOptions.PngOptions()
            {
                ColorType = Aspose.PSD.FileFormats.Png.PngColorType.TruecolorWithAlpha,
                FullFrame = true
            };
            //var smartLayer = Psd2UIFormConverter.Instance.ConvertToSmartObjectLayer(BindPsdLayer);
            //smartLayer.Save(ms, pngOpt);
            BindPsdLayer.MergeLayerOpacity();
            BindPsdLayer.Save(ms, pngOpt);

            //var bitmap = BindPsdLayer.ToBitmap();
            //bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);

            var buffer = new byte[ms.Length];
            ms.Position = 0;
            ms.Read(buffer, 0, buffer.Length);

            Texture2D texture = new Texture2D(BindPsdLayer.Width, BindPsdLayer.Height);
            texture.alphaIsTransparency = true;
            texture.LoadImage(buffer);
            texture.Apply();
            ms.Dispose();
            return texture;
        }

        /// <summary>
        /// 从第一层子节点按类型查找LayerNode
        /// </summary>
        /// <param name="uiTp"></param>
        /// <returns></returns>
        public PsdLayerNode FindSubLayerNode(GUIType uiTp)
        {
            for (int i = 0; i < transform.childCount; i++)
            {
                var child = transform.GetChild(i)?.GetComponent<PsdLayerNode>();

                if (child != null && child.UIType == uiTp) return child;
            }
            return null;
        }
        /// <summary>
        /// 依次查找给定多个类型,返回最先找到的类型
        /// </summary>
        /// <param name="uiTps"></param>
        /// <returns></returns>
        public PsdLayerNode FindSubLayerNode(params GUIType[] uiTps)
        {
            foreach (var tp in uiTps)
            {
                var result = FindSubLayerNode(tp);
                if (result != null) return result;
            }
            return null;
        }
        public PsdLayerNode FindLayerNodeInChildren(GUIType uiTp)
        {
            var layers = GetComponentsInChildren<PsdLayerNode>(true);
            if (layers != null && layers.Length > 0)
            {
                return layers.FirstOrDefault(layer => layer.UIType == uiTp);
            }
            return null;
        }

        /// <summary>
        /// 判断该图层是否为文本图层
        /// </summary>
        /// <param name="layer"></param>
        /// <returns></returns>
        public bool IsTextLayer(out TextLayer layer)
        {
            layer = null;
            if (BindPsdLayer == null) return false;

            if (BindPsdLayer is SmartObjectLayer smartLayer)
            {
                layer = smartLayer.GetSmartObjectInnerTextLayer() as TextLayer;
                return layer != null;
            }
            else if (BindPsdLayer is TextLayer txtLayer)
            {
                layer = txtLayer;
                return layer != null;
            }
            return false;
        }
        internal void InitPsdLayers(PsdImage psdInstance)
        {
            var layers = psdInstance.Layers;
            if (BindPsdLayerIndex >= 0 && BindPsdLayerIndex < layers.Length)
            {
                BindPsdLayer = psdInstance.Layers[BindPsdLayerIndex];
            }
        }
        internal bool ParseTextLayerInfo(out string text, out int fontSize, out float characterSpace, out float lineSpace, out Color fontColor, out UnityEngine.FontStyle fontStyle, out TMPro.FontStyles tmpFontStyle, out string fontName)
        {
            text = null; fontSize = 0; characterSpace = 0f; lineSpace = 0f; fontColor = Color.white; fontStyle = FontStyle.Normal; tmpFontStyle = TMPro.FontStyles.Normal; fontName = null;
            if (IsTextLayer(out var txtLayer))
            {
                text = txtLayer.Text;
                fontSize = (int)(txtLayer.Font.Size * txtLayer.TransformMatrix[3]);
                fontColor = new Color(txtLayer.TextColor.R, txtLayer.TextColor.G, txtLayer.TextColor.B, txtLayer.Opacity) / (float)255;
                if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Bold) && txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Italic))
                {
                    fontStyle = UnityEngine.FontStyle.BoldAndItalic;
                }
                else if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Bold))
                {
                    fontStyle = UnityEngine.FontStyle.Bold;

                }
                else if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Italic))
                {
                    fontStyle = UnityEngine.FontStyle.Italic;
                }
                else
                {
                    fontStyle = UnityEngine.FontStyle.Normal;
                }

                if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Italic))
                {
                    tmpFontStyle |= TMPro.FontStyles.Italic;
                }
                if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Bold))
                {
                    tmpFontStyle |= TMPro.FontStyles.Bold;
                }
                if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Underline))
                {
                    tmpFontStyle |= TMPro.FontStyles.Underline;
                }
                if (txtLayer.Font.Style.HasFlag(Aspose.PSD.FontStyle.Strikeout))
                {
                    tmpFontStyle |= TMPro.FontStyles.Strikethrough;
                }
                fontName = txtLayer.Font.Name;
                if (txtLayer.TextData.Items.Length > 0)
                {
                    var txtData = txtLayer.TextData.Items[0];
                    characterSpace = txtData.Style.Tracking * 0.1f;
                    lineSpace = (float)txtData.Style.Leading * 0.1f;
                }
                return true;
            }
            return false;
        }
    }
}

#endif