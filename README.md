# 七牛客户端

### 项目说明

基于 electron-vue + element ui 七牛客户端

### 项目截图

　![screenshot1](./screenshot/screenshot-01.png)
![screenshot2](./screenshot/screenshot-02.png)
![screenshot3](./screenshot/screenshot-03.png)
![screenshot4](./screenshot/screenshot-04.png)

### 项目目录

```
src
├── index.ejs
├── main
│   ├── index.dev.js
│   └── index.js
└── rendererd
│   ├── App.vue
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   ├── AddImage.vue
│   │   ├── Bucket.vue
│   │   ├── LandingPage
│   │   │   └── SystemInformation.vue
│   │   ├── LandingPage.vue
│   │   ├── Manage
│   │   │   ├── Dialog.vue
│   │   │   ├── List.vue
│   │   │   ├── Pagination.vue
│   │   │   └── Search.vue
│   │   ├── Upload.vue
│   │   └── login.vue
│   ├── config
│   │   └── http.js
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── service
│   │   ├── api.js
│   │   └── getData.js
│   └── store
│        ├── index.js
│        └── modules
│            ├── Counter.js
│            └── index.js
static
└── image
    ├── data.png
    ├── logo.png
    ├── quit.svg
    └── upload.png
```

### 构建应用

``` bash
# 安装依赖
npm install

# 热加载服务运行在 localhost: 9080
npm run dev

# 打包项目
npm run build
```

### 赞助我

如果觉得这些内容不错，请我喝杯咖啡吧。

![pay](./screenshot/pay.png)
