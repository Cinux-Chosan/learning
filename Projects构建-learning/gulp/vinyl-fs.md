# vinyl-fs

vinyl-fs 是一个用于描述文件的元对象，当谈起一个文件的时候，最先想到的是文件的路径 (path) 和文件的内容 (contents)，它们都是Vinyl对象的主要属性。文件并不一定是本地文件系统的一部分，它可以是S3, FTP, Dropbox, Box, CloudThingly.io 或者其它服务。 Vinyl 可以用于描述所有这些资源上的文件。

## Vinyl Adapter
虽然Vinyl提供了一个简洁的方式来描述一个文件，但是我们还是需要首先能够访问这些文件。每个文件资源都需要一个 Vinyl adapter，它包含 `src(globs)` 和 `dest(folder)` 方法，这两个方法都返回 stream。
