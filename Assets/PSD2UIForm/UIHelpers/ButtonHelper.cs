/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using Aspose.PSD.FileFormats.Psd.Layers.FillLayers;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace UGF.EditorTools.Psd2UGUI
{
    [DisallowMultipleComponent]
    public class ButtonHelper : UIHelperBase
    {
        [SerializeField] PsdLayerNode background = null;
        [SerializeField] PsdLayerNode text = null;
        [Header("Sprite Swap:")]
        [SerializeField] PsdLayerNode highlight = null;
        [SerializeField] PsdLayerNode press = null;
        [SerializeField] PsdLayerNode select = null;
        [SerializeField] PsdLayerNode disable = null;

        public override PsdLayerNode[] GetDependencies()
        {
            return CalculateDependencies(background, text, highlight, press, select, disable);
        }

        public override void ParseAndAttachUIElements()
        {
            if (LayerNode.LayerType == PsdLayerType.LayerGroup)
            {
                background = LayerNode.FindSubLayerNode(GUIType.Background, GUIType.Image, GUIType.RawImage);
                text = LayerNode.FindSubLayerNode(GUIType.Button_Text, GUIType.Text, GUIType.TMPText);
                highlight = LayerNode.FindSubLayerNode(GUIType.Button_Highlight);
                press = LayerNode.FindSubLayerNode(GUIType.Button_Press);
                select = LayerNode.FindSubLayerNode(GUIType.Button_Select);
                disable = LayerNode.FindSubLayerNode(GUIType.Button_Disable);
            }
            else
            {
                background = LayerNode;
            }
        }

        protected override void InitUIElements(GameObject uiRoot)
        {
            var button = uiRoot.GetComponent<Button>();
            var btImg = button.GetComponent<Image>();
            bool useSliceSp = btImg.type == Image.Type.Sliced;
            btImg.sprite = UGUIParser.LayerNode2Sprite(background, useSliceSp);
            UGUIParser.SetRectTransform(background, button);
            var btText = uiRoot.GetComponentInChildren<Text>();
            UGUIParser.SetTextStyle(text, btText);
            UGUIParser.SetRectTransform(text, btText);
            bool useSpriteSwap = highlight != null || press != null || select != null || disable != null;
            button.transition = useSpriteSwap ? Selectable.Transition.SpriteSwap : Selectable.Transition.ColorTint;
            if (button.transition == Selectable.Transition.SpriteSwap)
            {
                var spState = new SpriteState();
                spState.highlightedSprite = UGUIParser.LayerNode2Sprite(highlight, useSliceSp);
                spState.pressedSprite = UGUIParser.LayerNode2Sprite(press, useSliceSp);
                spState.selectedSprite = UGUIParser.LayerNode2Sprite(select, useSliceSp);
                spState.disabledSprite = UGUIParser.LayerNode2Sprite(disable, useSliceSp);
                button.spriteState = spState;
            }
        }
    }
}
#endif