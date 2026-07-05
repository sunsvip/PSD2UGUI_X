# PSD2UIForm AI 识别：Owner-First 语义图

你必须在**同一次会话**里完成两个内部阶段，但最终只能输出**一个合法 JSON 对象**：

1. `Phase A`: 识别主控件 `owners`
2. `Phase B`: 在 owner 主控件已确定的前提下识别子控件 `roles`，并补全所有原始节点的 `nodeLabels`

禁止输出 patch。
禁止输出树结构修改指令。
禁止输出 Markdown、解释、代码块或任何 JSON 之外的文本。

## 术语约定

本任务中，主子层级术语只能使用下面两组固定表达，禁止混用其他近义词：

- `owner` = 主控件
- `role` = 子控件

进一步约束：

- `ownerType` 表示主控件类型
- `roleType` 表示子控件类型
- `carrierNodeId` 表示承载节点
- `memberNodeIds` 表示成员节点

禁止把以下词当成 `owner` 或 `role` 的替代术语使用：

- “主元素”
- “子元素”
- “控件元素”
- “复合元素”
- “运行时元素”
- “主容器”
- “子容器”

如果必须描述 `owner` 与 `role` 的关系，只能使用“主控件 / 子控件”这组术语。

## 允许读取的本地文件

以下占位符在实际任务中都会先被展开成**Windows 绝对路径**或**绝对 glob 模式**。你只能使用展开后的实际值，禁止自行猜目录、改路径、改 glob、补父目录、补相对路径。

- 识别输入清单 JSON：`[RECOGNITION_INPUT_MANIFEST_PATH]`
- 节点分片 JSON：`[RECOGNITION_NODE_SHARD_GLOB_PATH]`
- 完整预览图：`[PREVIEW_IMAGE_PATH]`
- 标注预览图：`[ANNOTATED_PREVIEW_IMAGE_PATH]`
- 节点图集：`[NODE_ATLAS_GLOB_PATH]`
- 节点单图：`[NODE_PREVIEW_GLOB_PATH]`

不要读取这些文件之外的任何本地内容。

## 必须遵守的读取顺序

1. 先读取 `[RECOGNITION_INPUT_MANIFEST_PATH]`
2. **完整读取** `[RECOGNITION_NODE_SHARD_GLOB_PATH]` 匹配到的全部节点分片 JSON
3. **必须先读** `[ANNOTATED_PREVIEW_IMAGE_PATH]`
4. **必须完整读取** `[NODE_ATLAS_GLOB_PATH]` 匹配到的全部 atlas 图集
5. 仅当 atlas 无法可靠判断局部细节时，才按需少量读取 `[NODE_PREVIEW_GLOB_PATH]`

强约束：

- `[ANNOTATED_PREVIEW_IMAGE_PATH]` 与 `[NODE_ATLAS_GLOB_PATH]` 是主视觉输入，绝对不可跳过
- 未读完整套 atlas 前，禁止开始 owner 或 role 判断
- 默认不要逐张读取节点单图

## 核心原则

唯一总原则：**图像优先，节点名兜底。**

- 第一证据：`[ANNOTATED_PREVIEW_IMAGE_PATH]` + 全部 `[NODE_ATLAS_GLOB_PATH]`
- 第二证据：少量 `[NODE_PREVIEW_GLOB_PATH]`
- 辅助证据：节点 JSON 中的 `name`、`layerName`、`nameTokens`、`previewKind`、`idPath`、`displayPath`、`onlyChildId`、`renderLeafCount`

判定规则：

- 图像证据清晰时，必须服从图像
- 图像不够清晰时，如果节点名存在强烈且一致的语义信号，才允许用节点名定型
- 图像和节点名都不强时，必须保守，不要激进误判成交互控件

## AI 类型域

### `ownerType` 只允许 13 个主类型

`Null`、`Image`、`Text`、`Button`、`Dropdown`、`InputField`、`Toggle`、`Slider`、`ScrollView`、`Mask`、`FillColor`、`Panel`、`ToggleGroup`

### `roleType` 只允许这些子控件类型

`Background`、`Button_Text`、`Button_Highlight`、`Button_Press`、`Button_Select`、`Button_Disable`、`Slider_Fill`、`Slider_Handle`、`Toggle_Checkmark`、`Toggle_Label`、`Dropdown_Label`、`Dropdown_Arrow`、`InputField_Placeholder`、`InputField_Text`、`ScrollView_Viewport`、`ScrollView_HorizontalBarBG`、`ScrollView_HorizontalBar`、`ScrollView_VerticalBarBG`、`ScrollView_VerticalBar`

### `nodeLabels[*].labelType` 只允许基础安全类型

`Null`、`Image`、`Text`、`Mask`、`FillColor`、`Panel`

### 严禁输出

- `RawImage`
- `TMPText`
- `TMPButton`
- `TMPDropdown`
- `TMPInputField`
- `TMPToggle`
- 任意 `TMP*`

补充硬约束：

- `Image` 是唯一静态图片类型
- `Text` 是唯一文字类型
- `Panel` 不是普通 wrapper；只有纯组织壳才是 `Null`

## GUIType 语义真值

下面这些定义必须严格遵守，禁止按字面误解类型名：

### 基础叶子类型

- `Image` 是最基础的 UI 图片元素
- `Text` 是最基础的 UI 文本元素
- 若某个可见图像本身不依附任何主控件语义，优先识别为 `Image`
- 若某个文字层本身不依附任何主控件语义，优先识别为 `Text`

### 子控件类型

- `Background` 是 **roleType**，不是主类型
- `Background` 只能依附某个主控件存在，表示该主控件的背景图 / 底图
- 单独一张背景图片，如果没有明确依附某个主控件，必须判为 `Image`，绝不能输出为 `ownerType=Background`
- 同理，`Button_Text`、`Slider_Fill`、`Slider_Handle`、`Toggle_Label` 等都只是 role，不是 owner

### Layer Group 承载规则

- `Layer Group` 默认优先理解为 `Null`
- `Layer Group` 的主要职责是承载主控件或子控件，不应因为有包裹关系就直接变成 `Panel`
- 对于单图层即可天然承载的元素，例如单图按钮、单文字、单图片，可以直接由该单节点承载，不强制额外创建 group 语义

### `Null` 与 `Panel`

- `Null` 只表示纯组织壳、透传壳、承载壳，本身没有独立视觉语义
- `Panel` 只能标记在 `Layer Group` 上，表示真实非交互容器、信息区域或布局区
- `Null` / `Panel` 不应标记在普通叶子图片层或文字层上
- 若某个 group 只有组织作用，没有明确背景面板语义，应判为 `Null`，不是 `Panel`

### `Panel` 与 `Background` 的关系

- 当一个 `Layer Group` 被识别为 `Panel`，且它存在 `Background` role 时，`Background` 表示这个 `Panel` 的底图
- 这个 `Background` 是 `Panel` 的子控件，不是独立导出的主控件
- 当 `Panel` 没有 `Background` role 时，它的语义就是全透明空容器
- 因此，“背景图 + 文本/其他节点”的组合，若整体是一个非交互信息面板，应优先考虑 `Panel + Background`，而不是把最外背景图错误识别成 `ownerType=Background`

## Phase A：Owner Graph 识别

你要先识别**主控件 owner**，不要先按 PSD 单节点下结论。

### owner（主控件）的定义

owner 就是主控件。owner 的定义必须精确为：最终运行时会生成的一个独立 UI 控件边界。

一个 owner 可能：

- 由 1 个现有节点天然承载
- 由多个兄弟或近邻图层共同组成
- 由外层 group 承载
- 需要多个图层合起来才是一个完整主控件

### owner 与 leaf / role 的边界

- owner 是主控件，不是“任何看起来重要的 PSD 节点”
- role 是子控件，必须依附 owner
- 独立的 `Image` / `Text` 可以自己就是 owner
- `Background` 绝不能自己成为 owner
- 若看到一张大底图，只要它没有明确服务某个主控件，就把它当 `Image`，不要生造 `Panel`，更不要输出 `Background owner`
- 如果某个 `Panel` / `Button` / `Slider` 内部还包含一个**独立静态图标簇**，而 role 类型域里又没有对应的 roleType，那么这个图标簇必须输出成**单独的 `Image owner`**
- 这种独立静态图标簇，禁止只把它吞进父 owner 的 `memberNodeIds` 然后不再输出独立运行时元素
- 因为 role 类型域没有“通用图片 role”，所以“资源图标 / 状态图标 / 币种图标 / 能量图标 / 徽章图标 / 装备图标”这类需要在运行时保留为单独图片节点的内容，必须优先输出为子级 `Image owner`
- 父 owner 的 `memberNodeIds` 只能覆盖它自身不可分离的组成部分；凡是运行时应保留成单独子节点的图标簇、徽章簇、独立装饰图，不能被父 owner 贪婪吞并

### owner 识别要求

- 先判断主控件边界，再判断哪个节点只是 wrapper / carrier / leaf
- 主控件边界必须取**最小且完整闭环**，不要把只是“承载多个并列子区”的父 group 直接吞成一个主控件
- 如果某个父 group 内部已经存在一个完整可成立的按钮/滑条/面板子树，而父 group 还同时承载其他并列信息子区、徽标区、数值区或装饰区，优先让**内部最小完整子树**成为主控件，父 group 保持 `Null` 或 `Panel`
- 若多个图层共同构成一个主控件，必须把这些节点合并为同一个 owner
- 禁止把一个多图层单主控件拆成多个独立 `Image`
- `carrierNodeId` 只有在“现有单节点天然承载主控件 owner”时才填写
- 多图层元素必须通过 `memberNodeIds` 明确表达全部成员
- 如果一个静态图标由多个碎图层共同组成，但视觉上是**一个完整 icon / badge / emblem / currency icon / status icon**，必须把它合并成**一个 `Image owner`**
- 这类多碎图层静态图标优先选择最外自然 wrapper 作为 `carrierNodeId`；若没有天然 carrier，再通过 `memberNodeIds` 表达这是一个单独 `Image owner`
- 典型例子包括：`energy` / `gem` / `gold` / `coin` / `avatar` / `badge` / `emblem` / `icon` 等名字对应的多图层图标；即使它们位于资源栏、状态栏、按钮或面板内部，也不能因为位于父控件内部就放弃输出单独 `Image owner`
- 当多个碎图层共同构成的是某个复合主控件的底图、框体、轨道、底板，而旁边还存在**独立图标层 / 独立文字层 / 独立徽章层**时，必须把“碎图底板簇”和“独立图标/文字/徽章”拆成两个元素，禁止全吞成一个 owner
- 例如装备框、卡槽、资源栏、状态栏中，背景框碎图通常应形成一个 `Background role` 或单独 `Image owner`；同层的 `Icon` 必须单独保留，不能被背景框碎图一起合并

### owner 视觉规则

`Button`

- 整体像点击面、条目卡片、装备框、头像框、槽位、按钮面板
- 只要整体点击语义明显，优先 `Button`，不要轻易降成 `Panel`

`Slider`

- 只要能确认轨道 + 填充层语义，就必须保留 `Slider`
- **满进度 fill 挡住 background 仍然是 `Slider`**
- `Slider_Fill` 的存在是强反证，禁止把这类结构误判成 `Panel`
- 任何“背景轨道 + 填充条 + 可选文本/徽标”的结构，都应优先检查为 `Slider`
- 细长横条、细长竖条、长条进度槽、带外框边界的条形控件，本身就是 `Slider` 的强视觉信号
- 只要图像上能看出“长条轨道轮廓 / 长条边界框 / 条形外轮廓”，就应优先朝 `Slider` 判断，而不是 `Panel`
- 判断 `Slider` 时，不能要求 `Background` 必须完整裸露可见；条形边界、外框、端头、轨道轮廓本身就足以证明它是进度条轨道
- 如果一个条形控件内部还有另一层颜色明显不同、长度随进度变化的内条，这就是典型 `Background + Slider_Fill` 结构
- 如果 `Fill` 填充条已经铺满，完全或几乎完全遮挡了 `Background` 轨道，也仍然优先判为 `Slider`
- 在满进度场景下，即使 `Background` 只剩极细边缘、端头轮廓、外框层次，或仅能从 node-atlas 的前后层关系推断出来，也必须保留 `Slider + Background + Slider_Fill` 语义
- 只要能从图像看出“同一条形控件存在底轨 + 覆盖其上的填充层”，哪怕底轨大部分被盖住，也不能把它降成 `Panel`、`Image` 或普通装饰条
- `Slider_Handle` 的首要判定依据不是形状名字，而是**它是否位于 `Slider_Fill` 的端点，用来标记当前进度位置**
- 只要一个局部图形稳定贴在填充条末端、随进度应处在填充终点位置，并与同一条形轨道形成“轨道 -> 填充 -> 端点滑块”的关系，它就优先是 `Slider_Handle`
- `Slider_Handle` 的外观可以是**圆形、矩形、圆角矩形、菱形、三角、箭头、旋钮、小球、小块、小牌**，禁止把 `Slider_Handle` 误限定为箭头类图形
- 即使这个端点部件只是一个普通 `Shape_xxx`、`icon`、`btn`、`node`、`dot`、`thumb`、`knob` 或无明显语义名的图片层，只要它显示在 `Fill` 端点并承担“当前位置滑块/端点标记”作用，就应识别为 `Slider_Handle`
- `Slider_Handle` 可以是独立图片层，也可以是一个 wrapper group 包住的单图层；这类手柄即使名字普通，也不能降成普通 `Image`
- 当某个小图形紧贴长条填充端点共现时，优先先检查它是否是 `Slider_Handle`；不要因为它名字像 `arrow` 就误联想到 `Dropdown_Arrow`
- 条形控件上方常见的刻度线、条纹、描边光效、分段装饰、shine overlay，仍然属于同一个 `Slider owner` 的内部视觉子树；它们盖在 `Slider_Fill` 上面，不构成把该结构降成 `Panel` 的理由
- 如果条形控件内部存在 `Background`、`Slider_Fill`，同时还有覆盖在其上的 `line` / `tick` / `shine` / `frame` / `overlay` 装饰层，必须保持这是**同一条形控件**，不要把装饰层误拆成独立 owner，也不要因为装饰层存在而忽略 `Slider` 判断
- 如果一个外层 group 同时承载“轨道背景 + 填充条 + 百分比/数值文本 + 贴附在条上的等级徽章/数字徽章”，且这些内容共同描述同一个进度/经验/等级进度控件，应把**这个外层自然 group**直接作为 `Slider owner`
- 条右侧或条内部附着的等级徽章、星框数字、端点数值徽章，如果它本身形成一个**自洽的小徽章/小面板**，例如“底板/星框/圆框/图标 + 数字文本”，则它通常应识别为嵌套在 `Slider owner` 内部的 **`Panel owner`**，而不是并入 `Slider_Fill`、也不是降成普通 `Image`
- 这类挂在 `Slider` 上的等级 badge / 数值 badge / 端点徽章，语义上仍然服务于同一个大进度条，但结构上更适合识别为 `Slider` 内部的子 `Panel owner`
- 只有当徽章部分没有独立底板、没有独立图标+文本闭环、只是普通贴图装饰时，才并入 `Slider owner` 内部；不要把明显的“badge panel”错误吞并成 `Slider owner` 的普通叶子
- 禁止把这类 badge panel 错误拆成独立 `Image owner`；优先顺序应为：嵌套 `Panel owner` > 并入 `Slider owner` 普通内容 > `Image owner`

`ToggleGroup`

- 只有明确是互斥选择组时才允许输出
- 一排相似按钮、普通功能按钮列表、样式按钮集合，不能仅因外观相似就升级成 `ToggleGroup`
- 仅仅是成排按钮展示，不等于 `ToggleGroup`

`Panel`

- 是真实非交互容器、信息区域、布局区
- 纯包装层、透传层、单子节点外壳更应判为 `Null`
- 若只是单张背景图本体，没有明显“容器承载其他节点”的语义，更应判为 `Image`
- 资源栏、状态栏、数值徽章、信息角标、等级小面板等非交互信息区，优先检查为 `Panel`，不要误升为 `Button` 或 `Slider`
- 若一个资源/状态区内部还挂着独立的 `add`、`plus`、`btn` 子按钮，外层资源区通常仍是 `Panel`，子按钮单独输出为 `Button`
- `Gem`、`Gold`、`Energy`、货币数值区、状态数值区这类“背景 + 数字/文字 + 图标 + 独立小按钮”的结构，优先理解为 `Panel`，不要把整个外层区误报成 `Button`
- 简单的“底板/圆底/徽章底 + 数字文本”组合，只要整体语义是一个非交互信息徽章或数值面板，也优先输出 `Panel + Background + Text`，不要偷懒直接输出成 `Image owner`
- 对于 `Gem` / `Gold` / `Energy` / 货币栏 / 状态栏这类 `Panel`，其中的币种图标、能量图标、宝石图标通常应作为 `Panel` 的**子级 `Image owner`** 保留，不能直接被并入 `Panel owner` 自身
- 如果这类图标由 2 层或多层碎图构成，例如外轮廓 + 内高光、双色填充、内外描边，它仍然是**单个 `Image owner`**，绝不能因为碎层较多就保持 `Null` wrapper，或拆成多个图片节点

### owner 负例

- 有图 + 有字，不等于 `Button`
- 细长条 + 文字，不等于 `Slider`
- 单个内层 `btn` 图，不等于按钮状态图
- 一排相似项，不等于 `ToggleGroup`

## Phase B：Role Graph 识别

必须在 owner 主控件已确定后，再识别 role 子控件。

### role（子控件）定义与规则

role 就是子控件。role 的定义必须精确为：只能依附某个 owner 主控件存在、不能单独作为主控件输出的局部功能部件。

- `Background` 可属于 `Button`、`Dropdown`、`InputField`、`Toggle`、`Slider`、`ScrollView`、`Panel`、`ToggleGroup`
- `Slider_Fill` / `Slider_Handle` 只能属于 `Slider`
- `Button_*` 只能属于 `Button`
- `Toggle_*` 只能属于 `Toggle`
- `Dropdown_*` 只能属于 `Dropdown`
- `InputField_*` 只能属于 `InputField`
- `ScrollView_*` 只能属于 `ScrollView`

### role 输出规则

- 若现有单节点天然承载子控件 role，填写 `carrierNodeId`
- 若多个图层共同构成一个子控件 role，`carrierNodeId` 留空，`memberNodeIds` 填全部成员
- 文本 role 必须落在真实文字层
- 如果多个碎图层共同构成一个 `Background` / `Slider_Fill` / `Button_*` 图片 role，但当前树里没有一个“只包这组碎图、不包其他兄弟元素”的天然父节点，必须让 `carrierNodeId` 为空，并把这组碎图**精确**写进 `memberNodeIds`
- 这表示本地会为这组碎图创建 role 承载节点；因此 `memberNodeIds` 必须只包含该 role 的真实成员，绝不能顺手把旁边的 `Icon`、文本、徽章、按钮面或其他兄弟碎图一起带进去
- 对 `Button_Text`、`Toggle_Label`、`Dropdown_Label`、`InputField_Text`、`InputField_Placeholder`：
  `carrierNodeId` 必须是最终真实 `TextLayer` 节点，不能是它外面的 wrapper group
  若文字外面还有一层或多层 `text` / `Text` / `label` / `Group` wrapper，这些 wrapper 只应出现在 `memberNodeIds`，不能拿来充当文本 role carrier
- 图片 role 不能落在文本层
- 若 role 对应的是一个自然 group wrapper，例如 `bg`、`bar`、`btn`、`levelBg`、`bar_bg`，优先把 **外层 wrapper** 作为 carrier，不要把 role 直接落到最内层叶子图
- 但如果某个 wrapper 同时包住了两个不同 role，例如同一 group 里同时含有轨道底图和填充条，那么这个 wrapper 不是单一 role 的天然 carrier
- 对这种“混合 wrapper”，必须继续下钻到更具体的子 wrapper / 子叶子，分别给 `Background` 与 `Slider_Fill` 选择各自独立的 carrier
- 例如一个 `loading` group 同时包含 `loading_bg` 和 `loading_bar` 时，`Background` 不能落到 `loading`，必须落到只表示轨道的那一层；`Slider_Fill` 也必须落到只表示填充的那一层
- `Background` / `Slider_Fill` / `Slider_Handle` 若视觉上对应一个 wrapper group，必须优先输出该 wrapper 的 `carrierNodeId`
- 如果 `Background` 与 `Slider_Fill` 同处某个自然 `bar` wrapper，而该 wrapper 内还有 `line` / `tick` / `shine` / `overlay` 等装饰层，必须保留这个自然 wrapper 子树；只给真正的背景层和填充层标 role，不要把装饰层误当成新的 owner，也不要为了 role 标注去拆散这个自然子树
- 不同 role 不能共用同一个 `carrierNodeId`
- role 的 `carrierNodeId` 绝不能等于它所属 owner 的 `carrierNodeId`
- 对 `Button` 尤其要严格遵守上一条：
  如果一个 `Button owner` 的承载层是外层 group，而内部还有 `btn` / `background` / `circle` / `frame` 之类的底图层，那么 `Background role` 必须落到这个**内层底图节点**，绝不能继续落到外层 `Button owner` 自身
- `+` 按钮、关闭按钮、装备框按钮、卡槽按钮、图标按钮都遵守同一规则：外层可点击 group 负责 `Button owner`，内层按钮面/底图负责 `Background role`
- `Background` 与 `Slider_Fill` 必须落在两个不同 carrier 上；如果背景 wrapper 与填充 wrapper 不是同一个节点，禁止把二者都压到同一个外层 group
- `Slider_Handle` 若可见且语义明确，也必须有自己独立的 carrier，不能与 `Background` 或 `Slider_Fill` 共用 carrier
- `Button_Highlight` / `Button_Press` / `Button_Select` / `Button_Disable` 只有在**同区域多状态图**明确成立时才允许输出
- `Button_Text -> Toggle_Label` 只有 owner 明确是 `Toggle` 时才允许发生
- `Background` 必须优先落在“最外且仍准确”的自然 carrier，不要吞到内层叶子
- 若一个 `icon` / `flag` / `gem` / `coin` / `energy` / `avatar` group 是该图片元素的自然导出承载层，不要机械标成 `Null`；应把这个 wrapper 直接视为 `Image`
- 对 `Button` / `Panel` / `Slider` 的 `Background`，如果其真实视觉由多个并列碎图层共同构成，而旁边又有单独 `Icon`，必须把这些背景碎图层识别为**一个 `Background role` 图层簇**，并把 `Icon` 保留为独立元素
- 典型反例：`equip_frame` 下前 3 个节点是框体碎图，第 4 个节点是 `Icon`。正确做法是前 3 个节点形成一个 `Background role`，第 4 个 `Icon` 单独保留；错误做法是把 4 个节点一起合并成一张图

### 必需闭环

- `Button`：必须有且仅有一个 `Background`
- `Button` 若存在唯一主文字，必须输出一个 `Button_Text`
- 彩色操作按钮、普通文本按钮、带图标动作按钮、装备槽位按钮、卡片按钮，只要存在唯一主标题文字，就必须输出 `Button_Text`
- `Button_Text` 的 `carrierNodeId` 必须直接指向那一层真实文字节点；不要把按钮的文字 wrapper group 留成普通 `Text`，也不要遗漏 `Button_Text`
- `Slider`：必须有且仅有一个 `Background`，必须有且仅有一个 `Slider_Fill`，`Slider_Handle` 可选
- 若 `Panel` / `ToggleGroup` 明显有唯一底板，应输出一个 `Background`

## 高频误判纠正

- 可点击的装备框、装备槽、头像框、卡片槽位、带图标的交互框，只要整体像可点击入口，就优先 `Button`，不要因为它像边框/底板就降成 `Image` 或 `Panel`
- 进度条两端附着的等级框、数字牌、星框 badge，只要它们是在表达这根条的状态，仍应保留在同一个 `Slider owner` 内部，不要拆成 `Image owner`
- 圆形数值 badge、等级 badge、资源数字 badge，如果内部是 `Background + Text` 语义，应优先 `Panel`，不是 `Image`
- `level`、`num`、`badge`、`counter`、`chip`、`tag`、`status` 这类命名如果同时满足“有独立底板/图标 + 文本”的图像证据，应优先朝 `Panel owner` 判断，而不是 `Null` 或普通 `Image`
- 多个并列碎图层如果共同组成一个边框、底板、框体、条形轨道、徽章底，而旁边存在独立 `Icon` / 文本 / 数值，则不要因为它们都在同一个 group 下就把所有成员一次性吞并；要先按最终运行时图片元素分簇

## nodeLabels 规则

`nodeLabels[]` 是**所有原始节点**的保底标签，不是主输出。

- 必须覆盖全部原始节点
- 只能输出安全基础类型
- 用于本地兜底、孤儿修复、保守降级
- 即使主控件 owner / 子控件 role 已成立，也仍然要给全部节点写 `nodeLabels`

## 输出 JSON 契约

顶层必须是一个 JSON 对象：

- `version`：必须是 `[RECOGNITION_COMBINED_VERSION]`
- `treeHash`：必须原样复制识别输入清单中的 `treeHash`
- `owners`
- `roles`
- `nodeLabels`

### `owners[*]` 必须包含

- `ownerId`
- `ownerType`
- `carrierNodeId`
- `memberNodeIds`
- `confidence`
- `reason`

要求：

- `ownerId` 可以是现有节点 id，也可以是你生成的稳定语义 id
- `carrierNodeId` 若非空，必须是识别输入中的现有节点 id
- `carrierNodeId` 与 `memberNodeIds` 至少一种有效
- `memberNodeIds` 至少 1 个，且都必须是识别输入中的现有节点 id
- `confidence` 范围必须是 `(0, 1]`
- `reason` 必须简短具体，80 字以内，并引用具体 atlas 文件或标注区域

### `roles[*]` 必须包含

- `ownerId`
- `roleType`
- `carrierNodeId`
- `memberNodeIds`
- `confidence`
- `reason`

要求：

- `ownerId` 必须引用 `owners[*].ownerId`
- `carrierNodeId` 若非空，必须是识别输入中的现有节点 id
- `carrierNodeId` 与 `memberNodeIds` 至少一种有效
- `memberNodeIds` 至少 1 个，且都必须是识别输入中的现有节点 id
- 同一 `ownerId` 下同一种 `roleType` 只能出现一次
- 同一成员节点不能同时属于两个 role
- `confidence` 范围必须是 `(0, 1]`
- `reason` 必须简短具体，80 字以内，并引用具体 atlas 文件或标注区域

### `nodeLabels[*]` 必须包含

- `nodeId`
- `currentUIType`
- `labelType`
- `confidence`
- `reason`

要求：

- 必须覆盖识别输入中的全部原始节点且恰好一次
- `nodeId` 必须使用识别输入中的节点 id
- `currentUIType` 必须如实填写当前节点类型
- `labelType` 只能是安全基础类型
- `confidence` 范围必须是 `(0, 1]`
- `reason` 必须简短具体，80 字以内

## 输出前强制自检

1. 是否已读取 `[ANNOTATED_PREVIEW_IMAGE_PATH]`
2. 是否已读取全部 `[NODE_ATLAS_GLOB_PATH]`
3. 是否先识别 owner，再识别 role
4. 是否没有输出任何 `RawImage` / `TMP*`
5. 是否没有把满 fill 的 slider 判成 `Panel`
6. 是否没有把普通按钮列表误判成 `ToggleGroup`
7. 是否没有把多图层单元素拆成多个独立 `Image`
8. 是否把“多个碎图共同构成的一张背景图/图标图”精确聚成了单个元素簇
9. 是否没有把背景框碎图和旁边独立 `Icon` 错误合并成同一张图
10. 是否所有 `nodeLabels` 覆盖了全部原始节点
11. 是否所有文本 role 都落在真实文字层
12. 是否所有 `reason` 都引用了具体视觉证据

## 最终要求

- 只输出一个合法 JSON 对象
- 不输出 Markdown
- 不输出解释
- 不输出 patch
- 不输出结构操作
