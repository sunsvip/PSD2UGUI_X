/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using UnityEngine;

namespace UGF.EditorTools.Psd2UGUI
{
    [DisallowMultipleComponent]
    public class ImageHelper : UIHelperBase
    {
        [SerializeField] PsdLayerNode image;

        public override PsdLayerNode[] GetDependencies()
        {
            return CalculateDependencies(image);
        }

        public override void ParseAndAttachUIElements()
        {
            image = LayerNode;
        }

        protected override void InitUIElements(GameObject uiRoot)
        {
            var imgCom = uiRoot.GetComponentInChildren<UnityEngine.UI.Image>();
            UGUIParser.SetRectTransform(image,imgCom);
            imgCom.sprite = UGUIParser.LayerNode2Sprite(image, imgCom.type == UnityEngine.UI.Image.Type.Sliced);
        }
    }
}
#endif