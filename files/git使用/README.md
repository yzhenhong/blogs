## 下载安装

### Git

官网下载链接：https://git-scm.com/downloads

安装教程：https://blog.csdn.net/mukes/article/details/115693833

### tortoiseGit

下载地址：https://download.tortoisegit.org/tgit/

https://tortoisesvn.net/downloads.html

安装教程：https://www.cnblogs.com/xiuxingzhe/p/9312929.html



## 配置

### Git全局设置

- GitHub或Gitee官网上注册一个账号，注册好后，桌面右键选择Git Bash，进行账号配置，命令如下：

- 设置用户名

git config --global user.name  "marco"

-  设置邮箱

git config --global user.email "736647835@qq.com"      


- 执行完以上命令后，可用: git config --list 查看是否配置成功。
git config --list

- 生成SSH密钥: ssh-keygen -t rsa -C "736647835@qq.com" 或者: ssh-keygen -t rsa (按3个回车，密码为空。)
ssh-keygen -t rsa

- 执行完后到系统盘users目录(win: C:\Users\你的用户名\.ssh\），查看生成的ssh文件：

- 将公钥（ id_rsa.pub），添加到Github的SSH keys中


### git设置代理
git config --global http.proxy http://10.10.10.10:8080 
- 如果需要用户名密码的话，则设置：(其中 user 和 password 分别为你的用户名和密码。)
git config –global http.proxy http://user:password@http://10.10.10.10:8080 
- 设置完成后，可以通过如下命令来查看设置是否生效：
git config –get –global http.proxy
- 如果需要删除代理设置，那么可以使用：
git config --system (或 --global 或 --local) --unset http.proxy

PS：有些同学可能使用的 Git 的客户端，比如界面很上流的 Github for Windows，里面可能并没有代理设置的选项，不过别着急，这些客户端一般在底层都是调用的命令行工具，所以同样按照上述步骤进行设置即可。


## 分支
- 查看分支
git branch
- 新建分支dev
git branch dev
- 切换分支至dev进行操作
git checkout dev
- 创建分支dev并且切换到该分支操作
git checkout -b dev
- 合并分支代码(需要先切换到合并的分支，然后merge源分支‘需要被合并过来的分支代码’)
git merge '需要被合并过来的分支代码'
- 推送分支至远程仓库 -u参数与--set-upstream这一串是一个意思，所以用-u就好了。(git push --set-upstream  origin dev)
git push -u origin dev


## tag
- 创建tag
git tag v1.0
- 创建带注释tag -a 后跟的是tag名、-m 后跟的是注释信息
git tag -a v1.0 -m 'version 1.0'
- 查看 tag 列表
git tag
- 查看 tag 详细信息
git show v1.0.1
- 删除 tag
git tag -d v1.0.1
- 删除远程tag
git push origin --delete <tagname>
- 推送tag至远程仓库
git push origin v1.0.1 // 推送单个Tag
git push origin --tags  // 推送所有本地Tag
