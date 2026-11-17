---
title: 'C++ int，long long，size_t等隐式转换是否存在UB等问题整理'
description: '一般来说最好保证代码中所有运算不包含隐式转换，但是实际许多情况下并不会出现问题，感觉毕竟两个整数，能出什么问题？然后写代码的时候偷懒，所以就不会留意。这里整…'
date: 2025-06-07
tags: ['C++', 'UB']
draft: false
---

## 前言

一般来说最好保证代码中所有运算不包含隐式转换，但是实际许多情况下并不会出现问题，感觉毕竟两个整数，能出什么问题？然后写代码的时候偷懒，所以就不会留意。这里整理一下整数之间可能出现的问题。

所有代码输出测试环境为c++17，GCC 编译器版本14.2.0，win11

## 不涉及无符号整数

### 运算

当int与long long混合运算时，int会隐式提升为long long，并且int的值总能安全转换为long long，因此只要保证不会爆long long就没事。但是要注意一个实现：

```cpp
    int a = 1e9;
	int b = 1e9;
	long long c = a*b*1ll;
	cout << c << endl;
```

输出-1486618624，说明存在越界。这是因为int与int间运算，结果还是用int存的，而且运算顺序是从左到右。解决方法：在左侧添加1ll\*

```cpp
	int a = 1e9;
	int b = 1e9;
	long long c = 1ll*a*b;
	cout << c << endl;
```

输出1000000000000000000。

### 格式输入输出

用%d输出或读取long long类型，输出时，%d期望一个int类型参数，但传入long long。long long将被隐式转换成int，如果越界输出错误值，否则没事。

```cpp
	int a = 1e9;
	int b = 1e9;
	long long c = 1ll*a*b;
	printf("d,c=%d\n",c);
	printf("lld,c=%lld\n",c);
	printf("d,a=%d\n",a);
	printf("lld,a=%lld\n",a);
```

输出

```
d,c=-1486618624
lld,c=1000000000000000000
d,a=1000000000
lld,a=1000000000
```

输入时：%d只会填充long long的低32位，高32位保留读入之前的值，对未初始化局部变量导致UB。

```cpp
	long long nm = 0x123456789ABCDEF0;
	scanf("%d",&nm);
	printf("nm=%lld\n",nm);
```

输出nm=1311768464867721224
用%lld输出或读取int类型，输出时：%lld期望一个long long类型参数，但传入int。int的值会被隐式转换为long long，所以不会出现问题。输入时：%lld会覆盖大小为8字节的内存，超过int大小，导致UB。
总结：（在不越界情况下）printf整数随便用因为会隐式转换。**scanf任何情况下不可以混用！**~至少看在取地址符&的面子上，别乱用。~
浮点数什么的正常人也不敢乱用。

## 无符号整数

除了unsigned int, unsigned long long等明确unsigned的无符号整数，还有.size() .length()返回值是 size\_t，是无符号整数。char是有符号还是无符号，视编译器而定，两种都有。另外，填入数组下标的数最后会被转成size\_t，只要不越界，不会因类型产生错误。

比较操作：long long会隐式转换为size\_t。若long long为负数，转换后变为一个很大的正数，**会导致逻辑错误！**

```cpp
	long long A = -1;
	size_t B = 2;
	bool f=A<B;
	cout << f << endl;
```

输出0，与正确逻辑相反。解决方式：在size\_t不会越界的情况下，将size\_t强制转为有符号整数，如long long。
算术运算：size\_t会隐式转换为long long。不溢出则不会有问题。

## 总结

c++整数，scanf不能混用，有符号整数与无符号整数比较运算有问题。
