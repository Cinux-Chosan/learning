# Ember-cli 注意点

Ember CLI’s runtime is configurable via a file named `.ember-cli`. The JSON-formatted file, which must be placed in your home directory, can include any command-line options whose names must be in camel case form. For example:

Ember CLI 通过 `.ember-cli` 文件来配置运行时参数。它使用 JSON 格式，并需要被放在根目录中， 它可以包含任意命令行选项， 但是名字必须是驼峰写法。 例如：

```json
# ~/.ember-cli
{
  "skipGit" : true,
  "port" : 999,
  "host" : "0.1.0.1",
  "liveReload" : true,
  "environment" : "mock-development",
  "checkForUpdates" : false
}
```