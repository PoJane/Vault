## 1. Unreal项目目录
### 1.1 目录结构示例
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

## 其他
### 相关链接
[虚幻引擎目录结构 |  5.5 ](https://dev.epicgames.com/documentation/zh-cn/unreal-engine/unreal-engine-directory-structure)
