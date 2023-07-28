/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using UnityEngine;
using UnityEngine.UI;

namespace UGF.EditorTools.Psd2UGUI
{
    [DisallowMultipleComponent]
    public class ScrollViewHelper : UIHelperBase
    {
        [SerializeField] PsdLayerNode background;
        [SerializeField] PsdLayerNode viewport;
        [SerializeField] PsdLayerNode horizontalBarBG;
        [SerializeField] PsdLayerNode horizontalBar;
        [SerializeField] PsdLayerNode verticalBarBG;
        [SerializeField] PsdLayerNode verticalBar;

        public override PsdLayerNode[] GetDependencies()
        {
            return CalculateDependencies(background, viewport, horizontalBarBG, horizontalBar, verticalBarBG, verticalBar);
        }

        public override void ParseAndAttachUIElements()
        {
            background = LayerNode.FindSubLayerNode(GUIType.Background, GUIType.Image, GUIType.RawImage);
            viewport = LayerNode.FindSubLayerNode(GUIType.ScrollView_Viewport, GUIType.Mask);
            horizontalBarBG = LayerNode.FindSubLayerNode(GUIType.ScrollView_HorizontalBarBG);
            horizontalBar = LayerNode.FindSubLayerNode(GUIType.ScrollView_HorizontalBar);
            verticalBarBG = LayerNode.FindSubLayerNode(GUIType.ScrollView_VerticalBarBG);
            verticalBar = LayerNode.FindSubLayerNode(GUIType.ScrollView_VerticalBar);
        }

        protected override void InitUIElements(GameObject uiRoot)
        {
            var listView = uiRoot.GetComponent<ScrollRect>();
            UGUIParser.SetRectTransform(background, listView);
            var bgCom = listView.GetComponent<Image>();
            if (bgCom != null)
            {
                bgCom.sprite = UGUIParser.LayerNode2Sprite(background, bgCom.type == UnityEngine.UI.Image.Type.Sliced);
                if(viewport == null)
                {
                    var maskImg = listView.viewport.GetComponent<Image>();
                    maskImg.sprite = bgCom.sprite;
                }
            }
            if (viewport != null)
            {
                var maskImg = listView.viewport.GetComponent<Image>();
                maskImg.sprite = UGUIParser.LayerNode2Sprite(viewport, maskImg.type == Image.Type.Sliced);
            }

            var hbar = listView.horizontalScrollbar;
            var vbar = listView.verticalScrollbar;
            
            if (horizontalBarBG != null && hbar != null)
            {
                var hbarBg = hbar.GetComponent<Image>();
                hbarBg.sprite = UGUIParser.LayerNode2Sprite(horizontalBarBG, hbarBg.type == Image.Type.Sliced);
                UGUIParser.SetRectTransform(horizontalBarBG, hbarBg, false, false, true);
                var hbarRect = hbar.GetComponent<RectTransform>();
                hbarRect.anchorMin = new Vector2(1,0);
                hbarRect.anchorMax = Vector2.one;
            }
            else
            {
                var hbarGo = listView.horizontalScrollbar;
                listView.horizontalScrollbar = null;
                if (hbarGo != null)
                {
                    hbarGo.gameObject.SetActive(false);
                }
            }
            if (verticalBarBG != null && vbar != null)
            {
                var vbarBg = vbar.GetComponent<Image>();
                vbarBg.sprite = UGUIParser.LayerNode2Sprite(verticalBarBG, vbarBg.type == Image.Type.Sliced);
                UGUIParser.SetRectTransform(verticalBarBG, vbarBg, false, true, false);
                var vbarRect = vbar.GetComponent<RectTransform>();
                vbarRect.anchorMin = new Vector2(1,0);
                vbarRect.anchorMax = Vector2.one;
            }
            else
            {
                var vbarGo = listView.verticalScrollbar;
                listView.verticalScrollbar = null;
                if (vbarGo != null)
                {
                    vbarGo.gameObject.SetActive(false);
                }
            }

            if (horizontalBar != null && hbar != null)
            {
                var hbarHandle = hbar.targetGraphic as Image;
                hbarHandle.sprite = UGUIParser.LayerNode2Sprite(horizontalBar, hbarHandle.type == Image.Type.Sliced);
                //UGUIParser.SetRectTransform(horizontalBar, hbarHandle, false, true, true);
            }
            if (verticalBar != null && vbar != null)
            {
                var vbarHandle = vbar.targetGraphic as Image;
                vbarHandle.sprite = UGUIParser.LayerNode2Sprite(verticalBar, vbarHandle.type == Image.Type.Sliced);
                //UGUIParser.SetRectTransform(verticalBar, vbarHandle, false, true, true);
            }
        }
    }
}
#endif