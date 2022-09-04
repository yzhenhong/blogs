# MongoDB

## Windows平台安装MongoDB

### 下载以及安装
https://www.mongodb.com/try/download/community

选择对应的安装包平台和版本。

![mongo_db_1.png](./imgs/mongo_db/mongo_db_1.png)

下载 .msi 文件，下载后双击该文件，按操作提示安装即可。

步骤1：选中并双击安装文件，选择“next”进行安装：

![mongo_db_2.png](./imgs/mongo_db/mongo_db_2.png)

步骤2：勾选上(I accept the terms in the License Agreement)，并点击“Next”，进入下一步：

![mongo_db_3.png](./imgs/mongo_db/mongo_db_3.png)

步骤3：选择Custom选项自定义安装路径（默认安装是在C盘），点击"Next"：

![mongo_db_4.png](./imgs/mongo_db/mongo_db_4.png)

步骤4：选择安装盘并安装(点击 Browse… 选择你要安装的盘，选择好安装的盘后在点击Next。注意：记住你安装在某盘的路径，后面配置环境变量要用到。)

![mongo_db_5.png](./imgs/mongo_db/mongo_db_5.png)

步骤5：设置数据库数据和日志存放目录，可以自己选择目录或者使用默认的，然后点击Next按钮进行安装：

![mongo_db_6.png](./imgs/mongo_db/mongo_db_6.png)

步骤6：安装 "install mongoDB compass" （当然你也可以选择安装它），MongoDB Compass 是一个图形界面管理工具，我们可以在后面自己到官网下载安装，下载地址：https://www.mongodb.com/try/download/compass

![mongo_db_7.png](./imgs/mongo_db/mongo_db_7.png)

### 环境变量配置
复制mongodb安装的bin目录 如：D:\Program Files\MongoDB\bin

打开系统属性》高级》环境变量 》 系统环境》path》编辑新增mongodb安装的bin目录
![mongo_db_8.png](./imgs/mongo_db/mongo_db_8.png)
![mongo_db_9.png](./imgs/mongo_db/mongo_db_9.png)

v6.0版本前：
这个时候已经可以 cmd 输入：mongo命令 看看是否成功
![mongo_db_10.png](./imgs/mongo_db/mongo_db_10.png)

v6.0版本后：
需要再下载个MongoDB Shell ：https://www.mongodb.com/try/download/shell

![mongo_db_11.png](./imgs/mongo_db/mongo_db_11.png)
![mongo_db_12.png](./imgs/mongo_db/mongo_db_12.png)
![mongo_db_13.png](./imgs/mongo_db/mongo_db_13.png)

cmd 输入：mongosh命令 看看是否成功
![mongo_db_14.png](./imgs/mongo_db/mongo_db_14.png)


### 启动服务
![mongo_db_15.png](./imgs/mongo_db/mongo_db_15.png)

这个时候浏览器输入http://localhost:27017/就能看到mongo服务已经启动能够连接了。



# MySQL

## Windows平台安装MySQL

### 下载以及安装
1、择window版本，点击下载按钮，如下所示：

https://dev.mysql.com/downloads/mysql/

![my_sql_1.png](./imgs/my_sql/my_sql_1.png)

2、如果需要弹出注册账号点击这里就可以

![my_sql_2.png](./imgs/my_sql/my_sql_2.png)

3、下载好mysql安装包后，将其解压到指定目录，并记下解压的目录，后续用于环境变量配置，并且在bin目录同级下创建一个文件，命名为my.ini

![my_sql_3.png](./imgs/my_sql/my_sql_3.png)

4、编辑my.ini文件，文件内容如下：
![my_sql_4.png](./imgs/my_sql/my_sql_4.png)

有两点需要注意修改的：
A、basedir这里输入的是mysql解压存放的文件路径
B、datadir这里设置mysql数据库的数据存放目录(可以自行设置目录)

5、打开cmd进入mysql的bin文件下，依次执行命令
![my_sql_5.png](./imgs/my_sql/my_sql_5.png)

6、在cmd上执行第一条命令：
//安装mysql  安装完成后Mysql会有一个随机密码
mysqld --initialize --console

执行结果如下：

![my_sql_6.png](./imgs/my_sql/my_sql_6.png)

注意：
A、**一定要保存截图，里面有安装的初始密码**！！！！
B、安装过程中可能会提示以下问题

7、接下来在cmd执行第二条命令：

//安装mysql服务并启动   
mysqld --install mysql
![my_sql_7.png](./imgs/my_sql/my_sql_7.png)

### 环境变量配置

进入电脑的环境变量
![my_sql_8.png](./imgs/my_sql/my_sql_8.png)

新建系统变量：
变量名：MYSQL_HOME
变量值：文件的解压目录
![my_sql_9.png](./imgs/my_sql/my_sql_9.png)

修改系统的path变量
编辑path，进去后添加 %MYSQL_HOME%\bin
![my_sql_10.png](./imgs/my_sql/my_sql_10.png)

### 启动服务

点击桌面我的电脑，右键选择管理进去，找到mysql服务，右键启动：
![my_sql_11.png](./imgs/my_sql/my_sql_11.png)

继续在cmd上执行以下命令：

mysql -uroot -p

回车后输入上面安装时保存的初始密码，进入mysql里面：
![my_sql_12.png](./imgs/my_sql/my_sql_12.png)
![my_sql_13.png](./imgs/my_sql/my_sql_13.png)

在mysql里面继续执行以下命令：
![my_sql_14.png](./imgs/my_sql/my_sql_14.png)

回车按照指引执行完后，代表密码修改成功，再输入exit;退出即可
![my_sql_15.png](./imgs/my_sql/my_sql_15.png)



# PostgreSQL

## Windows平台安装

### 下载以及安装
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
根据自己情况下载对应平台和版本
![postgre_sql_1.png](./imgs/postgre_sql/postgre_sql_1.png)

下载完成后，双击下载安装包，开始安装(安装时候可能存在电脑用户名中文无法安装，可以更改名字后在安装)
![postgre_sql_2.png](./imgs/postgre_sql/postgre_sql_2.png)

你可以修改安装路径
![postgre_sql_3.png](./imgs/postgre_sql/postgre_sql_3.png)

选择安装组件，不懂的选就是全部勾上：
![postgre_sql_4.png](./imgs/postgre_sql/postgre_sql_4.png)

设置数据库路径(根据自己情况选择目录)
![postgre_sql_5.png](./imgs/postgre_sql/postgre_sql_5.png)

设置超级用户的密码
![postgre_sql_6.png](./imgs/postgre_sql/postgre_sql_6.png)

数据库服务端口号，默认端口号即可
![postgre_sql_7.png](./imgs/postgre_sql/postgre_sql_7.png)

系统语言/地区，建议选择默认
![postgre_sql_8.png](./imgs/postgre_sql/postgre_sql_8.png)

后面直接点 Next 直到安装完成
![postgre_sql_9.png](./imgs/postgre_sql/postgre_sql_9.png)

安装完成，弹出默认启动Stack Builder，可以取消
![postgre_sql_10.png](./imgs/postgre_sql/postgre_sql_10.png)

### 启动服务

打开 pgAdmin 4
![postgre_sql_11.png](./imgs/postgre_sql/postgre_sql_11.png)

输入前面设置的密码
![postgre_sql_12.png](./imgs/postgre_sql/postgre_sql_12.png)




# Redis

## Windows平台安装Redis

### 下载以及安装

https://github.com/tporadowski/redis/releases

这里是我下载的Windows压缩文件安装，根据自己情况下载对应平台和版本

![redis_1.png](./imgs/redis/redis_1.png)

下载好redis后，将其解压到指定目录，并记下解压的目录，后续用于环境变量配置
![redis_2.png](./imgs/redis/redis_2.png)

### 环境变量配置
![redis_3.png](./imgs/redis/redis_3.png)
![redis_4.png](./imgs/redis/redis_4.png)

然后cmd执行命令：
redis-server.exe
![redis_5.png](./imgs/redis/redis_5.png)
