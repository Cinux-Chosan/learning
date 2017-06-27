# Atom 手册

# 第一章

## [为什么选择 Atom](http://flight-manual.atom.io/getting-started/sections/why-atom/)

## [安装 Atom](http://flight-manual.atom.io/getting-started/sections/installing-atom/)

## [Atom 基础](http://flight-manual.atom.io/getting-started/sections/atom-basics/)

假设现在 Atom 已经安装在你的系统上了，现在打开它。去配置它，然后找回熟悉的的感觉

首次打开Atom，你将看到下面的样子：

![](http://flight-manual.atom.io/getting-started/images/first-launch.png)

这是 Atom 的欢迎界面，它提供了一些 Atom 的使用指引。

### 术语

接下来可能看到很多关于 Atom 的术语，它们都在[词汇表](http://flight-manual.atom.io/resources/sections/glossary/)中

### 命令面板

在开始界面中，介绍了一些 Atom 最重要的命令。当焦点在编辑器编辑窗口的时候，按 `Ctrl+Shift+P` 按钮会弹出命令面板。

在整个手册单中，我们都使用快捷键如 `Ctrl+Shift+P` 来演示如何运行命令。这些都是我们检测你的系统平台给出的默认快捷键。

如果你希望看到除了我们检测到的其它平台，你可以在[这个页面](http://flight-manual.atom.io/getting-started/sections/atom-basics/)顶部选择其它的平台。

![](http://flight-manual.atom.io/getting-started/images/platform-selector.png)

If the Platform Selector is not present, then the current page doesn't have any platform-specific content.

If you have customized your Atom keymap, you can always see the keybinding you have mapped in the Command Palette or the Keybindings tab in the [Settings View](http://flight-manual.atom.io/getting-started/sections/atom-basics/#settings-and-preferences).

搜索驱动菜单可以完成任何 Atom 可以完成的重要任务。你可以按下 `Ctrl+Shift+p` 然后搜索命令，而不是点击所有的菜单按钮来查询命令。

![](http://flight-manual.atom.io/getting-started/images/command-palette.png)

你不仅可以搜索成千上万的命令，还可以看到与之绑定的快捷键。

### 偏好设置

你可以在设置中修改 Atom 的很多设置和偏好。

![](http://flight-manual.atom.io/getting-started/images/settings.png)

包括改变主题、文字、tab退格的数量、scroll的速度等。你也可以在这里安装新的插件和主题，它们都在 [Atom Packages](http://flight-manual.atom.io/using-atom/sections/atom-packages) 中。

你可以通过下面的方式打开设置面板：
- 使用 *Edit > preferences* 菜单项
- 在命令面板中搜索 `setting-view:open`
- 使用快捷键 `Ctrl+,`

#### 修改主题

设置界面中可以改变 Atom 的主题。Atom 有4个默认的UI主题，每个主题有8个语法主题。你可以在设置界面的侧边栏中选中 Themes 标签来修改当前主题和安装新的主题。

UI 主题控制如 tab 标签、树状视图等UI元素，语法主题用于编辑器中的文本高亮等。

还有很多主题在 [https://atom.io](https://atom.io/) 上。我们将在[Style Tweaks](http://flight-manual.atom.io/using-atom/sections/basic-customization)介绍自定义主题，并且在 [Creating a Theme](http://flight-manual.atom.io/hacking-atom/sections/creating-a-theme) 创建主题。

#### 自动换行

你可以在设置视图中指定个人的空白和换行偏好。

![](http://flight-manual.atom.io/getting-started/images/settings-wrap.png)

开启 `Soft Tabs` 将会在你按下 `Tab` 键的时候用空格取代实际的 tab字符。 `Tab Length` 指定用多少个空格替换 tab 字符，或者当禁用了 `Soft Tabs` 的时候一个 tab 具有多少个空格的宽度。

`Soft Wrap` 选项将超出当前窗口的文字换行。如果禁用了它，超出当前窗口的文字也会在同一行中显示，你就不得不通过滚动窗口来查看剩下的内容。If `Soft Wrap At Preferred Line Length` is toggled, the lines will wrap at 80 characters instead of the end of the screen. You can also change the default line length to a value other than 80 on this screen.

在[Basic Customization](http://flight-manual.atom.io/using-atom/sections/basic-customization/) 中我们将看到如何为不同文件类型设置不同的换行偏好（例如，你仅希望 Markdown 文件换行）。

### 文件的打开，修改，编辑

#### 打开文件

在 Atom 中有很多打开文件的方法。你可以通过菜单栏的 *File > Open* 按钮或者 `Ctrl+o` 从对话框中选择文件。

![](http://flight-manual.atom.io/getting-started/images/open-file.png)

这在打开一个不在当前项目中的文件或由于其它原因开启了一个新的窗口时非常方便。

另外，可以在命令行中使用 `atom` 命令。`atom` 和 `apm` 命令在[安装 Atom](http://flight-manual.atom.io/getting-started/sections/installing-atom/) 的时候自动被安装在了你的系统上。

你可以给 `atom` 命令传递一个或者多个需要打开的文件路径。

```shell
atom --help
Atom Editor v1.8.0

Usage: atom [options] [path ...]

One or more paths to files or folders may be specified. If there is an
existing Atom window that contains all of the given folders, the paths
will be opened in that window. Otherwise, they will be opened in a new
window.

...
```

如果你曾经或者现在经常使用命令行，那这个功能对你来说非常方便。输入 `atom [files]` 即可开始编辑文件。

#### 编辑和保存文件

Atom 里面编辑文件非常直接，没有特定的编辑模式或者核心命令。如果你更喜欢具有特定模式或者更复杂的命令，你可以看一下 [`Atom Packages List`](https://atom.io/packages)。它们给 Atom 提供了其它编辑风格。

保存文件：
- 通过菜单栏的 *File > Save*
- 通过快捷键 `Ctrl+S`

另存为：
- 通过菜单栏的 *File > Save As*
- 通过快捷键 `Ctrl+Shift+S`

保存所有：
- 通过菜单栏的 *File > Save All*

#### 打开文件夹

- 通过菜单栏的 *File > Open Folder*
- 通过命令 `atom [path1 path2 path3 ...]`

##### 添加文件夹

- 通过菜单栏 *File > Add Project Folder*
- 通过命令 `Ctrl+Shift+A`

如果打开的是 文件夹， Atom 会自动在侧边栏显示树状视图。

![](http://flight-manual.atom.io/getting-started/images/project-view.png)

树状视图允许你浏览和修改文件和目录结构：重命名、删除、创建新的文件等。

你还可以通过快捷键 `Ctro+\` 或者命令 `tree-view:toggle` 来隐藏或显示树状视图。 `Alt+\` 将会将焦点聚焦到树状视图上。当焦点在树状视图的时候，你可以通过 `A`，`M`，'Delete' 来添加、移动（也可以修改文件名，同Linux mv）、删除文件或文件夹。你还可以通过在树状视图的每一项上面点击鼠标右键来查看可以操作的选项。

```
Atom Packages

和 Atom 其它部分以一样， 树状视图不是编辑器内置功能，它是独立的包，只是默认与 Atom 捆绑在一起。与 Atom 捆绑的包称为核心包，没有与 Atom 绑定的包成为社区包（Community Packages）。

你可以在 [https://github.com/atom/tree-view](https://github.com/atom/tree-view) 查看树状视图的源码。

有趣的是，许多核心的特性实际上是一些与实现其它功能具有相同方式的包的实现。这意味着，如果你不喜欢树状视图，你可以自己实现那个功能并且完全替换原有的包。
```

#### 在项目中打开文件

一旦你在 Atom 中打开了一个项目，你可以轻松的找到和打开这个项目的任何文件。

快捷键 `Ctrl+T` 或者 `Ctrl+P` 会弹出模糊搜索框，你可以输入文件路径的一部分来快速查找文件。

![](http://flight-manual.atom.io/getting-started/images/finder.png)

你可以使用快捷键 `Ctrl+B` 在当前打开的文件中搜索（而不是在项目中所有文件中查找需要的文件）。它会查找你的 “缓存” 或者已经打开的文件。你还可以通过 `Ctrl+Shift+B` 来限制模糊搜索，这样搜索仅仅被限制在新创建的文件或者Git提交过后有新的修改的文件。

模糊搜索使用 `core.ignoredNames`，`fuzzy-finder.ignoredNames` 和 `core.excludeVCSIgnoredPaths` 配置来过滤出不应该显示的文件或文件夹。如果你的项目有一大堆你不想搜索出来的文件，你可以在这些配置或者[标准的 `.gitignore` 文件](https://git-scm.com/docs/gitignore)中添加对应的匹配模式或者路径。我们将会学到 [全局配置（Global Configuration Settings）](http://flight-manual.atom.io/using-atom/sections/basic-customization/#global-configuration-settings) 中更多的配置项的设置，但是现在你可以轻松的在设置视图中设置它们。

`core.ignoredNames` 和 `fuzzy-finder.ignoredNames` 被当作 glob匹配模式 通过 [minimatch](https://github.com/isaacs/minimatch) 这个 Node 模块进行解释。


##### Configuration Setting Notation

有时候你看到我们像 "Ignored Names in COre Settings" 这样的拼写来指代配置，另一些时候你看到我们使用如 `core.ignoredNames` 这样的速记名，它们其实都是指同一个东西。速记的写法是包名（包名使用速记写法），然后一个`.`（点号）跟在设置的驼峰命名后面。

如果你想要使用驼峰命名，遵循以下步骤：
- 第一个单词（不是首字母）小写
- 其它单词的首字母大写
- 删除空格

所以 "Ignored Names" 变成了 "ignoredNames"

# 第二章

既然我们已经了解了 Atom 的基础，那让我们开始挖掘 Atom 无限的潜力吧。本章我们将回学到如何查找和安装新的包来给 Atom 赋予更多的功能，如何查找和安装新的主题，如何以更高级的方式处理文本、如何按照自己的想法定制编辑器 以及如何配合 Git 版本控制器一起使用等。

到本章末尾，你将有一个舒适的自定义的编辑环境，而且你能够像高手一样改变、创建、删除等操作文本。

## Atom Packages（插件包）

本章我们从 Atom 的 package 系统开始。如前面提到的，Atom 本身只是一个捆绑了一些有用的包来为它增加新的如树状视图和设置视图功能的一个核心。
