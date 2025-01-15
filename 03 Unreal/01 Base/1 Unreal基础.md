---
引擎: Unreal
---

## 1. 基础知识
### 1.1 术语
#### 1. 项目
UE项目中包含游戏的所有内容，文件夹存储再磁盘上，并于编辑器的内容浏览器（Content Browser）显示，结构与磁盘`Project`文件夹相同。

每个项目都有关联的`.uproject`文件，该文件是创建、打开或保存项目的方法。UE支持创建任意数量的不同项目，并使用编辑器并行处理。

#### 2. 脚本
##### a. 脚本类型
1. 蓝图
蓝图视觉效果脚本（Blueprint Visual Script）是UE的gameplay脚本系统，基于可视化的节点元素。蓝图在引擎中定义以object为导向的类（OO）或object，这些object通常被统称为“蓝图”。

2. C++
在Unreal的C++中，`UObject`是所有object的基类，拥有垃圾回收、变量提供给编辑器的元数据（`UProperty`）支持以及用于加载和保存的序列化。

##### b. 脚本术语
1. 类
类（Class）定义UE中特定Actor或Object的行为和属性。类是分层的，可从其父类中继承成员并传递给子项。UE中可在C++代码或蓝图中创建类。

2. Actor
Actor是可以放到关卡中的任何object，例如Camera、StaticMesh或PlayerStart。Actor支持3D变换，例如转换、旋转和缩放，并且可通过脚本创建或销毁。
在C++中，`AActor`是所有Actor的基类。

3. 类型转换
类型转换（Casting）是一种尝试将一个类转换为其他类的操作。类型转换可能成功，也可能失败。若成功，即可访问用于特定类的成员。

4. 组件
组件（Component）是可以添加到Actor的功能，即组件需连接到Actor，不能独自存在。

5. Pawn
- Pawn
Pawn是Actor的子类，作为游戏内的形象或人像的基类。玩家或游戏的AI可以控制Pawn，使其成为NPC。当玩家或AI控制Pawn时，其视为*被占有*；反之未被玩家或AI控制是，其视为*未被占有*。

- Character
角色（Character）是Pawn的子类，作为双足对象的基类。Character包含碰撞设置、双足运动的输入绑定以及用于玩家控制的其他代码。

6. Controller
- Player Controller
玩家控制器（Player Controller）用于获取玩家输入，并将其转换到游戏交互中。每个游戏内部至少有一个Player Controller，是玩家在游戏中的呈现方式。
对应的C++类是`PlayerController`

- AIController
AI控制器（AI Controller）用于操控Pawn，在游戏中呈现NPC。默认情况下，Pawn和角色都以基本AI控制器终结，除非它们被玩家控制器专门操控或者收到指令不允许为自己创建AI控制器。
关联的C++类是 `AIController`

7. Player State
玩家状态（Player State）是玩家在游戏中的状态，此地玩家指人类玩家或模拟玩家的机器人。非玩家AI作为游戏世界的一部分，没有玩家状态。玩家状态包括许多玩家信息如名称、等级、血量、得分等。
对于多人游戏，所有玩家状态存在于所有机器，可将数据从游戏服务器复制到客户端以保持内容一致。（这一点不同于玩家控制器，玩家控制器仅存在于玩家所使用的机器上。）
关联的C++类是`PlayerState`

8. 游戏模式
游戏模式（Game Mode）设置运行游戏的规则，这些规则包括玩家如何加入游戏、游戏是否可以暂停、游戏特定行为如获胜条件等。
可在**项目设置**中设置默认游戏模式，并针对不同的关卡重载游戏模式（在特定关卡的WorldSettings->GameMode Override中也可重载）。每个关卡只能有一个游戏模式。
在多人游戏中，游戏模式新存于服务器上，规则将复制并发送到每个连接的客户端。
关联的C++类是`GameMode`

9. 游戏状态
游戏状态（Game State）是一个容器，包含游戏中要复制到每个客户端的信息，是每个玩家的“游戏状态”，包含游戏得分相关信息、比赛是否开始、生成AI玩家的数量等等。
在多人游戏，每个玩家的机器上有一个本地游戏状态实例，并从游戏状态的服务器实例获取更新的信息。
关联的C++类是`GameState`

##### c. 关卡术语
1. 笔刷
笔刷（Bursh）是用于描述3D形状的Actor，例如立方体和球体。可将笔刷放置在关卡中定义几何体（这些几何体被称为二进制空间分区或BSP笔刷）。

2. 体积
体积（Volume）是带有边界的3D空间，常用体积：
- 阻挡体积（Blocking Volume）：可见的，用于阻止Actor通过
- 伤害体积（Pain Causing Volume）：对与其重叠的任何Actor造成伤害
- 触发器体积（Trigger Volume）：在Actor进入或退出体积时触发事件

3. 关卡
关卡（Level）是定义的GamePlay区域，关卡包含玩家可以看到并交互的所有内容。UE中每个关卡保存为单独的`.umap`文件，因此某些情况关卡也被称为地图（Map）

4. 世界
世界（World） 是构成游戏的所有关卡的容器。它处理关卡的流送和动态Actor的生成（创建）

#### 3. 工具和编辑器
UE提供了工具、编辑器和系统组合，用于创建游戏和应用程序。
- 工具：执行特定任务的用具，如放置Actor、绘制地形
- 编辑器：用来实现复杂目标的工具集合，如关卡编辑器、材质编辑器
- 系统：功能大合集，用于协同生产游戏和程序的各方面内容，如蓝图系统
UE中的不只有内置的工具和编辑器，也有可选插件（Plugins）中的工具和编辑器。

1. 关卡编辑器
```avatar
image: Z-images/image 03_01_01_LevelEditor.png
description: UE构建GamePlay内容的主要编辑器，可放置Actor和几何体、蓝图可视化脚本、Niagara粒子等，也是UE默认打开的编辑器
```

2. 静态网格体编辑器
```avatar
image: Z-images/image 03_01_01_StaticMeshEditor.png
description: 静态网格体编辑器（Static Mesh Editor）用来设置和操控静态网格体，也用来预览外观、碰撞和UV贴图，还可针对静态网格体设置LOD。
```

3. 材质编辑器
```avatar
image: Z-images/image 03_01_01_MaterialEditor.png
description: 材质编辑器（Material Editor）是创建和编辑材质的工具集成，创造出来的材质可以用于网格体以控制其视觉效果。
```

4. 蓝图编辑器
```avatar
image: Z-images/image 03_01_01_BlueprintEditor.png
description: 蓝图编辑器（Blueprint Editor）是使用和修改蓝图的编辑器，蓝图资产可用来创建Gameplay元素如控制Actor或对事件编写脚本、修改材质或执行其他UE功能，可用来替代游戏中的C++代码。
```

5. 物理资源编辑器
```avatar
description: 物理资产编辑器可创建并编辑物理资产，以配合骨骼网格体使用。物理资产用于实现变形和碰撞等物理特性，在物理资产编辑器中可从零开始创建完整设置或使用自动化工具来创建一套基本的物理形体和约束。
image: Z-images/image 03_01_01_PhysicsAssetEditor.png
```

6. 行为树编辑器

7. Niagara编辑器

8. UMG界面编辑器

9. 字体编辑器

10. Sequencer编辑器

11. 动画编辑器

12. Control Rig编辑器

13. Sound Cue编辑器

14. 媒体编辑器

15. nDisplay 3D配置编辑器

#### 4. 坐标空间
##### a. 空间及其变换
1. 切线（Tangent）
正交空间，可以是左旋或右旋。
TangentToLocal变换仅包含旋转，因此是OrthoNormal

2. 局部（Local）
也成为对象空间（Object Space），正交，可以是左旋或右旋（三角形剔除顺序需要调整）
LocalToWorld变换包含旋转、非等分缩放（包括可能改变缠绕顺序的负非等分缩放）和平移。

3. 世界场景（World）
世界场景即
WorldToView变换仅包含旋转和平移，因此视图空间中的距离与世界场景空间中的距离相同。

4. 平移世界场景（Translated World）
平移世界场景即世界场景+预览平移。平移的矩阵用于从组合的变换矩阵中移除摄像机位置，可在变换顶点时提高精度。

5. 视图（View）
视图即摄像机空间（Camera Space），
ViewToClip变换包含$x$轴和$y$轴上的缩放，但不包含平移（如果平移的话将会是偏心投影）。变换在$z$轴上缩放平移，还会应用投影来转换为齐次裁剪空间。

6. 裁剪（Clip）
也称为齐次坐标空间（Homogenious Coordinates Space）、后投影空间（Post Projection Space）、投影空间（Projection Space），是应用透视投影矩阵之后的空间。
裁剪空间中的W与视图空间中的Z相同。

7. 屏幕（Screen）
OpenGL中的标准化设备坐标（Normalized Device Coordinate），经过透视分割后，（左，右）为（-1，1），（上，下）为（1，-1），（近，远）为（0，1）

8. 视口（Viewport）
也称为视口坐标（Viewport Coordinate）、窗口坐标（Windows Coordinate），以像素为单位。（左，右）对应（0，WIDTH-1），（上，下）对应（0，HEIGHT-1）

##### b. 空间变换
WorldToView：
TranslatedWorldToView：
TangentToWorld：

---
## 其他
### 相关链接
[理解虚幻引擎的基础知识](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/understanding-the-basics-of-unreal-engine)
