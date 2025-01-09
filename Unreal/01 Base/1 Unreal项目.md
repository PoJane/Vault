## 1. 项目目录
### 1.1 目录结构
1. *以蓝图项目 Unreal Project为例*
- Config
- Content
- DerivedDataCache
- Intermediate
- Saved
- UnrealProject.uproject

2. *以 Visiual Studio + Unreal Project为例*
- .vs
- Binaries
- Config
- Content
- DerivedDataCache
- Intermediate
- Plugins
- Saved
- Source
- UnrealProject.uproject

### 1.2 目录说明
- Binaries：包含可执行文件或编译期间创建的其他文件
- Build：包含编译引擎或游戏所需的文件，包括为某些特定平台创建项目版本时所需的文件
- Config：配置文件，包含的参数可用于控制引擎的行为。游戏项目Config文件中设置的值会覆盖`Engine\Config`目录中设置的值
- Content：保存引擎或游戏中的内容，例如资产包、贴图
- DerivedDataCache：包含派生数据文件。DDC转为被引用内容生成，并在加载时生成。加入被引用内容未生成过缓存文件，加载时间会显著增加
- Intermediate：包含编译引擎或游戏时生成的临时文件。在游戏目录中，shader也保存在该目录中
- Plugins：包含引擎中使用的插件
- Saved：包含自动保存文件、配置文件和日志文件。`Engine\Saved`目录包含崩溃日志、硬件信息、Swarm选项与数据
- Source：包含引擎或游戏的所有源文件，包括引擎源代码、工具和游戏类等
- UnrealProject.uproject：项目的主要配置文件，包含项目设置、模块、插件和其他元数据，另可双击此文件打开项目
```uproject
{
	"FileVersion": 3,
	"EngineAssociation": "5.4",
	"Category": "",
	"Description": "",
	"Modules": [
		{
			"Name": "ProjectP",
			"Type": "Runtime",
			"LoadingPhase": "Default"
		}
	],
	"Plugins": [
		{
			"Name": "ModelingToolsEditorMode",
			"Enabled": true,
			"TargetAllowList": [
				"Editor"
			]
		}
	]
}
```


## 2. 项目编译

### 2.1 编译配置
#### 1. 编译配置概述
>UE使用UnrealBuildTool（UBT）来自定义编译方法。UBT负责处理引擎反射系统编译所必须的信息，将C++代码、蓝图、复制、序列化以及垃圾回收进行整合。

- 构建配置包含：
	- 构建状态：表示引擎状态和游戏项目，如Debug、Development
	- 构建目标：表示构建目标，如Game、Editor

1. 构建状态

| 状态          | 说明                                      |
| ----------- | --------------------------------------- |
| Debug       | 调试：在不进行优化的情况下同时构建引擎和游戏代码                |
| DebugGame   | 调试游戏：在构建游戏代码时不进行优化                      |
| Development | 开发：启用所有功能除了引擎和游戏代码优化，UE编辑器的默认配置         |
| Shipping    | 交付：最佳性能配置，用于交付游戏，此配置剥离控制台命令、统计数据和性能分析工具 |
| Test        | 测试：即启用控制台命令、统计数据和性能分析工具后的Shipping配置     |


2. 构建目标

| 目标     | 说明                                                             |
| ------ | -------------------------------------------------------------- |
| Game   | 游戏：构建项目的独立可执行版本（需要特定平台的已烘培内容）                                  |
| Editor | 编辑器：在编辑器中打开项目并能反映所有代码更改                                        |
| Client | 客户端：指定项目用作UE客户端-服务器模型中的客户端（存在\<Game\>Client.Target.cs文件则此配置有效） |
| Server | 服务器：指定项目用作UE客户端-服务器模型中的服务器（存在\<Game\>Server.Target.cs文件则此配置有效） |

#### 2. UE项目编译配置
编译UE项目时，只会对项目源代码进行编译，配置示例：

|        | Debug | DebugGame | Development | Shipping | Test |
| ------ | ----- | --------- | ----------- | -------- | ---- |
| Game   |       | √         | √           | √        |      |
| Editor |       | √         | √           |          |      |
| Client |       |           |             |          |      |
| Server |       |           |             |          |      |

### 2.2 生成项目

> [!NOTE] 关于Intermediate
> 生成的项目文件被视为中间文件，存储在`PROJECT\Intermediate\ProjectFiles`中，若删除`Intermediate`文件夹则需重新生成项目

- 生成VS工程
找到`UnrealProject.uproject`文件，选中右键单击`Generate Visual Studio project files`（如果没有可选`显示更多选项`以显示被Windows隐藏的操作）

### 2.3 编译项目
#### 1. 使用VS进行构建
- 设置构建配置：Debug/ Development/ Shipping/ Test等
- 设置解决方案平台：Win64/ Android等

#### 2. 构建项目
右键解决方案UnrealProject，选择Rebuild来重新编译

## 3. 发布项目
### 3.1 打包项目
#### 1. 方式
1. UAT
打包使用虚幻自动化工具（Unreal Automation Tool，UAT），通过一组实用脚本（RunUAT）来操控UE项目。打包中UAT使用的特定命令是`BuildCookRun`，此命令可针对特定平台烘培内容，将其打包成平台的原生格式进行发布、部署并自动运行项目（若适用）。


> [!NOTE] RunUAT
> 在`Engine\Build\BatchFiles`目录中，Windows对应RunUAT.bat，Mac/ Linux对应RunUAT.sh


2. 编辑器
也可使用UE工具栏的平台（Platforms），从平台进行选择

3. 命令行
可使用命令行为平台烘培和打包内容，必须通过`-run=cook`指定阶段，必须指定目标平台，将保存到`PROJECT\Saved\Sandboxed/Cook-[Platform]`
```powershell
UnrealEditor.exe [GameName or .uproject] -run=cook -targetplatform=[Platform] -cookonthefly -iterate -map=[Map Name]
```

#### 2. 阶段
1. 构建（Build）：为所选平台编译可执行文件
2. 烘培（Cook）：在特殊模式下执行UE，以此烘培内容
3. 暂存（Stage）：将可执行文件和内容复制到暂存区域（开发目录外的独立目录）
4. 打包（Package）：将项目打包成平台的原生发布格式
5. 部署（Deploy）：将版本部署到目标设备
6. 运行（Run）：在目标平台上启动已打包的项目

---
## 其他
### 相关链接
- 项目目录/ 项目启动/ 项目编译
[虚幻引擎目录结构](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-directory-structure)
[在虚幻引擎中管理游戏代码&生成项目文件](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/managing-game-code-in-unreal-engine)
[编译虚幻引擎C++游戏项目](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/compiling-game-projects-in-unreal-engine-using-cplusplus)

- 项目发布/ 项目打包
[构建操作：在虚幻引擎中烘焙、打包、部署、运行项目](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/build-operations-cooking-packaging-deploying-and-running-projects-in-unreal-engine)
