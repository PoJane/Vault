### 1. 相机跟随玩家
1. 新建GameObject，将MainCamera作为其子物体，该GameObject添加脚本。

2. 代码实现
使用Vector3线性插值函数，在LateUpdate中实现。

```cs
public Transform target; // 跟随目标
public float smooth; // 线性插值平滑因子 (0.1)

void LateUpdate(){
	// 玩家还存在
	if(target != null){
		if(transform.position != target.position){
			// 相机位置、玩家位置线性插值
			transform.position = Vector3.Lerp(
				transform.position,
				target.position,
				smooth
			);
		}
	}
}
```

### 2. 相机抖动
1. 相机抖动：当玩家攻击敌人时，相机发生抖动。

2. 新建GameObject-CameraShake，添加脚本。

3. 给MainCamera添加动画Idle、Shake，录制关键帧，小幅改变相机水平方向位移，制作轻微左右晃动效果。最后，添加动画转换逻辑布尔Shake。

4. 代码控制布尔Shake的转变，实现动画切换。

```cs
public Animator cameraAnimator;

void shake(){
	cameraAnimator.setTrigger("Shake");
}
```

5. 给CameraShake添加‘CameraShake’标签

6. 创建游戏控制器GameController及其脚本，在内部写静态变量，存放公用变量或组件。

```cs
public class GameController : MonoBehavior{
	public static CameraShake cameraShake;
}
```

7. 在MainCamera的脚本中使用CameraShake。

```cs
void Start(){
	GameController.cameraShake = GameObject.FindGameObjectWithTag("CameraShake")
	.GetComponent<CameraShake>();
}
```

8. 在敌人受到攻击的函数中调用shake函数，使相机抖动

```cs
public void TakeDamage(int damage){
	GameController.cameraShake.shake();
}
```

### 3. 限制相机移动范围
1. 避免相机拍到Ground以下内容

2. 代码实现
在MainCamera脚本CameraFollow中实现此功能

```cs
public Vector2 minPos;
public Vector2 maxPos;

public void LateUpdate(){	
	if(target != null){
		if(transform.position != target.position){	
			Vector3 targetPos=target.position;
			// 限制目标位置x、y范围
			targetPos.x = Mathf.Clamp(targetPos.x,minPos.x,maxPos.x);
			targetPos.y = Mathf.Clamp(targetPos.y,minPos.y,maxPos.y);
			transform.position = Vector3.Lerp(
				transform.position,
				targetPos,
				smooth
			);
		}
	}
}

public void SetCamPosLimit(Vector2 minPos,Vector2 maxPos){
	min = minPos;
	max = maxPos;
	
}
```
