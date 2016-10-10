# Configuring Ember.js

## Configuring Your App
- 配置文件为 config/environment
- 在该配置文件内可以为每个环境（development、production、test）定义 ENV 对象。
- ENV 中包含如下三个部分：
> EmberENV: EmberENV can be used to define Ember feature flags (see the Feature Flags guide).

> APP: APP can be used to pass flags/options to your application instance.

> environment: environment contains the name of the current environment (development,production or test).

- 访问 ENV 变量： 通过 import ENV from 'your-application-name/config/environment'; 引入即可。

## Configuring Ember CLI
- .ember-cli 文件包含了ember-cli的配置信息，其中的大部分参数可以通过命令行的形式传入，如：
         // 命令行中
        ember server --port 8080
         // 等同于 .ember-cli 中
        {
          "port": 8080
        }
