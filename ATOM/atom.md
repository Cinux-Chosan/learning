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

你还可以通过快捷键 `Ctrl+\` 或者命令 `tree-view:toggle` 来隐藏或显示树状视图。 `Alt+\` 将会将焦点聚焦到树状视图上。当焦点在树状视图的时候，你可以通过 `A`，`M`，'Delete' 来添加、移动（也可以修改文件名，同Linux mv）、删除文件或文件夹。你还可以通过在树状视图的每一项上面点击鼠标右键来查看可以操作的选项。

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

实际上， Atom 默认包使用了超过 90 个包，它们包含了 Atom 的所有功能。例如，首次启动 Atom 时候的 [开始界面](https://github.com/atom/welcome)， [拼写检查](https://github.com/atom/spell-check)，[主题](https://github.com/atom/one-dark-ui)，[糢糊查询](https://github.com/atom/fuzzy-finder)等包都是保持独立的，并且它们都使用相同的 API，这些 API 可以在 [Hacking Atom](http://flight-manual.atom.io/hacking-atom/) 中查看，并且是任何人都可以使用的。

这意味着这些包可以无比强大，可以改变从整个界面的外观到每一个核心功能的基本操作接口。

可以在设置视图（`Ctrl+,`）中的 install 标签安装新的包。

所有罗列出的包都已经发布到 Atom 官方的包托管仓库 [http://atom.io/packages](http://atom.io/packages)，在设置视图中搜索包的时候会去请求 Atom 的托管仓库，并拉取到匹配的选项的信息。

![](http://flight-manual.atom.io/using-atom/images/packages-install.png)

所有罗列出的包都有一个安装按钮，点击它就会自动下载和安装这个包，完成以后你的编辑器就有了这个包提供的功能。

### 包设置

一旦包被安装到了 Atom，它就会显示在设置视图的 “Packages” 标签栏，并且与 Atom 预装的包区别开。如果要查找一个包，可以直接在 “Packages” 标签栏的 “Installed Packages” 标题下面输入。

![](http://flight-manual.atom.io/using-atom/images/package-specific-settings.png)

点击包的 "Settings" 按钮将会展示包的设置界面，你可以在这里有选择性的改变包的默认变量、查看快捷键、临时禁用该包、查看源码、查看包版本号、报告错误或者卸载该包。

如果某一个包有更新， Atom 会自动检测到它，你可以在包的设置界面或者 "Updates" 标签栏更新它。

### Atom 主题

你可以在设置界面查找和安装新的主题。不管是 UI 主题还是 语法主题你都可以像搜索新的包一样在 "Install" 标签页查找。确保切换到设置界面中 “Install” 标签界面中的 “Themes” 。

![](http://flight-manual.atom.io/using-atom/images/themes.png)

点击主题的标题会被引导到 atom.io 上面的简介页面，该页面一般都有一个主题的截图，你可以看到安装过后的插件会带来什么样的变化。

点击 "install" 将会安装该主题，安装好之后你就可以在设置界面的主题下拉框中选择该主题了。

![](http://flight-manual.atom.io/using-atom/images/unity-theme.png)

### 命令行

你也可以从命令行安装包或者主题，使用命令 `apm`

在控制它输入以下命令来检查是否安装了 `apm` 命令。

`apm help install`

如果没有，你可以查看[如何安装 atom 和 apm](http://flight-manual.atom.io/getting-started/sections/installing-atom)

你也可以使用 `apm install` 来安装包：

- `apm install <包名>` 来安装最新的包
- `apm install <包名>@<包版本号>` 来安装指定版本的包

例如 `apm install emmet@0.1.5` 来安装 0.1.5 版本的[Emmet](https://github.com/atom/emmet)。

你也可以时使用 `apm` 来查找新的包。使用命令 `apm search <包名>`

`apm search coffee`

```
Search Results For 'coffee' (29)
├── build-coffee Atom Build provider for coffee, compiles CoffeeScript (1160 downloads, 2 stars)
├── scallahan-coffee-syntax A coffee inspired theme from the guys over at S.CALLAHAN (183 downloads, 0 stars)
├── coffee-paste Copy/Paste As : Js ➤ Coffee / Coffee ➤ Js (902 downloads, 4 stars)
├── atom-coffee-repl Coffee REPL for Atom Editor (894 downloads, 2 stars)
├── coffee-navigator Code navigation panel for Coffee Script (3493 downloads, 22 stars)
...
├── language-iced-coffeescript Iced coffeescript for atom (202 downloads, 1 star)
└── slontech-syntax Dark theme for web developers ( HTML, CSS/LESS, PHP, MYSQL, javascript, AJAX, coffee, JSON ) (2018 downloads, 3 stars)
```

使用 `apm view` 命令来查看某个包的详情：

`apm view build-coffee`

```

build-coffee
├── 0.6.4
├── https://github.com/idleberg/atom-build-coffee
├── Atom Build provider for coffee, compiles CoffeeScript
├── 1152 downloads
└── 2 stars
>
Run `apm install build-coffee` to install this package.
```

## Atom 中移动

尽管在 Atom 中使用鼠标或者键盘上的方向键来移动界面非常方便，但是 Atom 中还有一些快捷键可以让你手不离开键盘就可以更快的定位到某个字符。

Atom 支持所有标准的 Linux光标移动组合键。使用上下左右键来将光标移动单个字符。

除此之外，还有下面一些键可以使用：

- `Ctrl+Left` 移动到单词的开始
- `Ctrl+Right` 移动到单词的末尾
- `Home` 移动到当前行的开始
- `End` 移动到当前行的末尾
- `Ctrl+Home` 移动到文件开始
- `Ctrl+End` 移动到文件末尾

你还可以使用 `Ctrl+G` 移动到某一行或者某列，该组合键键会弹出一个对话框，输入 `行:列` 这样格式的字符来让 Atom 跳到对应的行或者列。

![](http://flight-manual.atom.io/using-atom/images/goto.png)

### [Navigating by Symbols](http://flight-manual.atom.io/using-atom/sections/moving-in-atom/#navigating-by-symbols)

### 书签

Atom 还有一个很实用的功能。你可以给项目文件中的某一行保存书签，这样你就可以快速的跳转到那你。

如果你按 `Ctrl+Shift+F2`，Atom 会在当前行标记或取消标记该行，标记为书签的行会在行的开始显示一个小的书签标记（就像下图的 22 行）。你可以给项目中比较重要的行设置书签，然后在需要的时候快速找到它们。

如果你按 `F2`， Atom 会跳到当前焦点界面的下一个书签的位置。如果按 `Shift+F2` 则会在它们之间循环。

你可以使用 `Ctrl+F2` 来查看项目中所有的书签，选中它们进行跳转。

![](http://flight-manual.atom.io/using-atom/images/bookmarks.png)

书签功能来自于 [bookmarks](https://github.com/atom/bookmarks) 包。

## Atom 选词

## 编辑和删除文本

到这里相信大家已经知道如何在 Atom 中选择文件的某个区域了，现在来修改文件。尽管可以用鼠标选中直接输入文本，不过下面将要介绍一些更加方便的方法来操作文本。

### 基本操作

有一些快捷键来慢速基本的本文操作。包括移动行、多行改变。

- `Ctrl+J` 将下一行拼接在当前行末尾
- `Ctrl+Up/Down` 将当前行上移/下移
- `Ctrl+Shift+D` 直接复制当前行（或选中的多行）到下一行
- `Ctrl+K``Ctrl+U` 当前单词转换成大写
- `Ctrl+K``Ctrl+L` 当前单词转换为小写

Atom 还有一个内置的功能，它能够将基于指定的行最大长度当前段落的换行机制改编成 "hard-wrap" 模式。你可以使用 `Alt+Ctrl+Q` 来将当前选中内容的每行格式化为不超过 80 个字符（或者其它 `editor.preferredLineLength` 定义的其它数字）。如果没有选择任何东西，则当前段落将会回流（ If nothing is selected, the current paragraph will be reflowed.）。

### 删除和剪切

你还可以通过一些快捷方式删除或剪切缓冲区中的文本。

- `Ctrl+Shift+K` 删除当前行
- `Ctrl+Backspace` 删除光标到当前单词开始
- `Ctrl+Delete` 删除光标到当前单词末尾

### 多个光标

- `Ctrl+鼠标点击` 在鼠标点击处添加一个光标
- `Alt+Shift+Up/Down` 在当前光标上面或者下面添加一个光标
- `Ctrl+D` 选中光标所在单词的单词，或追加选中与当前单词相同的下一个单词
- `Alt+F3` 选择所有与当前单词相同的单词

有了这些命令，你就可以在多行、多处放置光标，并一次性执行相同的命令。

![](http://flight-manual.atom.io/using-atom/images/multiple-cursors.gif)

### 空白

Atom 默认带有一些命令来帮助你处理文档中的空白字符。如果你的文档有混合的空白字符（空格和Tab），这些命令可以让你将文件的空白字符统一化。这些命令没有快捷键，所以你需要使用命令来执行它们，使用 `Ctrl+Shift+p` 打开命令对话框，输入 “Convert Spaces to Tabs” 或者 “Convert Tabs to Spaces”。

该命令由包 [atom/whitespace](https://github.com/atom/whitespace) 实现。命令的设置在包 `whitespace` 的管理页面。

![](http://flight-manual.atom.io/using-atom/images/whitespace.png)

`Remove Trailing Whitespace（移除末尾空白字符）` 默认开启。这样的话每次在保存文件的时候，都会去除文件中所有尾随的空格字符。如果你希望禁用该项，可以去 `whitespace`包 的设置界面设置。

Atom 也会确保文件的最后有一行新的空白行，你也可以在 `whitespace` 界面设置。

### 括号

Atom 可以很简单和智能的处理括号。

默认情况下，光标在 `[]` `()` `{}` 的时候它们会高亮，也会高亮匹配的 XML 或者 HTML 标签对。

Atom 将回自动补齐 `[]`, `()`, `{}`, `""`, `''`, `“”`, `‘’`, `«»`, `‹›`。

有一些与括号相关的命令：

- `Ctrl+M` 跳到与当前光标所在括号匹配的另一半，如果光标不在括号旁，则将光标跳到最近的一个开括号处。
- `Alt+Ctrl+M` 选择所有当前括号内的文字
- `Alt+Ctrl+.` 关闭当前 XML/HTML 标签

括号的功能是包 [bracket-matcher](https://github.com/atom/bracket-matcher)提供。

### 编码

Atom 提供了一些基本的文件编码。

- `Alt+U` 改变文件编码

点击 Atom 底部的 "UTF-8" 也可以选择文件编码。

打开文件的时候，Atom 会自动检测文件的类型，如果 Atom 不确定文件类型，则默认选择 UFT-8 编码，这也是新文件的编码。

![](http://flight-manual.atom.io/using-atom/images/encodings.png)

编码选择功能由包 [encoding-selector](https://github.com/atom/encoding-selector) 提供。

## 查找和替换

- `Ctrl+F` 在缓冲区搜索
- `Ctrl+Shift+F` 在整个项目搜索（全局搜索）

不管是在缓冲区搜索还是整个项目搜索，都会弹出搜索面板。

![](http://flight-manual.atom.io/using-atom/images/find-replace-file.png)

使用 `Ctrl+F` 在当前页面搜索的时候, 输入希望查找的字符, 然后按 `Enter`（回车）即可查找，或者按 `F3` 查找下一个。 搜索面板的也包含了时候大小写敏感、正则表达式匹配、选择搜索范围等。

如果需要替换匹配的项，在 `Replace` 输入框输入需要替换的文本，然后选择替换/替换所有。

使用正则表达式搜索的时候，使用 $1、$2、$3、$n 来访问搜索的组（group）。

你还可以使用 `Ctrl+Shift+F` 来在整个项目中搜索。

![](http://flight-manual.atom.io/using-atom/images/find-replace-project.png)

使用全局搜索的时候，你可以在 "File/Directory pattern" 框中输入 [glob pattern](http://en.wikipedia.org/wiki/Glob_%28programming%29) 来限制搜索的文件。例如，模式 `src/*.js` 将搜索限制在 `scr` 目录下面的所有后缀为 `.js` 的文件中。"Globstar" 模式符号 `**` 可以用于目录的递归，即任意深层级的目录。 例如 `docs/**/*.md` 将回匹配 `docs/a/foo.md`、`docs/a/b/foo.md` 或更深层级的目录中。

当你打开了多个项目目录时，该特性也可以用于将搜索限制在某一个目录中。例如，你打开了 `/path1/folder1` 和 `/path2/folder2`， 你可以输入模式 `folder1` 来将搜索限制在 folder1 中。

按 `Esc` 退出搜索面板。

搜索和替换功能由包 [find-and-replace](https://github.com/atom/find-and-replace) 实现， 使用了 Node 模块 [scandal](https://github.com/atom/scandal)。

## [Snippets](http://flight-manual.atom.io/using-atom/sections/snippets/)

片段可以快速的生成需要的代码片段。

例如你输入 `habtm` 然后按下 `Tab` 键，自动生成了 `has_and_belongs_to_many`。

有很多核心或者社区包可以用来完成这样的操作。如 `language-html` 包提供了 HTML 语法高亮和帮助你生成多种多样的 HTML 标签。 你输入 `html` 按下 `Tab` 键会得到展开的代码：

```HTML
<html>
  <head>
    <title></title>
  </head>
  <body>

  </body>
</html>
```

并且它还会将光标移动到 `title` 标签中间。许多片段有多个光标焦点，你可以使用 `Tab` 键将光标移动到下一个标签中将，如输入完成 `title` 过后，按 `Tab` 将会跳到 `body` 中间。

可以通过在命令面板中输入 `Snippets: Available` 来查看当前文件支持哪些片段。并且在结果中糢糊搜索你需要的片段。

![](http://flight-manual.atom.io/using-atom/images/snippets.png)

### 创建自己的片段

在 `~/.atom` 目录下面有一个叫 `snippets.cson` 的文件，它包含了所有在启动 Atom 的时候需要加载的自定义片段。可以通过 Atom 的菜单打开该文件： *Edit > Snippets*

#### 片段的格式

基本格式如下：

```JSON
'.source.js':
  'console.log':
    'prefix': 'log'
    'body': 'console.log(${1:"crash"});$2'
```

最左边的键（key）是决定这些片段在哪里可用的选择器。最简单的方式就是去某个语言的包查看 Scope 属性值。如 js 就到 `languiage-javascript` 包里面查看，javascript 就到 `languiage-java` 中查看。

例如，如果想添加一些 java 片段，可以在设置视图里面进入 `languiage-java` 包，我们可以看到 Scope 是 `source.java`，这片段的顶级键将会在该名字前面添加一个点号`.`（就像 CSS 类的选择器）。

![](http://flight-manual.atom.io/using-atom/images/snippet-scope.png)

因为 javascript 的 Scope 是 `source.js` ，所以上面的 JSON 例子是 `.scource.js`。

片段的第二级键是片段名。它用于在片段菜单中用更加可读的方式描述片段（在还没有展开片段的时候，该字段作为注释显示给用户看）。你可以将它定义为任意你想的名字。

片段中 `prefix` 字段是触发该片段的缩写，`body` 字段为展开后的内容格式，例如 prefix 是 "log1"，则输入 log1然后按下 tab 键就会展开成 `body` 字段的内容。

每个后面接了个数字的 `$` 符号是 `Tab` 键停留的位置。 在片段已经展开过后按 tab 键将会在 tab 停留位置循环。如果数字相同，则会同时存在多个光标。

上面的例子，使用 `log` 将会展开成

```js
console.log("crash");
```

“crash” 将会在展开的时候被选中，再次按 tab 键将会将光标移动到 `;` 之后。

片段的键（key），与 CSS 选择器不同，它仅每级仅可重复一次。如果统一级有多个键，则只有最后一个将会被读取。更多信息参考[CSON配置](http://flight-manual.atom.io/using-atom/sections/basic-customization/#configuring-with-cson)

### 具有多行的片段

你可以使用 [CoffeeScript 多行语法] `"""` 来定义：

```JSON
'.source.js':
  'if, else if, else':
    'prefix': 'ieie'
    'body': """
      if (${1:true}) {
        $2
      } else if (${3:false}) {
        $4
      } else {
        $5
      }
    """
```

可能正如你说想的，还有一个用于在定义片段的文件中创建片段的片段。你大开一个定义片段的文件，输入 `snip` 然后按 `Tab` 键，你将得到一个片段的格式：

```JSON
'.source.js':
  'Snippet Name':
    'prefix': 'hello'
    'body': 'Hello World!'
```

然后就可以像编辑其它片段一样编辑里面的内容了。当你保存这个文件的时候，Atom 会重新载入片段，然后你马上就可以使用它了。

### 每个源定义多个片段

想在`snippets.cson`文件中同一个范围定义多个片段，只需要另起一行将下一个片段的定义写在上一个后面即可。为了可读性，可以隔一行。

``` JSON
'.text.md':
  'Hello World':
    'prefix': 'hewo'
    'body': 'Hello World!'

  'Github Hello':
    'prefix': 'gihe'
    'body': 'Octocat says Hi!'

  'Octocat Image Link':
    'prefix': 'octopic'
    'body': '![GitHub Octocat](https://assets-cdn.github.com/images/modules/logos_page/Octocat.png)'
```

### 更多信息

snippets 功能由包 [snippets](https://github.com/atom/snippets) 实现。

如果要获取更多示例，查看 [language-html](https://github.com/atom/language-html/blob/master/snippets/language-html.cson) [languiage-javascript](https://github.com/atom/language-javascript/blob/master/snippets/language-javascript.cson)。

## 自动补全

如果你仍然希望节约一些打字时间，atom 还提供了一些自动补全功能。

自动补全功能使用 `Tab` 键或者 `Enter` 键。

![](http://flight-manual.atom.io/using-atom/images/autocomplete.png)

默认情况下， 自动补全会检查当前文件的匹配字符串来确定如何补全。

如果你希望更多的选项，可以使用 autocomplete-plus 包，它可以设置在打开的缓存中查找，而不是在当前文件中。

自动补全功能由 [autocomplete-plus](https://github.com/atom/autocomplete-plus) 提供。

## 代码折叠

如果你想看看当前代码的结构，那么折叠代码将会非常有用。折叠隐藏代码块，如函数或循环块，以简化屏幕上的内容。

你可以通过点击代码块最前面的排版线上的箭头来折叠/展开当前代码块。你也可以使用快捷键 `Alt+Ctrl+[` 来折叠代码，使用 `Alt+Ctrl+]` 来展开代码。

![](http://flight-manual.atom.io/using-atom/images/folding.png)

使用 `Alt+Ctrl+Shift+[` 折叠所有代码，使用 `Alt+Ctrl+Shift+]` 展开所有代码。你也可以以使用 `Ctrl+K`然后再按 `Ctrl+[0-9]` 来指定折叠第几层级的代码。如 `Ctrl+K`配合 `Ctrl+1` 将折叠第一层级代码，即第一个可以被折叠的层级，越往折叠块里面，层级越高。 0 层级展开所有代码。

最后，你可以通过选择一个任意一个区域，然后按 `Alt+Ctrl+F` 或者在命令面板输入 `Fold Selection` 来折叠任意区域。

## 窗格

你可以通过使用快捷键 `Ctrl+K` `Up/Down/Left/Right`（后面没有Ctrl）来水平或者垂直切分当前编辑面板。方向键的方向就是分割的方向。一旦你切分了一个窗格，你就可以使用 `Ctrl+K` `Ctrl+Up/Down/Left/Right` 来切换窗格。方向键的方向就是将要移动到的窗格的方向。

![](http://flight-manual.atom.io/using-atom/images/panes.png)

每个面板有自己的 “面板项”，即上面的标签，你可以通过鼠标拖拽将一个面板的文件拖到另一个面板中。

如果你不喜欢使用标签，你也可以不必要使用它。你可以在包 [tab](https://github.com/atom/tabs) 中禁用它，禁用过后每个面板仍然支持多个面板项。只是你没有可以点击的标签了。

可以通过 `Ctrl+W` 来关闭面板。你可以在设置视图中的 "Core Settings" 里面设置 "Remove Empty Panes" 来当面板中没有打开的文件的时候自动关闭该面板。

## 挂起的文件

挂起的文件是之前的 “预览标签”。

当你在文件树中鼠标单击一个文件的时候，它将会以一个新标签打开，标签标题为斜体。这表明文件处于 “挂起” 状态。当一个文件处于挂起状态时，它将会被下一个打开的 “挂起” 文件取代。这种挂起的文件允许你点开很多文件来查找信息而不用回过来一个一个关闭它们。

如果要将挂起的文件变成确认状态，以下之一都可以做到：

- 双击标签
- 双击树状图中的文件
- 编辑文件
- 保存文件

你也可以通过双击打开一个文件，这样它就是一个确认状态的文件。

### 禁用挂起文件

![](http://flight-manual.atom.io/using-atom/images/allow-pending-pane-items.png)

如果你不喜欢在打开的文件标签中有这种挂起的文件，你可以在`Core Settings` 里面取消选中 `Allow Pending Pane items` 选项。禁用了过后，在文件树中单击文件将不会打开这个文件，你必须双击打开它。

## 语法

文件的语法是 Atom 与之进行关联的语言。语法的类型包括 Java、C 等编程语言 或者 GitHub-Flavored Markdown。在使用文件片段的时候，我们会使用这个类型。

当你加载一个文件的时候， Atom 会额外的去确认文件类型。很大程度上是通过文件的扩展名来确定的，但是也有的情况需要检查一下文件内容才能够确定。

当你打开一个文件的时候， 如果Atom 不能决定文件的语法，则默认是 “Plain Text”，它是最简单的类型。如果该文件不能以 “Plain Text” 作为默认值，为文件选择了一个错误的语法或者如果由于其它原因你希望改变它的语法，你可以使用 `Ctrl+Shift+L` 来打开语法选择器。

![](http://flight-manual.atom.io/using-atom/images/grammar.png)

当文件的语法改变的时候，Atom 将会在当前会话记住文件的改变。

语法选择器由包 [grammar-selector](https://github.com/atom/grammar-selector) 实现。

## Atom 中的版本控制系统

版本控制系统是所有项目的一个重要的部分。Atom 内置了基本的 Git 和 GitHub 功能整合。

项目的根目录必须是一个 git 仓库才能在 Atom 中使用版本控制系统。

### checkout HEAD version

快捷键 `Alt+Ctrl+Z` 会在编辑器中检出当前文件的 `HEAD` 版本。

这是一个比较快捷的丢弃当前文件从 `HEAD` 提交以后的变化，将文件重置到 `HEAD` 提交的时候的内容。 相当于在命令行运行该文件 path 的 `git checkout HEAD -- <path>` 和 `git reset HEAD -- <path>`。

![](http://flight-manual.atom.io/using-atom/images/git-checkout-head.gif)

该命令将进入撤销堆栈，你可以使用 `Ctrl+Z` 来恢复之前的内容。

### [Git status list](http://flight-manual.atom.io/using-atom/sections/version-control-in-atom/#git-status-list)
