---
Unreal: 基础知识
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
Pawn是Actor的子类，作为游戏内的形象或人像的基类。玩家或游戏的AI可以控制Pawn，使其成为NPC。当玩家或AI控制Pawn时，其视为*被占有*；反之未被玩家或AI控制是，其视为*未被占有*。

角色（Character）是Pawn的子类，作为双足对象的基类。Character包含碰撞设置、双足运动的输入绑定以及用于玩家控制的其他代码。

6. Controller
- Player Controller
玩家控制器（Player Controller）用于获取玩家输入，并将其转换到游戏交互中。每个游戏内部至少有一个Player Controller，是玩家在游戏中的呈现方式。
对应的C++类是`PlayerController`

- AIController
AI控制器（AI Controller）用于操控Pawn，在游戏中呈现NPC。默认情况下，Pawn和角色都以基本AI控制器终结，除非它们被玩家控制器专门操控或者收到指令不允许为自己创建AI控制器。
关联的C++类是 `AIController`

7. Player State

##### c. 关卡术语

---
## 其他
### 相关链接
[理解虚幻引擎的基础知识](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/understanding-the-basics-of-unreal-engine)
