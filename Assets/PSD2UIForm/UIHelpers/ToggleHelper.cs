/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace UGF.EditorTools.Psd2UGUI
{
    [DisallowMultipleComponent]
    public class ToggleHelper : UIHelperBase
    {
        [SerializeField] PsdLayerNode background;
        [SerializeField] PsdLayerNode checkmark;
        [SerializeField] PsdLayerNode label;

        public override PsdLayerNode[] GetDependencies()
        {
            return CalculateDependencies(background, checkmark, label);
        }

        public override void ParseAndAttachUIElements()
        {
            background = LayerNode.FindSubLayerNode(GUIType.Background, GUIType.Image, GUIType.RawImage);
            checkmark = LayerNode.FindSubLayerNode(GUIType.Toggle_Checkmark);
            label = LayerNode.FindSubLayerNode(GUIType.Toggle_Label, GUIType.Text, GUIType.TMPText);
        }

        protected override void InitUIElements(GameObject uiRoot)
        {
            var tgCom = uiRoot.GetComponent<UnityEngine.UI.Toggle>();
            UGUIParser.SetRectTransform(LayerNode, tgCom);

            var bgCom = tgCom.targetGraphic as UnityEngine.UI.Image;
            if (bgCom != null)
            {
                bgCom.sprite = UGUIParser.LayerNode2Sprite(background, bgCom.type == UnityEngine.UI.Image.Type.Sliced);
                UGUIParser.SetRectTransform(background, bgCom);
            }

            var markCom = tgCom.graphic as UnityEngine.UI.Image;
            if (markCom != null)
            {
                markCom.sprite = UGUIParser.LayerNode2Sprite(checkmark, markCom.type == UnityEngine.UI.Image.Type.Sliced);
                UGUIParser.SetRectTransform(checkmark, markCom);
            }

            var textCom = tgCom.transform.Find("Label")?.GetComponent<UnityEngine.UI.Text>();
            if (textCom != null)
            {
                textCom.gameObject.SetActive(label != null);
            }
            UGUIParser.SetTextStyle(label, textCom);
            UGUIParser.SetRectTransform(label, textCom);
        }
    }
}
#endif