/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
namespace UGF.EditorTools.Psd2UGUI
{
    public enum PsdLayerType
    {
        Unknown = 0,
        Layer,
        BlackWhiteAdjustmentLayer,
        BrightnessContrastLayer,
        CmykChannelMixerLayer,
        ColorBalanceAdjustmentLayer,
        CurvesLayer,
        ExposureLayer,
        HueSaturationLayer,
        InvertAdjustmentLayer,
        LevelsLayer,
        PhotoFilterLayer,
        PosterizeLayer,
        RgbChannelMixerLayer,
        SelectiveColorLayer,
        ThresholdLayer,
        VibranceLayer,
        FillLayer,
        LayerGroup,
        SectionDividerLayer,
        ShapeLayer,
        SmartObjectLayer,
        TextLayer
    }
}
#endif