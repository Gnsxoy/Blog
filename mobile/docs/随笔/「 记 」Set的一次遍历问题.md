---
title: 「 记 」Set的一次遍历问题
date: 2024-07-27
lastUpdated: 2024-07-27
---

# 「 记 」`Set`的一次遍历问题

## 前言

`Set` 是一种非常有趣的数据结构，它有点像一个特殊的数组，但有一个重要的区别——它只会存储唯一的值。

对于处理一大堆重复数据的场景来说，`Set` 简直是神器。然而，和很多“神器”一样，它在某些情况下也会让人头疼，比如这次遍历时遇到的一个意想不到的小问题。

我最近在项目中使用 `Set` 进行遍历操作，结果竟然在增删元素时遇到了死循环！

这篇文章就是想跟大家分享一下我在这个过程中学到的经验教训，希望能帮助你在使用 `Set` 时少走弯路。

## 问题场景：遍历中的死循环

+ **示例代码**

  ```js
  let set = new Set([1]);
  let index = 2;
  
  set.forEach((item) => {
    set.delete(1);
    set.add(1); // -a 造成死循环
    set.add(2); // -b 不会死循环，为什么呢？🤔
    set.add(index++); // -c 再次死循环
    console.log('log-content');
  });
  ```

  + `a: set.delete(1); set.add(1);`

  + `b: set.delete(1); set.add(2);`

  + `c: set.delete(1); set.add(index++);`

  在这个例子中，`a` 和 `c` 的操作都会导致死循环，而 `b` 的操作则不会。让我们来解开这些谜题吧！

+ **问题分析**

  **「 由于 `Set` 数据结构成员都是唯一的。 」**

  1. `a` 的这种情况， `set` 下次循环的时候，会察觉还有值，会造成死循环。

     > **`Set.forEach` 为什么会这样实现？在扩展中有解释（以及为什么）。👇**

  2. `b` 的这种情况，不会死循环是因为「 结构成员都是唯一 」。

     所以 `log-content` 打印两次，第二次 `add(2)` 时视为无效。

  3. `c` 的这种情况，因为每次添加的值都是不同的 `add(2 -> 3 -> 4 -> 5)`

     导致每次遍历时 `Set` 都会添加新元素，最终引发死循环。

+ **`forEach` 无法中途跳出的陷阱**

  在调试时，我尝试使用 `forEach` 进行循环操作，却发现 `return` 并不能终止整个循环。

  为了记录这一点，特此说明 `forEach` 跳出循环的问题。

  + 使用 `return` 只能跳出当前循环，类似于 `continue` 的效果，但不能终止整个循环。
  + `forEach` 不支持使用 `continue` 和 `break` 来跳出循环，尝试使用将会报错。
  + 可以通过 `try-catch` 抛出异常的方式来跳出循环，但这就属于偏方了。

  **这也是由于 `forEach` 是传入一个回调函数，形成了一个作用域，因此必须遍历所有的数据才能结束循环。**

  > 也就意味着 `forEach` 内部定义的变量不会像 `for` 循环那样污染全局作用域。

## 扩展：`Object/Array` 的表现

相比 `Set`，在 `Object` 和 `Array` 上做类似操作时，情况会简单得多。

`Object` 和 `Array` 的遍历操作中，基本不会遇到类似的死循环问题，因为它们的遍历机制不同。

```js
let obj = { a: 1 },
  arr = [1];

for (let key in obj) {
  obj[index++] = index; 
  console.log("key-", key); // 只打印一次 key- a
}

arr.forEach((_item) => {
  console.log("_item-", _item); // 只打印一次 _item- 1
});
```

在 `Object` 中，你可以放心地在循环中添加新属性，因为它不会影响当前循环的进程。

同样，在 `Array` 中，即使你在 `forEach` 中改变了数组的内容，循环也不会被干扰。

## `Array vs Set：forEach` 方法的区别

> `Array/Object` 和 `Set`在遍历过程中的表现为什么不一致？
>
> 原因如下：👇

- [`Array_forEach`定义](https://tc39.es/ecma262/#sec-array.prototype.foreach)

  **`Array_forEach`是「 首先获取了`Array`的长度 🍓 」，然后使用循环访问每个元素。**

  **所以不是说新插入的元素不访问，而是因为插入的位置超过了`forEach`执行时的数组大小。😯**

  ```js
  let arr_1 = [1, 2];
  arr_1.forEach((_item_1) => {
    // 打印 1、5 -- 👆 验证了上面说法~
    console.log("_item_1", _item_1);
    arr_1.pop();
    arr_1.push(5);
  });
  ```
  
- [`Set_forEach`定义](https://tc39.es/ecma262/#sec-set.prototype.foreach)

  **`Set_forEach`是「 按照插入顺序依次访问各个元素 🍓🍓🍓 」。**

  **而且明确约定了，在`forEach`开始执行之后插入的元素也要被访问。**

  `Set numEntries to the number of elements of entries.` - 是`ECMA`中对于`Set_forEach`的描述。