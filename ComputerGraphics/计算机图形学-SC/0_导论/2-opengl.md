### 1. OpenGL程序
#### 1.1 一般结构
GLUT完全通过事件来操作，程序需要处理的每个事件都要在main函数中定义相应的回调函数。

```cpp
#include<gl/glut.h>  //opengl GLUT的头文件

// 函数声明
void doMyInit(void);
void display(void);
void reshape(int,int);
void idle(void);

// 初始化函数
void doMyInit(void){
	// 设置opengl基本参数和环境，以及投影方式（正交或者透视）
}

// 改变窗口回调函数
void reshape(int w,int h){
	// 设置w-h窗口的投影变换
}

// 显示回调函数
void display(void){
	// 设置观察变换
	// 定义几何、变换、外观属性
}

// 空闲回调函数
void idle(void){
	// 在程序执行的每一步间更新
}

// 主函数
void main(int argc,char** argv){
	// 通过GLUT初始化系统和自定义的初始化工作
	glutInit(&argc,argv);
	glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB);
	glutInitWindowSize(width,height);
	glutInitWindowPosition(topLeftX,topLeftY);
	glutCreateWindow("A Sample Program");
	doMyInit();
	// 定义事件回调函数
	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	glutIdleFunc(idle);
	// 进入主事件循环
	glutMainLoop();
}
```

主事件循环启动后，reshape事件生成窗口，display事件调用自身的回调函数在窗口中绘制初始图像，idle回调函数在系统空闲时重新计算图像并在终端显示改变的图像。
### 2. 模拟均匀金属长条的温度分布
#### 2.1 程序

```cpp
#pragma region 1 模拟均匀金属长条的温度分布

#define ROWS 10         // 金属长条大小ROWS*COLS
#define COLS 30
#define AMBIENT 25.0    // 周围温度，摄氏度
#define HOT 50.0        // 热源单元温度
#define COLD 0.0        // 冷源单元温度
#define NHOTS 4         // 热单元数量
#define NCOLDS 5        // 冷单元数量

GLfloat angle = 0.0;
GLfloat temps[ROWS][COLS], back[ROWS + 2][COLS + 2];
GLfloat theta = 0.0, vp = 30.0;

// 设置金属长条上固定热点和冷点的位置
int hotspots[NHOTS][2] = {
    {ROWS / 2,0},
    {ROWS / 2 - 1,0},
    {ROWS / 2 - 2,0},
    {0,3 * COLS / 4}
};
int coldspots[NCOLDS][2] = {
    {ROWS - 1,COLS / 3},
    {ROWS - 1,1 + COLS / 3},
    {ROWS - 1,2 + COLS / 3},
    {ROWS - 1,3 + COLS / 3},
    {ROWS - 1,4 + COLS / 3}
};
int myWin;

void myInit(void);
void cube(void);
void display(void);
void reshape(int w, int h);
void setColors(float t);
void animate(void);
void iterationStep(void);

void myInit(void) {
    int i, j;
    // 激活深度测试
    glEnable(GL_DEPTH_TEST);
    glClearColor(0.6, 0.6, 0.6, 1.0);
    // 设置单元的初始温度
    for (i = 0; i < ROWS; ++i) {
        for (j = 0; j < COLS; ++j) {
            temps[i][j] = AMBIENT;
        }
    }
    for (i = 0; i < NHOTS; ++i) {
        temps[hotspots[i][0]][hotspots[i][1]] = HOT;
    }
    for (i = 0; i < NCOLDS; ++i) {
        temps[coldspots[i][0]][coldspots[i][1]] = COLD;
    }
}

// 在模型坐标系的第一个八分象限内创建单位立方体
void cube(void) {
    typedef GLfloat point[3];
    point v[8] = {
        {0.0,0.0,0.0},{0.0,0.0,1.0},
        {0.0,1.0,0.0},{0.0,1.0,1.0},
        {1.0,0.0,0.0},{1.0,0.0,1.0},
        {1.0,1.0,0.0},{1.0,1.0,1.0}};
    glBegin(GL_QUAD_STRIP);
    glVertex3fv(v[4]);
    glVertex3fv(v[5]);
    glVertex3fv(v[0]);
    glVertex3fv(v[1]);
    glVertex3fv(v[2]);
    glVertex3fv(v[3]);
    glVertex3fv(v[6]);
    glVertex3fv(v[7]);
    glEnd();
    glBegin(GL_QUAD_STRIP);
    glVertex3fv(v[1]);
    glVertex3fv(v[3]);
    glVertex3fv(v[5]);
    glVertex3fv(v[7]);
    glVertex3fv(v[4]);
    glVertex3fv(v[6]);
    glVertex3fv(v[0]);
    glVertex3fv(v[2]);
    glEnd();
}

void display(void) {
#define SCALE 10.0
    int i, j;
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    // 定义视图变换
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    // 视点  观察中心  向上方向
    gluLookAt(vp, vp / 2, vp / 4, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    // 为整个场景设置旋转操作
    glPushMatrix();
    glRotatef(angle, 0., 0., 1.);
    // 绘制金属长条
    for (i = 0; i < ROWS; ++i) {
        for(j=0;j<COLS;++j){
            setColors(temps[i][j]);
            // 用于显示中各项的模型变换
            glPushMatrix();
            glTranslatef((float)i - (float)ROWS / 2.0, (float)j - (float)COLS / 2.0, 0.0);
            // 0.1 冷 4.0 热
            glScalef(1.0, 1.0, 0.1 + 3.9 * temps[i][j] / HOT);
            cube();
            glPopMatrix();
        }
    }
    glPopMatrix();
    glutSwapBuffers();
}

// 定义投影变换
void reshape(int w, int h) {
    glViewport(0, 0, (GLsizei)w, (GLsizei)h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(60.0, (float)w / (float)h, 1.0, 300.0);
    glutPostRedisplay();
}

void setColors(float t) {
    // 颜色基于HOT=red(1,0,0)和COLD=blue(0,0,1)
    // 假设在任何时候COLD<=HOT
    float r, g, b;
    r = (t - COLD) / (HOT - COLD); g = 0.0; b = 1.0 - r;
    glColor3f(r, g, b);
}

// 当系统空闲时此函数被调用
void animate(void) {
    // iterationStep()改变数据以改变下一幅图像
    iterationStep();
    glutPostRedisplay();
}

void iterationStep(void) {
    int i, j, m, n;
    float filter[3][3] = {
        {0.,0.125,0.},
        {0.125,0.5,0.125},
        {0.,0.125,0.}
    };
    // 增加材质的温度
    for (i = 0; i < ROWS; ++i) {
        for (j = 0; j < COLS; ++j) {
            back[i < 1][j + 1] < temps[i][j];   // 将边界放置到back中
        }
    }
    // 用来自原始temps[][]的临近值填充边界
    for (i = 1; i < ROWS + 2; ++i) {
        back[i][0] = back[i][1];
        back[i][COLS + 1] = back[i][COLS];
    }
    for (j = 0; j < COLS + 2; ++j) {
        back[0][j] = back[1][j];
        back[ROWS + 1][j] = back[ROWS][j];
    }
    for (i = 0; i < ROWS; ++i) {
        for (j = 0; j < COLS; ++j) {
            temps[i][j] = 0.0;
            for (m = -1; m <= 1; ++m) {
                for (n = -1; n <= 1; ++n) {
                    temps[i][j] += back[i + 1 + m][j + 1 + n] * filter[m + 1][n + 1];
                }
            }
        }
    }
    for (i = 0; i < NHOTS; ++i) {
        temps[hotspots[i][0]][hotspots[i][1]] = HOT;
    }
    for (i = 0; i < NCOLDS; ++i) {
        temps[coldspots[i][0]][coldspots[i][1]] = COLD;
    }
    // 更新旋转角
    angle += 1.0;
}
#pragma endregion

int main(int argc,char *argv[])
{
    // 初始化GLUT系统和定义窗口
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(50, 50);
    myWin = glutCreateWindow("Temperature in bar");
    myInit();
    // 定义事件回调函数并入主事件循环
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutIdleFunc(animate);
    glutMainLoop();     // 进入事件循环
    return 0;
}
```
#### 2.2 运行
![[Pasted image 20231213220014.png]]

#### 2.3 说明
1. main函数结构
在OpenGL中main函数负责：
- 设置显示模式，定义窗口
```c
// 设置显示模式时，同时告知系统程序所需要的特性
// 告诉系统使用双缓存模式、RGB颜色模型、深度测试
glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB|GLUT_DEPTH)

// 深度测试还需在myInit函数中激活
glEnable(GL_DEPTH_TEST)
```
- 程序所需的初始化操作
- 定义回调函数，在事件发生时供系统调用- 在主事件循环函数中，将控制权转移给计算机事件系统

2. 从空间和变换看函数
- 模型空间：函数cube()定义了单位立方体，这里立方体使用自身坐标系
- 模型变换：模型变换出现在display()函数中，定义世界空间中几何模型实施的基本变换操作。如上将单位立方体进行了平移、 $Z$ 方向的变换
- 三维世界空间：通过模型变换后安置图形对象的空间
- 视图变换：在display()函数开头部分定义，设置模型观察矩阵为单位矩阵、指定视图参数，视图变换通过调用 `glutLookAt()` 函数完成

```
//(ex,ey,ez)表示视点坐标, (lx,ly,lz)表示视线方向, (ux,uy,uz)定义视图方向向上的矢量
glutLookAt(ex,ey,ez,lx,ly,lz,ux,uy,uz)
```

- 投影操作：投影操作在reshape()函数中定义，以便与视图变换操作分离。
```c
// 定义正交投影
glOrtho(left,right,bottom,top,near,far)
// 定义透视投影: 视场角，宽高比，近裁面，远裁面
glPerspective(fovy,aspect,near,far)
```

3. 程序执行顺序
![[Pasted image 20231214093900.png]]

#### 2.4 术语
1. 类型

|类型|说明|
|:--|:--|
|Glfloat|和系统无关的浮点数定义|

2. OpenGL函数

|函数|说明|
|:--|:--|
|glBegin(xxx)|指定由顶点函数定义的几何模型的类型|
|glClear(parms)|清除由参数定义的窗口数据|
|glClearColor(r,g,b,a)|将图形窗口的颜色设置为背景颜色|
|glColor3f(r,g,b)|为后续顶点调用设置RGB值|
|glEnable(parm)|激活参数定义的性能|
|glEnd()|几何模型定义区域的结束标记|
|glLoadIdentity()|将单位矩阵写入glMatrixMode指定的矩阵中|
|glMatrixMode(parm)|指定后续操作使用的系统矩阵|
|glPopMatrix()|在glMatrixMode指定的当前矩阵栈中弹出栈顶矩阵|
|glPushMatrix()|复制当前矩阵栈中栈顶的矩阵用于后续操作，当栈顶被弹出后该矩阵的值将恢复为最近调用的矩阵|
|glRotate(angle,x,y,z)|旋转几何模型，角度为angle，轴为(x,y,z)|
|glScalef(dx,dy,dz)|顶点坐标乘以指定值完成缩放|
|glTranslatef(tx,ty,tz)|顶点坐标加指定值完成平移|
|glVertex3fv(array)|根据三维矩阵设置几何模型顶点|
|glViewport(x,y,width,height)|使用整数窗口坐标，指定绘制图形的视口尺寸|

3. GLU函数

|函数|说明|
|:--|:--|
|gluLookAt(eyepoint, viewpoint, up)|定义视点位置、视点观察位置、观测向上方向等观察环境参数|
|gluPerspective(fov,aspect,near,far)|基于观察环境参数，给给定视域体定义透视投影|

4. GLUT函数

|函数|说明|
|:--|:--|
|glutCreateWindow(title)|创建图形窗口，并给出窗口名|
|glutDisplayFunc(function)|为显示事件指定函数|
|glutIdleFunc(function)|为空闲事件指定回调函数|
|glutInit(parms)|根据main函数部分参数初始化GLUT系统|
|glutInitDisplayMode(parms)|根据传入的符号设置系统显示模式|
|glutInitWindowPosition(x,y)|设置窗口左上角顶点的屏幕坐标|
|glutInitWindowSize(x,y)|设置窗口宽高|
|glutMainLoop()|进入GLUT主事件循环|
|glutPostRedisplay()|设置重绘时间，触发再次显示事件|
|glutReshapeFunx(function)|为改变窗口事件指定回调函数|
|glutSwapBuffers()|后台颜色缓存中的内容交换到前台颜色缓存中用于显示|

5. 参数

|参数|说明|
|:--|:--|
|GL_COLOR_BUFFER_BIT|与glClear函数一起使用，清空颜色缓存|
|GL_DEPTH_BUFFER_BIT|与glClear函数一起使用，清空深度缓存|
|GL_DEPTH_TEST|指定使用深度测试|
|GL_MODELVIEW|指定使用模视矩阵|
|GL_QUAD_STRIP|指定所有顶点是连续有序的四边形条带的顶点|
|GLUT_DEPTH|指定窗口使用深度缓存，以使用深度测试|
|GLUT_DOUBLE|指定窗口使用后台缓存，以使用双缓存|
|GLUT_RGB|指定窗口使用RGB颜色模型|

