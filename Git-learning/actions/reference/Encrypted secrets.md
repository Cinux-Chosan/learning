# Encrypted secrets

Encrypted secrets 使得你可以在组织、仓库、或者仓库环境中存放一些敏感数据。


## About encrypted secrets

secrets 是你在组织、仓库或者仓库环境中创建的加密的环境变量。它可以在 workflow 中使用。github 使用 [libsodium sealed box](https://libsodium.gitbook.io/doc/public-key_cryptography/sealed_boxes) 来确保 secrets 在到达 github 之前被加密并且一直保持加密直到你在 workflow 中使用它。

对于 organization secrets，你可以通过访问策略来控制哪个仓库能够使用到它。organization secret 可以让你在多个仓库中共享这些数据，从而减少重复创建 secrets，并且能够统一修改。

对于 environment secrets，你能够开启必要的审批机制来控制对 secrets 的访问。如果没有得到允许，workflow job 是无法访问环境 secrets 的。

### secrets 命名

- 名字只能包含字母、数字或下划线
- 名字不能以 `GITHUB_` 前缀打头
- 名字不能以数字打头
- 大小写不敏感
- 同一级别的 secrets 名字不能重复，如果多个级别的 secrets 具有相同名称，则较低级别的 secrets 优先级更高。例如organization secret 优先级低于仓库级别的 secret。同样，如果组织机构、仓库和环境都有同名 secret，则环境级别的优先级更高。

To help ensure that GitHub redacts your secret in logs, avoid using structured data as the values of secrets. For example, avoid creating secrets that contain JSON or encoded Git blobs.

### Accessing your secrets

为了能够在 action 中使用 secret，你需要在 workflow 中将 secret 当做输入或者环境变量。查看 action 的 README 文件来查看 action 需要的输入和环境变量。更多信息参考 [Workflow syntax for GitHub Actions](https://docs.github.com/en/articles/workflow-syntax-for-github-actions/#jobsjob_idstepsenv)

如果你能访问 workflow 文件也可以直接从其中获取信息，更多信息参考 [Access permissions on GitHub](https://docs.github.com/en/github/getting-started-with-github/access-permissions-on-github)

            Warning: GitHub automatically redacts secrets printed to the log, but you should avoid printing secrets to the log intentionally.


organization secret 和 repository secret 会在 workflow 被列队运行时读取。environment secret 在 job 引用环境之初被读取。

你也可以使用 REST API 来管理 secret，参考 [Secrets](https://docs.github.com/en/rest/reference/actions#secrets)

### Limiting credential permissions

当创建凭证的时候，我们建议你尽可能小的授权。例如，使用 [deploy keys](https://docs.github.com/en/developers/overview/managing-deploy-keys#deploy-keys) 或者一个 service 账户而不是用个人凭证。能只读的就不要授权可修改权限。如果非要创建 PAT（personal access token）也选择尽可能小的授权范围。

## Creating encrypted secrets for a repository

你必须是仓库的所有者才能创建仓库 secret。

你必须有 `admin` 权限才能创建 organization secret。

1. 在 github 中导航到仓库主页
2. 在仓库名称下面点击 `Settings`
3. 在左侧边栏点击 `Secrets`
4. 点击 `New repository secret`
5. 输入名称和值
6. 点击 `Add secret`

如果仓库有 environment secret 或者能够访问父级机构的 secret，则这些 secret 也会罗列在此。

## Creating encrypted secrets for an environment

如果你是仓库的所有者，你可以在仓库中创建 environment secret。

如果你有机构的 `admin` 权限，你可以在机构仓库中创建 environment secret。

1. 前往仓库主页
2. 点击 `Settings`
3. 点击左侧 `Environments`
4. 点击你希望添加 secret 的环境
5. 在 `Environment secrets` 下面点击 `Add secret`
6. 输入名称和值
7. 点击 `Add secret`

## Creating encrypted secrets for an organization

当创建 organization secret 的时候，你可以使用策略来限制哪些仓库可以访问该 secret。例如，你可以授权所有的仓库都可以访问、仅私有仓库可以访问或者指定一个仓库列表。

你必须拥有机构 `admin` 权限才能创建 organization secret：

1. 在 github 中导航到机构主页
2. 在机构名称下面点击 `Settings`
3. 点击左侧的 `Secrets`
4. 点击 `New organization secret`
5. 输入名称和值
6. 从 `Repository access` 下拉列表中选择一个访问策略
7. 点击 `Add secret`
   
## Reviewing access to organization-level secrets

你可以通过以下步骤检查在你的机构中的 secret 应用了哪些访问策略：

1. 导航到机构主页
2. 在机构名称下面点击 `Settings`
3. 点击左侧的 `Secrets`
4. 呈现的列表中包含了任何权限和策略
5. 对于每个 secret 的策略详细内容可以点击 `Update`
   
## Using encrypted secrets in a workflow

除了 `GITHUB_TOKEN` 之外，fork 仓库中的 workflow 被触发时 runner 不会收到 secret。

在 action 中你可以使用 `secrets` 上下文来访问仓库中的 secret 作为输入或环境变量。更多信息参考 [Context and expression syntax for GitHub Actions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions) 和 [Workflow syntax for GitHub Actions](https://docs.github.com/en/github/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions)

```yml
steps:
  - name: Hello world action
    with: # Set the secret as an input
      super_secret: ${{ secrets.SuperSecret }}
    env: # Or as an environment variable
      super_secret: ${{ secrets.SuperSecret }}
```

尽可能避免通过命令行传递 secret。命令行可能对其它用户也可见（如使用 `ps` 命令）或者被 [`security audit events`](https://docs.microsoft.com/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing) 捕捉到。将其作为环境变量、`STDIN` 或者目标程序支持的其它方式将有助于保护 secret。

如果你必须通过命令行来传递 secret，则需要使用对应的引用规则。secret 经常可能包含一些影响 shell 的特殊字符，因此需要对环境变量使用引号进行转义：

### Example using Bash

```yml
steps:
  - shell: bash
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$SUPER_SECRET"
```

### Example using PowerShell

```yml
steps:
  - shell: pwsh
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$env:SUPER_SECRET"
```

### Example using Cmd.exe

```yml
steps:
  - shell: cmd
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "%SUPER_SECRET%"
```

## Limits for secrets

每个机构可以存放 1000 个 secret，仓库可以存放 100 个 secret，每个环境可以存放 100 个 secret。

因此一个 workflow 最多可以使用 100 个 organization secret 和 100 个 repository secret。此外，一个 job 最多引用 100 个 environment secret。

secret 的限制是 64 KB。如果超过 64 KB 则可以将加密后的 secret 存放到仓库中，然后将解密秘钥作为 secret 存放在 github 上。例如，你可以在将文件加入到 git 之前使用 `gpg` 来在本地加密凭证。更多信息参考 [gpg manpage](https://www.gnupg.org/gph/de/manual/r1023.html)

            Warning: Be careful that your secrets do not get printed when your action runs. When using this workaround, GitHub does not redact secrets that are printed in logs.

1. 使用 `gpg` 和 `AES256` 对 `my_secret.json` 进行加密：`$ gpg --symmetric --cipher-algo AES256 my_secret.json`
2. 然后会提示你输入解密短语，你需要记住这个短语，因为之后要将它加入到 secret 中
3. 使用上一步的解密短语创建一个 secret，例如叫 `LARGE_SECRET_PASSPHRASE`
4. 将加密后的文件加入的 git 仓库中，在本例中加密文件是 `my_secret.json.gpg`
5. 创建一个解密的 shell 脚本，例如叫它 `decrypt_secret.sh`

    ```sh
    #!/bin/sh

    # Decrypt the file
    mkdir $HOME/secrets
    # --batch to prevent interactive command
    # --yes to assume "yes" for questions
    gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
    --output $HOME/secrets/my_secret.json my_secret.json.gpg
    ```

6. 在将 shell 加入到 git 仓库之前确认它是可以工作的：

    ```sh
    $ chmod +x decrypt_secret.sh
    $ git add decrypt_secret.sh
    $ git commit -m "Add new decryption script"
    $ git push
    ```

7. 在 workflow 中使用一个 step 来调用该 shell 脚本并解码 secret。为了在 workflow 运行的环境中使用仓库代码，则需要使用 [`actions/checkout`](https://github.com/actions/checkout) action 来拷贝一份仓库代码。使用 `run` 命令来执行 shell：

    ```yml
    name: Workflows with large secrets

    on: push

    jobs:
    my-job:
        name: My Job
        runs-on: ubuntu-latest
        steps:
        - uses: actions/checkout@v2
        - name: Decrypt large secret
            run: ./.github/scripts/decrypt_secret.sh
            env:
            LARGE_SECRET_PASSPHRASE: ${{ secrets.LARGE_SECRET_PASSPHRASE }}
        # This command is just an example to show your secret being printed
        # Ensure you remove any print statements of your secrets. GitHub does
        # not hide secrets that use this workaround.
        - name: Test printing your secret (Remove this step in production)
            run: cat $HOME/secrets/my_secret.json
    ```