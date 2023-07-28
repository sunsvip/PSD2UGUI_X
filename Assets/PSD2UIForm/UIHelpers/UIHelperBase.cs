/*
    联系作者:
    https://blog.csdn.net/final5788
    https://github.com/sunsvip
 */
#if UNITY_EDITOR
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace UGF.EditorTools.Psd2UGUI
{
    public abstract class UIHelperBase : MonoBehaviour
    {
        public PsdLayerNode LayerNode => this.GetComponent<PsdLayerNode>();
        private void OnEnable()
        {
            ParseAndAttachUIElements();
        }
        /// <summary>
        /// 解析并关联UI元素,并且返回已经关联过的图层(已关联图层不再处理)
        /// </summary>
        /// <param name="layerNode"></param>
        /// <returns></returns>
        public abstract void ParseAndAttachUIElements();

        /// <summary>
        /// 获取UI依赖的LayerNodes
        /// </summary>
        /// <returns></returns>
        public abstract PsdLayerNode[] GetDependencies();
        /// <summary>
        /// 把UI实例进行UI元素初始化
        /// </summary>
        /// <param name="uiRoot"></param>
        protected abstract void InitUIElements(GameObject uiRoot);
        /// <summary>
        /// 筛选出UI依赖的非空LayerNode
        /// </summary>
        /// <param name="nodes"></param>
        /// <returns></returns>
        protected PsdLayerNode[] CalculateDependencies(params PsdLayerNode[] nodes)
        {
            if (nodes == null || nodes.Length == 0) return null;

            for (int i = nodes.Length - 1; i >= 0; i--)
            {
                var node = nodes[i];
                if (node == null || node == LayerNode) ArrayUtility.RemoveAt(ref nodes, i);
            }
            return nodes;
        }
        internal GameObject CreateUI(GameObject uiInstance = null)
        {
            if (!this.LayerNode.IsMainUIType || LayerNode.UIType == GUIType.Null) return null;

            if (uiInstance == null)
            {
                var rule = UGUIParser.Instance.GetRule(this.LayerNode.UIType);
                if (rule == null || rule.UIPrefab == null)
                {
                    Debug.LogWarning($"创建UI类型{LayerNode.UIType}失败:Rule配置项不存在或UIPrefab为空");
                    return null;
                }
                uiInstance = GameObject.Instantiate(rule.UIPrefab, Vector3.zero, Quaternion.identity);
                if (LayerNode.IsMainUIType)
                {
                    uiInstance.name = this.name;
                    var key = uiInstance.GetComponent<UIStringKey>() ?? uiInstance.AddComponent<UIStringKey>();
                    key.Key = this.gameObject.GetInstanceID().ToString();
                }
            }
            
            InitUIElements(uiInstance);
            return uiInstance;
        }

    }
}
#endif
