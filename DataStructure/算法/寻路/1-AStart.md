### 1. 背景
在游戏中，我们经常想找到从一个位置到另一个位置的路径，最好花费最短的距离。为了找到这条最短路径，我们有很多种图形搜索算法可以解决，比如广度优先搜索（BFS），Dijkstra搜索，A\*搜索。
其中A\*搜索时热门选择，接下来从最简单的BFS开始一步步说明A\*。

### 2. BFS
#### 2.1 BFS算法描述
1. 一般BFS搜索
BFS在各个方向都进行了平等的探索，是一个非常常用的算法，在BFS中通常使用队列来在遍历时存储节点。

```
frontier = queue()
reached = []
frontier.push(start)
while(!frontier.empty())
   current = frontier.front(); frontier.pop()
   if current == goal break
   for next in current.neighbors
     if next not in reached
       frontier.push(next)
       reached.push(next)
     end if
    end for
end while 
```

2. BFS搜索记录路径
可以看到，BFS只提供一个循环来访问图的所有节点，并不构造路径。为了能够查找路径，我们需要使用一个表 `came_from` 来记录到达每个位置的来源。比如 `came_from[B]=A` 表示路径 `A->B` 

```
frontier = queue()
came_from = map()
frontier.push(start)
came_from[start] = null
reached = []
while(!frontier.empty())
	current = frontier.front(); frontier.pop()
	if current == goal : break
	for next in current.neighbors
	  if next not in came_from
	    frontier.push(next)
	    came_from[next] = current
	  end if
	end for
end while
```

3. BFS搜索还原路径
通过表 `came_from` ，我们可以以目标开始找到前面的点，添加到路径中还原路径。由于从目标向起点查找前一个点，故可以使用后进先出的栈存储，以便从起点到终点还原路径。

```
 current = goal
 path = stack()
 while current != start
   path.push(current)
   current = came_from[current]
 path.push(start) 
```

### 3. Dijkstra
Dijkstra算法不是平等地搜索所有可能的路径，而是偏向于成本较低的路径。有时候角色在网格上移动需要成本，然后寻找成本最低的路径到达目标。

为此，我们可以使用表 `cost` 来记录从起点到当前节点的成本，决定如何选取下一个节点时，我们希望选择成本最低的节点，因此可以使用**优先级队列**来存储节点，该队列会自动对成本排序以获得最低成本节点。

我们最终可能会以不同的成本多次访问一个位置，因此我们需要稍微改变一下逻辑。如果从未到达过该位置，则不会将该位置添加到边界，而是在通往该位置的新路径优于之前的最佳路径时添加该位置。

```
frontier = priority_queue()
frontier.push(start,0)
came_from = map()
cost = map()
came_from[start] = null
cost[start]=0

while(!frontier.emppty())
	current = frontier.top(); frontier.pop()
	if current == goal : break
	for next in current.neighbors
		new_cost = cost[current] + getCost(current,next)
		if next not in cost or new_cost < cost[next]
			cost[next] = new_cost
			priority = new_cost
			frontier.push(next, priority)
			came_from[next] = current
		end if
	end for
end while
```

### 4. Heuristic search启发式搜索
Greedy Best-First Search偏向从边界到目标扩展，从而找到一条成本更低的路径，通常需要定义一个启发式函数告诉我们与目标的距离。

```
// 比如曼哈顿距离函数
float heuristic(end,current)
	return abs(end.x-current.x)+abs(end.y-current.y)
```

在Dijkstra中，使用起点到边界的实际距离进行优先级队列排序，而在Greedy Best-First Search中使用边界到目标的估计距离进行优先级队列排序，首先探索最接近目标的位置。

```
frontier = priority_queue()
frontier.put(start,0)
came_from = map()
came_from[start]=null

while (!frontier.empty())
	current = frontier.top(); frontier.pop()
	if current == goal : break
	for next in graph.neighbors(curerent):
		if next not in came_from
			priority = heuristic(goal, next)
			frontier.push(next,priority)
			came_from[next]=current
		end if
	end for
end while
```

### 5. AStart
Dijstra算法可以很好地找到最短路径，但是会在不必要的方向浪费时间探索。Greedy Best-FIrst Search可以很好地朝最佳方向探索但是可能无法找到最短路径。

所以A\*算法结合了二者的优点，同时使用起点到边界的距离以及边界到目标的估计距离进行估价。

```
frontier = priority_queue()
frontier.push(start,0)
came_from = map()
cost = map()
came_from[start] = null
cost[start] = 0

while(!frontier.empty())
	current = frontier.top(); frontier.pop()
	if current == goal : break
	for next in current.neighbors
		new_cost = cost[current] + getCost(current, next)
		if next not in cost or new_cost < cost[next]
			cost[next] = new_cost
			priority = new_cost + heuristic(goal, next)
			frontier.push(next, priority)
			came_from[next] = current
		end if
	end for
end while
```


##### 参考
1. [Introduction to the A* Algorithm --- A* 算法简介 (redblobgames.com)](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
