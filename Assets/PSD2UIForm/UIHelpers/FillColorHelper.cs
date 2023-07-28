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
    public class FillColorHelper : UIHelperBase
    {
        [SerializeField] PsdLayerNode fillColor;

        public override PsdLayerNode[] GetDependencies()
        {
            return CalculateDependencies(fillColor);
        }

        public override void ParseAndAttachUIElements()
        {
            if (LayerNode.LayerType != PsdLayerType.FillLayer)
            {
                LayerNode.SetUIType(UGUIParser.Instance.DefaultImage);
                return;
            }
            fillColor = LayerNode;
        }

        protected override void InitUIElements(GameObject uiRoot)
        {
            var imgCom = uiRoot.GetComponentInChildren<UnityEngine.UI.RawImage>();
            UGUIParser.SetRectTransform(fillColor, imgCom);
            imgCom.color = UGUIParser.LayerNode2Color(fillColor, imgCom.color);
        }
    }
}
#endif