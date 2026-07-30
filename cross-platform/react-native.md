# React Native 完全指南

## 目录
1. [React Native 基础](#react-native-基础)
2. [核心组件](#核心组件)
3. [样式系统](#样式系统)
4. [导航](#导航)
5. [原生能力](#原生能力)
6. [状态管理](#状态管理)
7. [性能优化](#性能优化)
8. [工程与发布](#工程与发布)
9. [常见问题](#常见问题)

## React Native 基础

### 什么是 React Native
React Native 是 Meta 开源的跨平台移动应用开发框架，使用 React 语法编写原生 iOS 和 Android 应用，组件最终会被渲染为真正的原生控件。

### 安装与配置
```bash
# 使用 Expo（推荐新手）
npx create-expo-app my-app --template
cd my-app && npx expo start

# 使用 React Native CLI（完整原生能力）
npx @react-native-community/cli@latest init MyApp --template react-native-template-typescript
```

### 目录结构
```
my-app/
├── src/
│   ├── screens/        # 页面
│   ├── components/     # 组件
│   ├── navigation/     # 导航配置
│   ├── store/          # 状态管理
│   ├── hooks/
│   └── utils/
├── android/            # Android 原生代码
├── ios/                # iOS 原生代码
├── App.tsx
└── package.json
```

## 核心组件

### 基础组件
```tsx
import { View, Text, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native'

const Demo = () => (
  <ScrollView>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>标题</Text>
      <Image
        source={{ uri: "https://example.com/image.png" }}
        style={{ width: 100, height: 100 }}
      />
      {/* Pressable 是新版推荐的可点击组件 */}
      <Pressable
        onPress={() => console.log("点击")}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <Text>按钮</Text>
      </Pressable>
    </View>
  </ScrollView>
)
```

### FlatList 高性能列表
```tsx
import { FlatList, Text, View } from 'react-native'

interface Item { id: string; title: string }

const ListDemo = ({ data }: { data: Item[] }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={{ padding: 12, borderBottomWidth: 1 }}>
        <Text>{item.title}</Text>
      </View>
    )}
    onEndReached={() => console.log("加载更多")}
    onEndReachedThreshold={0.1}
    refreshing={false}
    onRefresh={() => console.log("下拉刷新")}
  />
)
```

### TextInput
```tsx
import { useState } from 'react'
import { TextInput, View } from 'react-native'

const InputDemo = () => {
  const [value, setValue] = useState('')
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="请输入"
      secureTextEntry={false}
      style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
    />
  )
}
```

## 样式系统

### StyleSheet
```tsx
import { StyleSheet, View, Text } from 'react-native'

const Demo = () => (
  <View style={styles.container}>
    <Text style={styles.title}>标题</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: '#333',
  },
})
```

### Flexbox 布局
```tsx
// RN 默认 flexDirection 为 column，与 Web 不同
const Layout = () => (
  <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
    <View style={{ flex: 1, backgroundColor: "red" }} />
    <View style={{ flex: 2, backgroundColor: "blue" }} />
  </View>
)
```

### 平台适配
```tsx
import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({
      ios: 44,    // iOS 状态栏高度
      android: 0,
    }),
  },
})

// 或者
if (Platform.OS === 'ios') {
  console.log('iOS 平台')
}
```

## 导航

### React Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

```tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator<RootStackParamList>()

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
)
```

### 页面间导航
```tsx
import { useNavigation, useRoute } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation()

  return (
    <Pressable
      onPress={() => navigation.navigate('Detail', { id: '1', title: '标题' })}
    >
      <Text>跳转详情</Text>
    </Pressable>
  )
}

const DetailScreen = () => {
  const route = useRoute()
  const { id, title } = route.params as { id: string; title: string }

  return <Text>{title}</Text>
}
```

### Tab 导航
```bash
npm install @react-navigation/bottom-tabs
```

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)
```

## 原生能力

### 网络请求
```ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})
```

### AsyncStorage
```bash
npm install @react-native-async-storage/async-storage
```

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'

// 存储
await AsyncStorage.setItem('user', JSON.stringify(user))

// 读取
const value = await AsyncStorage.getItem('user')
const user = value ? JSON.parse(value) : null

// 删除
await AsyncStorage.removeItem('user')
```

### 相机与图库
```bash
npm install react-native-image-picker
```

```ts
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'

const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  })

  if (!result.didCancel && result.assets?.[0]) {
    const uri = result.assets[0].uri
    console.log("选择的图片：", uri)
  }
}
```

## 状态管理

### Zustand（推荐）
```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clear: () => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  ),
)
```

## 性能优化

### memo + useCallback
```tsx
import { memo, useCallback } from 'react'

const ListItem = memo(({ item, onPress }: { item: Item; onPress: (id: string) => void }) => {
  return (
    <Pressable onPress={() => onPress(item.id)}>
      <Text>{item.title}</Text>
    </Pressable>
  )
})

const Parent = ({ items }: { items: Item[] }) => {
  const handlePress = useCallback((id: string) => {
    console.log(id)
  }, [])

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ListItem item={item} onPress={handlePress} />}
    />
  )
}
```

### Hermes 引擎

Hermes 是 React Native 默认使用的 JavaScript 引擎。升级 React Native 后应重新测量冷启动、内存和关键页面，避免沿用旧版本结论。

```properties
# android/gradle.properties
hermesEnabled=true
```

### InteractionManager
```tsx
import { InteractionManager } from 'react-native'

// 等动画结束后再执行重计算任务，避免掉帧
useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // 执行耗时操作
  })

  return () => task.cancel()
}, [])
```

对于新代码，也可以使用 `requestIdleCallback` 安排低优先级任务。无论采用哪种方式，都不要在 JavaScript 线程执行大规模同步计算。

## 工程与发布

### 处理安全区域和软键盘

全面屏设备的状态栏、圆角和底部指示器不能使用固定像素猜测。页面根节点应接入 safe area，输入表单还要验证 iOS 与 Android 的键盘避让行为。

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const FormScreen = () => (
  <SafeAreaProvider>
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 表单内容 */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  </SafeAreaProvider>
)
```

### 监听前后台状态

应用进入后台后应暂停轮询、动画和非必要定位，回到前台时再校验登录状态和过期数据。

```tsx
import { AppState } from 'react-native'

useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') refreshStaleData()
  })

  return () => subscription.remove()
}, [])
```

### 权限处理

权限不是一个布尔值。至少要区分首次询问、已允许、已拒绝和永久拒绝，并向用户解释请求权限的实际用途。Android 权限随系统版本变化，iOS 还需要在 `Info.plist` 配置用途说明。

### 环境配置

开发、测试和生产环境应使用不同的 API 地址、应用标识和第三方服务配置。密钥不能因为写进 `.env` 就变得安全：打进客户端的内容最终都能被提取，真正的服务端密钥只能留在服务端。

### 发布检查

```text
[ ] Android release 构建已使用正式签名并验证升级安装
[ ] iOS Archive、证书、隐私清单和商店资料完整
[ ] 最低支持系统的真机可以启动并完成核心流程
[ ] 权限拒绝、断网、切后台和进程恢复均有可用状态
[ ] source map 已安全上传到错误监控服务
[ ] 安装包中没有测试服务器地址、调试菜单和敏感日志
```

## 常见问题

### 为什么修改原生依赖后启动失败

安装或升级包含原生代码的依赖后，通常需要重新构建 App；iOS 还要重新安装 Pods。Metro 只负责 JavaScript bundle，无法把新的原生二进制热更新进已经安装的应用。

### 为什么列表仍然卡顿

先检查是否使用 `ScrollView` 一次渲染全部数据，再检查 `renderItem` 是否创建复杂组件、图片是否过大、key 是否稳定，以及父组件是否频繁产生新对象。不要在没有测量前给所有组件添加 `memo`。

### Expo 还是 React Native CLI

Expo 适合快速开始，并提供成熟的构建与常用原生能力；需要深度修改原生工程或集成特殊 SDK 时，应确认该能力是否支持 config plugin 或 development build。两者不是永久对立的选择，项目可以按能力需求演进。

### 调试时正常，Release 异常

重点检查环境变量、代码压缩、网络安全策略、原生权限、ABI/架构、签名配置和被开发模式掩盖的竞态条件。发布前必须直接测试 release 产物，不能只依赖 Metro 开发模式。

## 延伸阅读

- [React Native 官方文档](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [跨端开发选型](/cross-platform/index.md)
