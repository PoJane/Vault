### 1. Enemy AI

##### 1.1 Enemy 移动AI
使EnemyBat能随机路径飞行
1. 代码实现
```cs
// EnemyBat.cs

public float speed;
public float startWaitTime;
private float waitTime;

public Transform movePos; // 移动坐标
public Transform leftDownPos; // 左下角坐标
public Transform rightUpPos; // 右上角坐标

public void Start(){
	base.Start();
	waitTime = startWaitTime;
	movePos.position = GetRandomPos();
}

public void Update(){
	base.Update();
	// 从当前位置移动到随机位置
	transform.position = Vector2.MoveTowards(
		transform.position,
		movePos.position,
		speed * Time.deltaTime
	);
	// 到达目标位置
	if(Vector2.Distance(transform.position,movePos.position) < 0.1f){
		// 等待一段时间前往下一位置
		if(waitTime <= 0){
			movePos.position = GetRandomPos();
			waitTime = startWaitTime;
		}
		// 减少等待时间
		else{
			waitTime -= Time.deltaTime;
		}
	}
}

// 获取随机位置
Vector2 GetRandomPos(){
	// 生成范围内随机坐标
	Vector2 rndPos = new Vector2(Random.Range(
		leftDownPos.position.x,rightUpPos.position.x),
		leftDownPos.position.y,rightUpPos.position.y)
	);
	return rndPos;
}
```


### 2. Enemy 粒子特效
1. 制作敌人受击掉血粒子特效
利用Unity的粒子系统制作

1. 特效播放后销毁
给特效添加脚本BloodEffect.cs，在Start中生成后1秒销毁
```cs
void Start(){
	Destroy(gameObject,lifeTime);
}
```

2. 敌人受击后实现掉血特效
```cs
// Enemy.cs
// 受到攻击
public GameObject bloodEffect;

public void TakeDamage(int damage){
	// 敌人血量减少
	health -= damage;
	// 红色闪烁
	FlashColor(flashTime);
	// 生成掉血特效
	Instantiate(bloodEffect,transform.position,Quanternion.identity);
}
```