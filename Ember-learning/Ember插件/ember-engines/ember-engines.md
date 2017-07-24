# [Ember Engines](http://ember-engines.com/)

## 简介

### 什么是 Engines？

简单来说，Engines 是独立的、可以组合的应用组合。除了 Engine 需要一个宿主应用来启动它并为它提供一个路由之外，它几乎与常规的 Ember 应用具有相同的特性。

> 从用户的观点来说，Engines 允许多个逻辑应用组合成一个单个的应用。 —— [Engines RFC](https://github.com/emberjs/rfcs/blob/master/text/0010-engines.md)


每个 Engine 共用一个 router 和host，你可以以新的、更加雄心勃勃的方式来组合逻辑用用程序。

## 为什么使用 Engines？

[这里有很多让 Ember 使用 Engines 的理由](https://github.com/emberjs/rfcs/blob/master/text/0010-engines.md#motivation)，但是最让人信服的是下面的这些：

- **分布式开发** —— Engines 可以在自己的 Ember CLI 项目中独立开发和测试，并且被应用或其他 engine 包含。 Engines 可以被打包并且发布成 addon。
- **界线清晰** —— Engine 可以通过一些显式接口与父级应用通信。排除这些接口之外，engines 和 应用是相互独立的。
- **懒加载** —— Engine 允许它的父级应用仅加载路由影射来启动。剩下的 engine 仅仅在需要的时候被加载（如：当访问 engine 中的路由时）。这样就使得应用加载得更快，内存消耗也更少。

## 获取帮助 & 贡献力量

## Engine 线路图

Ember Engines 当前为 pre-1.0，处于正在开发的状态。最好的获取动态的方法就是查看 [repo](https://github.com/ember-engines/ember-engines) 和保持 [Ember’s RFCs](https://github.com/emberjs/rfcs/pulls)



