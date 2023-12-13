### 1. Player移动
脚本：PlayerController.cs

##### 1.1 左右移动
1. 组件
- Rigidbody 2D
	SleepMode：Never
	Freeze Rotation：Z
- Capsule Collider 2D：胶囊碰撞体（代表2D角色身体）
- Box Collider 2D：Box碰撞体触发器（脚部，用于识别地面）

2. 代码实现
通过Rigidbody改变速度（Vector2 变量），实现移动

```cs
void Run(){
	// 获取水平轴移动方向
	float moveDir = Input.GetAxis("Horizontal");
	// 改变x方向速度，y方向速度不变
	Vector2 playerVel = new Vector2(moveDir*speed, rigidbody.velocity.y);
	// 速度赋值给rigidbody
	rigidbody.velocity = playerVel;
}
```

##### 1.2 移动动画切换
1. 组件
- Animator
	Idle.anim --Run\=\=true--> Run.anim
	Run.anim -->Run\=\=false--> Idle.anim

2. 代码实现
- 通过Animator获得对应bool值，设置对应真假完成逻辑转换。

```cs
void Run(){
	// 判断x方向是否有速度
	bool playerHasXAxisSpeed = Mathf.Abs(rigidbody.velocity.x) > Mathf.Epsilon;
	// 设置布尔值Run的值
	animator.setBool("Run", playerHasXAxisSpeed);
}
```

- 根据方向改变Player前进方向，实现转身

```cs
void Flip(){
	// 判断x方向是否有速度
	bool playerHasXAxisSpeed=Mathf.Abs(rigidbody.velocity.x) > Mathf.Epsilon;
	// 有速度判断是否需要转身
	if(playerHasXAxisSpeed){
		// x速度为正，player无需翻转
		if(rigidbody.velocity.x > 0.1f){
			transform.localRotation = Quanternion.Euler(0,0,0);
		}
		// x速度为负，player翻转以y为轴180度
		if(rigidbody.velocity.x < -0.1f){
			transform.localRotation = Quanternion.Euler(0,180,0);
		}
	}
}
```

##### 1.3 Player一段跳
1. 一段跳代码实现
- 监控键盘，响应空格键点击
	按下空格键
		如果Player在Ground上，可以跳跃 (Ground的Layer设置为“Ground”)
		如果Player不在Ground上，不可以跳跃

```cs
/**
*
* private Boxcollider2d feet = GetComponent<BoxCollider2D>();
* private bool isGround;
*/

void CheckGrounded(){
	// 判断脚步是否触碰Ground的Layer
	isGround = feet.IsTouchingLayer(LayerMask.GetMask("Ground"));
}

void Jump(){
	// 如果单击空格键
	if(Input.GetButtonDown("Jump")){
		// 如果在地面，可以起跳
		if(isGround){
			// 设置y方向速度
			Vector2 jumpVel = new Vector2(0.0f,jumpSpeed);
			// 添加至rigidbody +y方向速度
			rigidbody.velocity = Vector2.up * jumpVel;
		}
	}
}
```

2.  动画切换
动画状态机
- Animator
	Idle.anim --Jump\=\=true-->Jump.anim --Jump\=\=false&Fall\=\=true--> 
		Fall.anim --Fall\=\=false--> Idel.anim
	
如果起跳，Jump为true，跳到最高点，Jump为false，Fall为true
```cs
void Jump(){
	// 如果单击空格键
	if(Input.GetButtonDown("Jump")){
		// 如果在地面，可以起跳
		if(isGround){
			animator.setBool("Jump",true);
		}
	}
}

/**
* Update中判断动画状态
*/
void SwitchAnimation(){
	animator.SetBool("Idle", false);
	//判断是否跳到最高点, 即y方向速度为负
	if(animator.GetBool("Jump", true)){
		if(rigidbody.velocity.y < 0.0f){
			animator.setBool("Jump", false);
			animator.setBool("Fall", true);
		}
	}
	// 如果在地面
	else if(isGround){
		animator.setBool("Fall", false);
		animator.setBool("Idle", true);
	}
}
```

##### 1.4 Player二段跳
1. 二段跳代码实现
如果在地面起跳，则为一段跳
已离开地面起跳，进行二段跳
```cs
/**
* private bool canDoubleJump;
* private float doubleJumpSpeed;
*/
void Jump(){
	// 如果单击空格键
	if(Input.GetButtonDown("Jump")){
		// 如果在地面，可以起跳
		if(isGround){
			// 播放一段跳动画
			animator.setBool("Jump",true);
			// 设置y方向速度
			Vector2 jumpVel = new Vector2(0.0f,jumpSpeed);
			// 添加至rigidbody +y方向速度
			rigidbody.velocity = Vector2.up * jumpVel;
			// 可进行二段跳
			canDoubleJump = true;
		}
		// 不在地面
		else{
			// 如果可以进行二段跳
			if(canDoubleJump){
				//播放二段跳动画
				animator.SetBool("DoubleJump",true);
				// 二段跳速度
				Vector2 doubleJumpVel = new Vector2(0.0f, doubleJumpSpeed);
				// rigidbody设置二段跳y方向速度
				rigidbody.velocity = Vector2.up * doubleJumpVel;
				// 不可以再进行二段跳
				canDoubleJump = false;
			}
		}
	}
}
```

2. 二段跳动画状态
- Animator
	一段跳到二段跳
	Jump.anim --DoubleJump=true--> DoubleJump.anim
	一段跳落下时到二段跳
	Fall.anim --DoubleJump=true--> DoubleJump.anim
	二段跳到落下
	DoubleJump.anim --DoubleJump=false&DoubleFall=true --> DoubleFall.anim
	二段跳落下到Idle
	DoubleFall.anim --DoubleFall=false&Idle=true--> Idle.anim
![[Pasted image 20230617150917.png]]

- 代码转换动画状态机逻辑
```cs
/**
* Update中判断动画状态
*/
void SwitchAnimation(){
	// 二段跳动画转换
	if(animator.GetBool("DoubleJump")){
		if(rigidbody.velocity.y < 0.0f){
			animator.setBool("DoubleJump", false);
			animator.setBool("DoubleFall", true);
		}
	}
	// 如果在地面
	else if(isGround){
		animator.setBool("DoubleFall", false);
		animator.setBool("Idle", true);
	}
}
```


### 2. Player攻击
##### 2.1 攻击动画实现
1. 在Project-Settings-Input添加攻击键"Attack"，绑定键盘一个按键

2. 攻击动画
添加Trigger类型变量Attack，控制攻击动画状态机转换
- Animator
	任何状态到攻击状态
	Any State --Attack--> attack.anim
	攻击状态回到Idle
	attack.anim --Idle=true--> Idle.anim
	攻击状态回到Jump
	attack.anim --Jump=true--> Jump.anim
	攻击状态回到Fall
	attack.anim --Fall=true--> Fall.anim
	以及攻击状态回到DoubleJump、DoubleFall、Run

3. 代码实现
```cs
void Attack(){
	// 如果按下Attack键
	if(Input.GetButtonDown("Attack")){
		// 触发Trigger变量, 播放攻击动画
		animator.SetTrigger("Attack");
	}
}
```

##### 2.2 攻击触发实现
1. 给Player添加子对象Attack，添加Polygon Collider2D（不规则图形碰撞体），将该碰撞体绑定到Player武器出现的关键帧上

2. 添加攻击控制脚本PlayerAttack.cs，拖到Attack对象上

3. 代码实现
Polygon Collider 2D组件默认为false，通过协程截取attack.anim武器出现的关键帧，使collider组件为true，进行攻击
攻击开始结束时间可在Attack.anim中分析，并在editor中调整，直到大体适应
```cs
/**
* public int damage; // 伤害值
* public float start; //攻击开始时间
* public float end; // 攻击结束时间
*/

void Start(){
	// 获取Player的Animator
	animator=GameObject.FindGameObjectWithTag("Player").GetComponent<Animator>();
	// 获取Polygon Collider 2D
	collider=GetComponent<PolygonCollider2D>();
}

void Update(){
	Attack();
}

void Attack(){
	// 如果按下Attack键
	if(Input.GetButtonDown("Attack")){
		// 触发Trigger变量, 播放攻击动画
		animator.SetTrigger("Attack");
		// 启动攻击开始协程
		StartCoroutine(startHitBox());
	}
}

// 攻击开始
IEnumerator startHitBox(){
	yield return WaitForSeconds(start);
	// 启用collider
	collider.enabled = true;
	// 启动攻击结束协程
	StartCoroutine(disableHitBox());
}

// 攻击结束, 禁用collider
IEnumerator disableHitBox(){
	yield return WaitForSeconds(end);
	collider.enabled = false;
}
```

##### 2.3 攻击交互实现
1. 导入敌人，添加碰撞体、动画等组件

2. Enemy抽象类
```cs
public abstract class Enemy : MonoBehavior
{
	public int health;
	public int damage;

	public void Start(){
	}

	public void Update(){
		// 敌人死亡
		if(health <= 0){
			// 摧毁该object
			Destroy(gameObject);
		}
	}

	// 受到攻击
	public void TakeDamage(int damage){
		// 敌人血量减少
		health -= damage;
	}
}
```

4. 创建敌人脚本EnemyBat.cs
设置血量、伤害值等
```cs
public class EnemyBat : Enemy
{
	public void Start(){
	}

	public void Update(){
		base.Update();
	}
}
```

4. 完善Player攻击伤害
```cs
// PlayerAttack.cs
// 判断武器与敌人是否触发碰撞

public int damage; // 玩家伤害值

void OnTriggerEnter2D(Collider2D other){
	// 如果触发器是敌人
	if(other.gameObject.CompareTag("Enemy")){
		// 获取敌人脚本组件, 调用相应函数
		other.GetComponent<Enemy>().TakeDamage(damage);
	}
}
```

##### 2.4 敌人受击效果
1. Enemy抽象类敌人受击红色闪烁
```cs
// Enemy.cs
private SpriteRenderer renderer;
private Color originalColor;
private float flashTime;

public void Start(){
	// 获取SpriteRenderder
	renderer = GetComponent<SpriteRenderer>();
	// 设置初始颜色
	originalColor = renderer.color;
}

// 红色闪烁
void FlashColor(float time){
	// 颜色设置为红色
	renderer.color = Color.red;
	// 延迟重置颜色
	Invoke("ResetColor", time);
}

// 重置Color
void ResetColor(){
	renderer.color = originalColor;
}

// 受到攻击
public void TakeDamage(int damage){
	// 敌人血量减少
	health -= damage;
	// 红色闪烁
	FlashColor(flashTime);
}
```

2. EnemyBat调用抽象父类Enemy的方法
```cs
public void Start(){
	base.Start();
}
```
