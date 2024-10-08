---
title: 「 记 」浅析对象与Map数据结构
date: 2024-09-07
lastUpdated: 2024-09-07
---

# 「 记 」浅析对象与`Map`数据结构

## 前言

在一次算法单元测试中，我使用了 `ES6` 的 `Map` 存储 `Key-Value` 时，期望达到类似哈希表的效果。然而，测试结果却显示 `Map` 的性能远低于预期。

基于我过去 `Java` 的一些开发经验，`HashMap` 的存取复杂度为 `O(1)`，虽然 `ES6` 的 `Map` 并非 `HashMap`，但我认为性能应该相差无几。然而，实际测试结果却大相径庭，这背后的原因究竟是什么呢？

## `Map` 的实现

面对这个问题，我的第一反应是查阅文档，并找到了相关的 `ES` 规范（[TC39: Map](https://tc39.es/ecma262/#sec-map-objects)），发现了 `Map` 的相关定义。

以下是 `Map.prototype.get` 函数的定义：

```markdown
The following steps are taken:

1. Let M be the this value.
2. Perform ? RequireInternalSlot(M, [[MapData]]).
3. Let entries be the List that is M.[[MapData]].
4. For each Record { [[Key]], [[Value]] } p of entries, do
    a. If p.[[Key]] is not empty and SameValueZero(p.[[Key]], key) is true, return p.[[Value]].
5. Return undefined.
```

好家伙，结果从 `Map` 里面获取元素是 `for` 循环去做的，并且会逐一对比 `Key`，难怪是要比 `HashMap` 慢很多，这就相当于从 `Map` 中查询一个值的复杂度是`O(n)`。

我们再看看插入是怎么做的。

```markdown
The following steps are taken:

1. Let M be the this value.
2. Perform ? RequireInternalSlot(M, [[MapData]]).
3. Let entries be the List that is M.[[MapData]].
4. For each Record { [[Key]], [[Value]] } p of entries, do
    a. If p.[[Key]] is not empty and SameValueZero(p.[[Key]], key) is true, then
        i. Set p.[[Value]] to value.
        ii. Return M.
5. If key is -0𝔽, set key to +0𝔽.
6. Let p be the Record { [[Key]]: key, [[Value]]: value }.
7. Append p as the last element of entries.
8. Return M.
```

不出所料，先遍历是否存在，如果存在则覆盖 `Value`，否则添加到 `entries` 的末尾。那么插入元素的时间复杂度也是`O(n)`。

这也就解释了前言中的问题，`ES Map`用来做哈希表还是不太行。

**那么，既然 `Map` 的增查复杂度是 `O(n)`，原生对象的复杂度是否会更低呢？**

## 原生对象（数组）的实现

### 与 `Map` 的性能比较

先看一段使用原生对象替代 `Map` 的代码：（适用于部分场景）

```js
const key = 1, value = 1;
// map curd
const map = new Map();
map.has(key);
map.set(key, value);
map.get(key);
map.delete(key);
// obj curd
const obj = {};
obj[key] !== undefined;
obj[key] = value;
obj[key];
delete obj[key];
```

可以看到，二者的使用方式非常相似。我在本地电脑上测试了 `Map` 和 `Object` 的增查效率，测试代码如下：

```js
// 对象
const len = 1000000;
const obj = {};
for (let i = 0; i < len; i++) {
    const key = "k" + i;
    obj[key] = "value";
}
let vc = 0;
for (let i = 0; i < len; i++) {
    const key = "k" + i;
    if (obj[key]) {
        vc++;
    }
}
// Map
const len = 1000000;
const map = new Map();
for (let i = 0; i < len; i++) {
    const key = "k" + i;
    map.set(key, "value");
}
let vc = 0;
for (let i = 0; i < len; i++) {
    const key = "k" + i;
    if (map.has(key)) {
        vc++;
    }
}
```

+ `Map` 耗时：`1470 ms`

+ `Object` 耗时：`1987 ms`

**从结果来看，原生 `Object` 的效率并未高于 `Map`，反而 `Object` 还要更慢一点。这又是为什么呢？**

### 为什么原生对象比 `Map` 效率更低？

为了解释这一现象，我查阅了文档（[TC39: Objects](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-makebasicobject)），找到了原生对象的相关定义：

```markdown
1. Let obj be a newly created object with an internal slot for each name in internalSlotsList.
2. Set obj's essential internal methods to the default ordinary object definitions specified in 10.1.
3. Assert: If the caller will not be overriding both obj's [[GetPrototypeOf]] and [[SetPrototypeOf]] essential internal methods, then internalSlotsList contains [[Prototype]].
4. Assert: If the caller will not be overriding all of obj's [[SetPrototypeOf]], [[IsExtensible]], and [[PreventExtensions]] essential internal methods, then internalSlotsList contains [[Extensible]].
5. If internalSlotsList contains [[Extensible]], set obj.[[Extensible]] to true.
6. Return obj.
```

这里只提到了原始对象的定义，并没有说具体是怎么实现的。

我们可以从文中提到的 `internalSlotsList` 猜想，难道对象的属性也是一个 `slotsList` ？每次查询也是遍历一次拿到，况且因为原生对象的属性还有很多内置属性，所以遍历时会遍历更多的元素，导致对比 `Map` 还要更低效一点。🤔❓

这个解释很说得通，我自己都差点信了。😓

直到我把苗头转向了数组，我把 `Key` 变成了纯数字，然后用数组、`Map`和原生对象跑了一次，代码如下：

```js
const len = 1000000;
const obj = {};
for (let i = 0; i < len; i++) {
    const key = i;
    obj[key] = "value";
}
const arr = [];
for (let i = 0; i < len; i++) {
    const key = i;
    arr[key] = "value";
}
const map = new Map();
for (let i = 0; i < len; i++) {
    const key = i;
    map.set(key, "value");
}
```

+ 数组消耗时间：`42 ms`
+ `Map` 消耗时间：`450 ms`
+ 原始对象消耗时间：`54 ms`

**仅仅是 `Key` 是字符串还是数字索引的区别，和之前的结果就大相径庭，`Map` 基本被吊打。**

**所以原生对象并不是比 `Map` 效率更低，只是在非数组索引时 `Map` 更适合一些。**

同时也说明，`JavaScript`引擎应该对原始对象和数组的数据结构有特殊处理。

## `Chrome V8` 是如何处理原生对象与数组的数据结构的呢？

继续看文档，于是找到了`Chrome V8`引擎相关描述的博文（[Fast properties in V8](https://v8.dev/blog/fast-properties)）

**原文很长，这里只列出重点：**

1. 对于 **可被顺序索引** 的属性，使用数组作为数据结构。例如：`0,1,2` （速度最快）

2. 对于 **不可顺序被索引** 的属性，分两种情况：

   1. 如果是在对象定义时就有的属性，数据结构依然使用数组，但会生成一个属性名到数组索引的映射表，例如：`name -> 0`，`age -> 1`。（速度也很快 😯）

   2. 如果是在运行时动态添加的属性，数据结构使用 `Dictionary`，引擎会将动态添加的 `Key` 和 `Value` 添加到一个字典表中。（速度较慢）

3. 每一次为原生对象动态添加不可被顺序索引的属性，都会为他生成一个 `HiddenClass` 用于存储这个对象的元信息。

   添加顺序索引的属性则不会。

4. 数组和原生对象的结构差不多，如果数组使用顺序索引，那么参考第 `1` 条，如果是非顺序索引，则参考第 `2.2` 条。例如：

   1. 顺序索引：`a[0] = 1;a[1] = 2;` 使用数组存储。
   2. 非顺序索引：`a[9999] = 999;a['abc'] = 123;` 使用 `Dictionary` 存储。

由这些内容就可以解释上文的案例了：

+ **之所以原生对象的效率更低，是因为每一次新增字符串属性（ 非顺序索引 ），都会额外创建 `HiddenClass`，导致开销增大很多；**

  **而新增数字索引就不会。所以才导致了上文「仅仅是`Key`类型不同，结果却大相径庭」。**

到这里，也算是对原生对象的数据结构有了更清晰的认识。

当然，其实 [Fast properties in V8](https://v8.dev/blog/fast-properties) 这篇博文还说了很多其他关于对象数据结构的细节，讲的更加深入，这里就不多讨论了，有兴趣的小伙伴可自行阅读。

## 总结 & 思考

通过这一波儿折腾，感觉对 `Chrome V8` 引擎的实现细节又多了一些了解。

从一开始的猜想到最后找出真相，一步一步挖掘探索，还是很有意思的，有一种解密的感觉，特别是在自己认为已经猜到它的实现时，然后又去写测试代码验证，结果被啪啪打脸的时候，又会更加好奇这 `Chrome V8` 到底是咋玩儿的。

事实证明，还是要多实践多思考，`JavaScript`引擎开发者的每一个实现都有很多细节在里面，同时也做足了思考，经过了这么多年的打磨，力求做到更优，并不是我等菜鸟随随便便就能猜到的😂~

## 参考资料

1. [TC39:sec-map-objects.get](https://tc39.es/ecma262/#sec-map.prototype.get)
2. [TC39:sec-map-objects-set](https://tc39.es/ecma262/#sec-map.prototype.set)
3. [TC39:sec-makebasicobject](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-makebasicobject)
4. [Blog:Fast properties in V8](https://v8.dev/blog/fast-properties)