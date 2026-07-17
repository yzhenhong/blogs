# React Native 完全指南

## 目录
1. [React Native 基础](#react-native-基础)
2. [核心组件](#核心组件)
3. [样式系统](#样式系统)
4. [导航](#导航)
5. [原生能力](#原生能力)
6. [状态管理](#状态管理)
7. [性能优化](#性能优化)

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

const useUserStore = create<UserStore>()()
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
  )
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

const Parent = () => {
  const handlePress = useCallback((id: string) => {
    console.log(id)
  }, [])

  return <FlatList renderItem={({ item }) => <ListItem item={item} onPress={handlePress} />} />
}
```

### Hermes 引擎
```json
// android/gradle.properties
// hermesEnabled = true（React Native 0.70+ 默认开启）

// iOS Podfile 自动配置，无需手动修改
```

### InteractionManager
```tsx
import { InteractionManager } from 'react-native'

// 等动画结束后再执行重计算任务，避免掉帧
useEffect(() => {
  InteractionManager.runAfterInteractions(() => {
    // 执行耗时操作
  })
}, [])
```