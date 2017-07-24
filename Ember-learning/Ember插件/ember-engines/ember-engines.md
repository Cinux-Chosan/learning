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


# 引导

## 介绍

欢迎来到 Ember Engines 官方指南。该指南以在旨在为你提供一些与 Engines 相关的概念和想法，让你能够使用在 [ember-engines](https://www.npmjs.com/package/ember-engines)插件中实现的 Engine。

注意，因为 Engines 还没有 1.0.0 发布版本，所以一些特性仍然只存在于 [Ember RFC process](https://github.com/emberjs/rfcs)，本指南中给出的一些 API 和示例可能会有所变动。

### 本指南包含的内容

- 什么是Engine
- 理解 Engine 的核心概念
- 如何从零开始创建 Engine
- Engine 的基本使用（如：挂载和共享依赖）
- 如何开启 Engines 懒加载

### 本指南不包括的内容

- Engine 特性和开发进度线路图
- 转换已经存在的应用/代码来使用 Engines

### 额外资源

- [Ember Engines on GitHub](https://github.com/ember-engines/ember-engines)
- [Engines RFC](https://github.com/emberjs/rfcs/pull/10)
- [Engine Linking RFC](https://github.com/emberjs/rfcs/pull/122)
- [Ember Asset Loader on GitHub](https://github.com/ember-engines/ember-asset-loader)
- [Asset Manifest RFC](https://github.com/emberjs/rfcs/pull/153)
- [Asset Loader Service RFC](https://github.com/emberjs/rfcs/pull/158)

Note: 该手册是 ember-engines 0.4.0 发布版。

## [什么是 Engines？](http://ember-engines.com/guide/what-are-engines)
