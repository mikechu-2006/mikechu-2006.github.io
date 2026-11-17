---
title: '[合集]高级错题整理'
description: '这题在二分答案的过程中，在区间内是满足单调性的。但是出了区间，就不满足单调性了。这样一来，只要数据足够刁钻就可以卡掉（对，倒数第二个点被卡死了）所以二分答案…'
date: 2020-11-28
tags: ['算法', '题解']
draft: false
---

## 1\. 2020.11.28 [CF1446C](https://codeforces.com/problemset/problem/1446/C)

### 反思

这题在二分答案的过程中，在区间内是满足单调性的。但是出了区间，就不满足单调性了。这样一来，只要数据足够刁钻就可以卡掉（对，倒数第二个点被卡死了）所以二分答案结束后加一句判断。

### 代码

注意，本人很菜，代码什么的仅供参考，不要学习。。

```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;
ll n,a[210000],n2[31],id[210000],ans;
ll dfs(ll dep,ll le,ll ri){
	ll ans=0;
	if(dep<0){
		return ri-le+1;
	}
	ll s1=0,s2=0;
	ll l,r,m;
	l=le;r=ri;m=(l+r)/2;
	while(l<=r){
		if(a[id[m]] & n2[dep])r=m-1;
		else l=m+1;
		m=(l+r)/2;
	}
	if(m<le)m=le;
	if(m>ri)m=ri;//就是这里
	if(!(a[id[m]]&n2[dep]))m++;
	ll t1,t2;
	if(m == ri+1){
		t1=dfs(dep-1,le,m-1);
		return t1;
	}
	if(m == le){
		t2=dfs(dep-1,m,ri);
		return t2;
	}
	t1=dfs(dep-1,le,m-1);
	t2=dfs(dep-1,m,ri);
	ans = max(t1,t2)+1;
	return ans;
}
bool cmp(ll aa,ll bb){
	return a[aa] < a[bb];
}
int main(){
	cin >> n;
	n2[0]=1;
	for(ll i=1;i<=30;i++)n2[i]=n2[i-1]*2;
	for(ll i=1;i<=n;i++){
		scanf("%lld",&a[i]);
		id[i]=i;
	}
	sort(id+1,id+n+1,cmp);
	cout << n-dfs(30,1,n);;
	return 0;
}
```

## 2\. 2021.03.26 [CF1483B](https://codeforces.com/problemset/problem/1483/B)

### 反思

数组可以O(1)访问，O(n)插入删除。
列表可以O(n)访问，O(1)插入删除。
我现在知道，set 可以理解为：
O(logn)访问，O(logn)插入删除的一个数组和列表的中间数据结构。只要把编号（即下标）作为第一关键字，整体以pair的形式装进set就行了。要是还要再复杂一点，也可以自己重载一下">“和”<"两个运算符。
当然块状链表也知道，但是是O(sqrt(n))的插入和删除，不够优秀。

### 代码

```cpp
    #include<bits/stdc++.h>
    #define ll long long
    #define mo 1000000009
    using namespace std;
    ll t,n,a[110000],nxt[110000],o[110000],p[110000],ans[110000],cnt;
    set<ll> sp;
    set<ll> s;
    set<ll>::iterator nt,it;
    ll gcd(ll a,ll b){
    	if(b==0)return a;
    	else return gcd(b,a%b);
    }
    void update_next(ll &u,ll k){//k not included
    	if(s.upper_bound(k) != s.end())u=*s.upper_bound(k);
    	else u=*s.lower_bound(1);
    }
    int main(){
    	cin >> t;
    	while(t--){
    		cnt=0;
    		s.clear();
    		cin >> n;
    		for(ll i=1;i<=n;i++){
    			scanf("%lld",&a[i]);
    			ans[i]=0;
    			s.insert(i);
    		}
    		for(ll i=1;i<n;i++){
    			if(gcd(a[i],a[i+1])==1)sp.insert((i+1)*mo+i);
    		}
    		if(gcd(a[n],a[1])==1)sp.insert(1*mo+n);

    		ll u=*sp.lower_bound(2*mo)/mo;
    		if(sp.lower_bound(2*mo) == sp.end())u=*sp.lower_bound(1*mo)/mo;
    		while(sp.size()>0){
    			nt=sp.upper_bound(u*mo);
    			ll v=*nt%mo;
    			ll w;
    			update_next(w,u);
    			sp.erase(u*mo+v);
    			ans[++cnt]=u;
    			s.erase(u);
    			if(sp.count(w*mo+u))sp.erase(w*mo+u);
    			bool f=0;
    			if(w != u && gcd(a[v],a[w])==1)sp.insert(w*mo+v),f=1;
    			it=sp.upper_bound((u+1)*mo);
    			if(it == sp.end())it=sp.upper_bound(1*mo);
    			u=*it/mo;
    			if(f){
    				it=sp.upper_bound((u+1)*mo);
    				if(it == sp.end())it=sp.upper_bound(1*mo);
    				u=*it/mo;
    			}
    		}
    		printf("%lld ",cnt);
    		for(ll i=1;i<=cnt;i++){
    			printf("%lld ",ans[i]);
    		}
    		printf("\n");
    	}
    }
```

## 3\. 2021.04.04 [CF1503C](https://codeforces.com/problemset/problem/1503/C)

### 反思

这是一个巧妙的转换。我们在练习和考试时，一定要学会善待自己。尽量转换问题，以减小码量。

官方给出的第一个题解是dijkstra，很好理解，很好证明。然后洛谷上有人说可以通过c\[i\]范围的确定能扩展到那些结点，然后设为可以访问，直到访问到最高处（美丽度最大的城市）。

官方题解2就要简单得多。直接统计所有结点，拿a\[i\]减去最大的a\[j\]+c\[j\]即可。会发现，这个做法也是正确的。

### 解法

想象有n个城市，有一些可以不用费用就到达，成为几个连通块。连通块之间需要费用。那这个费用，如果把上一个连通块的所有结点到下一个连通块的所有结点都两两计算一遍，肯定是可以得到正确的费用。（但实际上上面有用的只有一个，就是最低的那个）而且我在一个结点上，需要统计的恰好是下面的所有结点中到达我的最小值。那么既然我把全局的结点都两两算出了，就可以两两相加，得到总贡献。码量减少了一大半。

### 代码

```cpp
    #include<bits/stdc++.h>
    #define ll long long
    using namespace std;
    ll n,fans,f[110000],nx,mx;
    struct city{
    	ll a,b,c;
    } a[110000];
    bool cmp(city a,city b){
    	if(a.a != b.a)return a.a<b.a;
    	else return a.c>b.c;
    }
    int main(){
    	cin >> n;
    	for(ll i=1;i<=n;i++){
    		scanf("%lld%lld",&a[i].a,&a[i].c);
    		a[i].b=i;
    		fans += a[i].c;
    	}
    	sort(a+1,a+n+1,cmp);
    	mx=a[1].a+a[1].c;
    	for(ll i=2;i<=n;i++){
    		fans += max(0ll,a[i].a-mx);
    		mx=max(mx,a[i].a+a[i].c);
    	}
    	cout << fans;
    	return 0;
    }
```

## 4\. 2021.08.03 [CF1548B](https://codeforces.com/problemset/problem/1548/B)

题外话：中考结束了，我回来写代码了~

### 反思

这题标答的是线段树或ST表的做法。（赛后别人有无线段树的做法，但是我个人认为比较复杂）。如果是按照我以往的认识，这题应该是一个很难的题，2300起步。但是我错了。数据结构只是一种工具，思维才是个人的能力。不能只因为一道题使用了线段树就说它是个难题，只能说它很烦。

## 5.2021.10.13 [CF1500B](https://codeforces.com/problemset/problem/1500/B)

转到中国剩余定理去。

## 7.2021.10.19[CF1572B](https://codeforces.com/problemset/problem/1572/B)

这个问题的解法很巧妙…我没有明白这个对于n是奇数的做法是怎么想出来的…

## 8.2021.10.19[CF1572C](https://codeforces.com/problemset/problem/1572/C)

是DP问题。那我没做出来很不应该。

只能说我的思路方向是对的。对于一次性填充一段的操作，应该关注它的两端颜色是否相同。而且想的也是区间DP。但是状态设错了。因为看见 20 n 2 20n^2 20n2觉得可能是状态要省，所以就没有考虑过自然状态。我走进的误区是认为只有两端颜色相同的段才有意义，然后发现这样设出来的状态很难转移。

实际解法就是 20 n 2 20n^2 20n2， 1.8 ∗ 1 0 8 1.8\*10^8 1.8∗108的时间。其实一点也不卡，因为区间DP本来就少掉一半。中间着相同颜色的操作又少了一半。人家大佬实际写出的代码只有200ms左右。

## 9 2022.01.20 CF1626F

朴素的期望兼组合思想就是 1 e 7 ∗ 17 1e7 \* 17 1e7∗17的时间复杂度，完全超了。（这也是为什么数据范围要给到1e7）
然后就可以用一种很常见的用小值域来代替大n的想法优化。
可是这个题值域不小啊
这就是这题的难点了。
将值域% L C M ( 1 , 2 , . . . , 16 ) LCM(1,2,...,16) LCM(1,2,...,16)，720720，因为这部分的值是减不掉的。最后的16是个小优化，因为最后一步做完之后就不用管减去的a\[i\]%17,反正也用不着了。
这样值域就变得足够小了，然后值域上做同样的做法，可以叫dp，也可以是期望dp，看怎么理解。

## 10\. 2022.01.22 [CF1627F](https://codeforces.com/problemset/problem/1627/F)

确实是个很有意思的题，需要将信息一步步推进。
1、切成全等的两半，在这个题中就等价于中心对称的两半。
2、那么就是需要找出权值最小的切割方法了。用一个显然的方法建图，把外侧的所有点连边到起点，然后中间的每条边加上它中心对称的那条边。
3、有人会说，要防止v和它中心对称的v’同时被经过。这是不用担心的，因为显然不够优，算法自然不会走到那里去。
这样跑个dijkstra就做完了。SPFA不知道会不会死。人家毕竟是网格图。

## 11\. 2022.02.21 [CF1633E](https://codeforces.com/problemset/problem/1633/E)

这个题 看到1e7就应该知道不是一个一个看了。应该绝对线形。
显然没有简单的可以做到线性的办法，而n,m相对小多了。所以可以想到，如果x只是轻微变动一点点，生成树应该没有本质区别。所以考虑对x进行分段操作。
首先，边的权值交换顺序肯定会引起本质变化，所以这里有m\*m个分界点。
同时，我们也不希望一条边的权先变小后变大，所以还有m个分界点。
做完了这些，我们只要计算每一段开头即可。别忘了记录边权随x增加而增加的边的数量。

## 12\. 2022.02.21 [CF1610F](https://codeforces.com/problemset/problem/1610/F)

很好奇这个题怎么想到的。

如果X到V和Y到V的权值相同，那么就把这两条边珊掉，改成X到Y的一条边。

最后，这个图任何一个点度数都小于等于2。那么就是琏和环还有孤立的点。轻轻松松安排好了，然后倒着返回初始状态就行了。

## 13.20220324 [CF1657E](https://codeforces.com/problemset/problem/1657/E)

思维差了一点。

在比赛时已经可以推到最后一步，就是使用动态规划完全解决这个问题。（也是最难的一步）
动态规划没想出来主要问题在于状态设计。容易发现n个结点并没有顺序之分，只有统计答案需要记录不同编号带来的差异。所以不妨尝试从1向n递推。那么状态设计的第一维就理所当然是i，目前已规划的结点数。

转移状态时注意到，新连接的i条边
