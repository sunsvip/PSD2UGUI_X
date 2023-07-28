/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using Aspose.PSD;
using Aspose.PSD.FileFormats.Psd;
using Aspose.PSD.FileFormats.Psd.Layers;
using Aspose.PSD.FileFormats.Psd.Layers.SmartObjects;
using Aspose.PSD.ImageOptions;
using UnityEngine;

namespace UGF.EditorTools.Psd2UGUI
{
    public static class AsposePsdExtension
    {
        /// <summary>
        /// 把图层的Opacity透明度合并到像素透明度
        /// </summary>
        /// <param name="layer"></param>
        public static void MergeLayerOpacity(this Layer layer)
        {
            if (layer.Opacity >= 255) return;
            var pixelData = layer.LoadArgb32Pixels(layer.Bounds);

            // 遍历图层的像素，并将透明度与图层的透明度合并
            for (int i = 0; i < pixelData.Length; i++)
            {
                var alpha = (byte)(pixelData[i] >> 24); // 获取当前像素的透明度
                var mergedAlpha = (byte)((alpha * layer.Opacity) / 255); // 合并透明度

                // 更新像素的透明度
                pixelData[i] = (pixelData[i] & 0x00FFFFFF) | (mergedAlpha << 24);
            }

            // 更新图层的像素数据
            layer.SaveArgb32Pixels(layer.Bounds, pixelData);
        }
        /// <summary>
        /// 获取被SmartObjectLayer包裹的Text图层,用于解决Aspose暂不支持栅格化图层特效的问题
        /// </summary>
        /// <param name="smartLayer"></param>
        /// <returns></returns>
        public static Layer GetSmartObjectInnerTextLayer(this SmartObjectLayer smartLayer)
        {
            var rawLayer = smartLayer?.LoadContents(null) as PsdImage;
            if (rawLayer != null && rawLayer.Layers.Length == 1)
            {
                var innerLayer = rawLayer.Layers[0];
                if (innerLayer != null && innerLayer.GetLayerType() == PsdLayerType.TextLayer)
                    return innerLayer;
            }
            return null;
        }
        /// <summary>
        /// 获取psd图层类型枚举
        /// </summary>
        /// <param name="layer"></param>
        /// <returns></returns>
        public static PsdLayerType GetLayerType(this Layer layer)
        {
            if (System.Enum.TryParse<PsdLayerType>(layer.GetType().Name, out var tp))
            {
                //TODO 对Aspose.PSD暂时不支持图层特效的妥协处理
                if (tp == PsdLayerType.SmartObjectLayer)
                {
                    var innerLayer = (layer as SmartObjectLayer).GetSmartObjectInnerTextLayer();
                    if (innerLayer != null) return PsdLayerType.TextLayer;
                }
                //END
                return tp;
            }
            else
            {
                Debug.LogWarning($"解析图层类型失败:{layer.GetType().Name}");
                return PsdLayerType.Layer;
            }
        }
        /// <summary>
        /// 获取psd图层的Rect边框(Unity坐标系)
        /// </summary>
        /// <param name="layer"></param>
        /// <returns></returns>
        public static Rect GetLayerRect(this Layer layer)
        {
            RectangleF psdRect = new RectangleF();

            //var layerTp = layer.GetLayerType();
            //if (layerTp == PsdLayerType.LayerGroup)
            //{
            //    psdRect = layer.GetFixedLayerBounds();
            //}
            //else
            {
                psdRect.Left = layer.Left;
                psdRect.Right = layer.Right;
                psdRect.Top = layer.Top;
                psdRect.Bottom = layer.Bottom;
            }

            var canvasSize = new Vector2Int(layer.Container.Size.Width, layer.Container.Size.Height);
            return PsdRect2UnityRect(psdRect, canvasSize);
        }
        public static Rect PsdRect2UnityRect(Rectangle psdRect, Vector2Int canvasSize)
        {
            return PsdRect2UnityRect(new RectangleF(psdRect.X, psdRect.Y, psdRect.Width, psdRect.Height), canvasSize);
        }
        public static Rect PsdRect2UnityRect(RectangleF psdRect, Vector2Int canvasSize)
        {
            float halfWidth = Mathf.Abs(psdRect.Right - psdRect.Left) * 0.5f;
            float halfHeight = Mathf.Abs(psdRect.Bottom - psdRect.Top) * 0.5f;
            Rect result = new Rect(psdRect.Left + halfWidth - canvasSize.x * 0.5f, canvasSize.y - (psdRect.Top + halfHeight) - canvasSize.y * 0.5f, psdRect.Right - psdRect.Left, psdRect.Bottom - psdRect.Top);
            return result;
        }
        /// <summary>
        /// 修复当LayerGroup为第一层时,对应Bounds错位
        /// </summary>
        /// <param name="layerGroup"></param>
        /// <returns></returns>
        public static Rectangle GetFixedLayerBounds(this Layer layerGroup)
        {
            if (layerGroup.GetLayerType() != PsdLayerType.LayerGroup)
            {
                return layerGroup.Bounds;
            }
            //根据子图层算出包围所有子图层的最小包围盒
            var subLayers = (layerGroup as LayerGroup).Layers;
            int minLeft = int.MaxValue;
            int minTop = int.MaxValue;
            int maxRight = int.MinValue;
            int maxBottom = int.MinValue;
            foreach (var item in subLayers)
            {
                var itemTp = item.GetLayerType();
                if (itemTp == PsdLayerType.Unknown || itemTp == PsdLayerType.LayerGroup || itemTp == PsdLayerType.SectionDividerLayer) continue;
                var itemBounds = item.Bounds;
                if (item.Left < minLeft) minLeft = item.Left;
                if (item.Top < minTop) minTop = item.Top;
                if (item.Right > maxRight) maxRight = item.Right;
                if (item.Bottom > maxBottom) maxBottom = item.Bottom;
            }
            //var result = new Rectangle(new Point(minLeft, minTop), new Size(maxRight - minLeft, maxBottom - minTop));
            var result = new Rectangle()
            {
                Top = minTop,
                Left = minLeft,
                Right = maxRight,
                Bottom = maxBottom
            };
            return result;
        }
    }
}
#endif