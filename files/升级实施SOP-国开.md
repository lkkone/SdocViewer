# 升级实施SOP-国开

## 上传部署包

```Bash
# 携带U盘行内上传安装包

#到/data目录下
cd /data/

#解压安装包
tar xf instructure-deployer-v0.2.39-offline-amd64.tar.gz -C /data
tar xf mastergo-v2.0.35-pri-patch0825-charts-amd64.tar.gz -C /data
```

## 部署基建

```Bash
#进入基建包包目录下
cd /data/instructure-deployer/v0.2.39

EXT_TEAMNAME=MasterGo ./instructure-deployer.sh --install \
    --nfs-ip 10.38.57.7 \
    --server-ips 10.38.57.7
```

## 获取升级前schema版本

```Bash
# 浏览器访问，获取升级前schema版本
http://10.38.57.7/schema/version
```

### 新建values.config.yaml配置

```Bash
vim values.config.yaml

global:
  # ingress的访问域名或IP部署配置
  ingress:
    enable: true
    # host为空表示IP部署和访问，即默认IP部署，需要域名访问时填写为访问的域名，根据客户实际情况进行配置
    # 当通过7层代理访问时，配置为空，即IP部署和访问
    host: ""
    ssl:
      # 默认关闭https访问，当设置为true时则会开启https访问
      # 当通过7层代理访问时，配置为false
      enable: false
      # https访问时默认从名称为mastergo的secret中获取tls证书
      secretName: "mastergo"
  config:
    # 团队名称，配置为客户的企业英文简称
    teamName: "MasterGo"

    # 业务访问地址
    # 当ingress为IP部署，则这里应该配置为服务器SERVER节点的IP地址
    # 当ingress为域名或https部署，则这里和ingress的访问域名配置一致
    # 当通过代理访问时，配置为代理的访问地址
    mastergoAddr: "http://10.38.57.7"
    lanhuaddr: "http://10.38.57.7"

    # 企业私有化配置
    privateSettings:
      # 登录方式，可选值为account和sso，默认为account，表示账户密码登录，设置为sso表示通过lhsso服务进行sso登录
      login_type: "account"
      # 企业创建者信息
      initOrganization:
        createEmail: ""
        pwd: ""
        organizationName: ""
        organizationAbbr: ""
    
    # oss配置
    oss:
      # 指定oss静态资源访问地址，当未使用外置oss时，默认和ingress的访问域名或IP部署配置一致
      # 当通过代理访问时，并且未使用外置oss时，配置为代理的访问地址
      # 当使用外置oss时，指定为为外置oss的访问地址
      default_domain: "10.38.57.7"
      default_schema: "http"
      comp_domain: "10.38.57.7"
      comp_schema: "http"

    # 存储类配置，默认为managed-nfs-storage
    storageClass: "managed-nfs-storage"
```

## 导入镜像

```YAML
#进入应用包目录下
cd /data/mastergo/v2.0.35-pri-patch0825

./tools/load_image.sh
```

### 升级应用

```Bash
#应用部署
helm upgrade -i mastergo --timeout 20m -n mastergo -f ../values-private.yaml ./mastergo-privatization
```

### 持久化配置（拷贝备用，防止临时变更）

- lem(yaml)

```SQL
cat <<EOF |curl -X POST -H "Content-Type: multipart/form-data" -F "file=@-" 'http://10.38.57.7/api/v1/customconfig/upload?app=lem&configType=yaml'
unleash_server:
  toggles:
    web.seatBill: true
    web.priSeatLicenseCheck: true
    web.exportMG: true
EOF
```

- 检查配置是否上传(yaml)

```SQL
curl -X GET "http://10.38.57.7/api/v1/customconfig/download?app=lem"
```

- 重启lem服务

```Bash
kubectl rollout restart deploy lem -n mastergo
```

- 查看全量yaml merge后的配置

```Bash
curl -X GET "http://10.38.57.7/api/v1/customconfig/download?app=lem&full=1"
```

### 验证服务

```Bash
#服务状态验证
kubectl get pod -nmastergo

#进入应用包目录下
cd /data/mastergo/v2.0.35-pri-patch0825

#接口测试和验证
./tools/run_jemter_test.sh

#浏览器新建文件上传一张图片设置为封面，退出文件在进入，文件存在为正常
```

### 信息记录

```Bash
#信息记录
./tools/rdinfo.sh
```

### 健康检查脚本执行

```Bash
#进入基建包包目录下
cd /data/instructure-deployer/v0.2.39

./tools/health_check.sh
```

# 回滚方案

回滚到升级前版本,仅当升级出现问题且无法修复情况下执行

## 回滚到升级前版本

```Bash
#确认版本
helm history -nmastergo mastergo
#回滚到上一个版本
helm rollback -n mastergo mastergo
#回滚到指定版本
helm rollback -n mastergo mastergo xxx
```

## 接口测试

```Bash
#进入应用包目录下
cd /data/mastergo/v2.0.35-pri-patch0825
#接口测试
PRI_SCHEMA=https PRI_URL=10.38.57.7 ./tools/run_jemter_test.sh |grep "Err"
```

## 页面验证

## 获取回退后schema版本（等于升级前schema版本）

```Bash
# 浏览器访问，获取回退后schema版本
http://10.38.57.7/schema/version
```