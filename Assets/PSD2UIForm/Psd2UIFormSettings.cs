/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR

namespace UGF.EditorTools.Psd2UGUI
{
    [FilePath("ProjectSettings/Psd2UIFormSettings.asset")]
    public class Psd2UIFormSettings : ScriptableSingleton<Psd2UIFormSettings>
    {
        /// <summary>
        /// UI图片导出根目录
        /// </summary>
        public string UIImagesOutputDir;
        /// <summary>
        /// UI预制体静默导出目录
        /// </summary>
        public string UIFormOutputDir = "Assets";
        /// <summary>
        /// 使用静默导出路径(点击导出UIForm后不弹出路径选择)
        /// </summary>
        public bool UseUIFormOutputDir = true;
        /// <summary>
        /// 导出图片后自动压缩图片文件
        /// </summary>
        //public bool CompressImage = false;

        public string LastUIFormOutputDir = "Assets";
    }
}
#endif