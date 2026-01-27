# About

An extended `Map` with Array-like methods and event emission.

# Links

[API Docs](https://danliyev.github.io/wishmap)

## Installation

```bash
npm install wishmap
```

## Usage

```typescript
import { WishMap } from 'wishmap'

const map = new WishMap<string, number>()

// Listen to events
map.events.on('set', (key, value) => {
    console.log(`Set ${key} = ${value}`)
})

map.events.on('delete', (key, value) => {
    console.log(`Deleted ${key} (was ${value})`)
})

// Use like a regular Map
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)

// Use Array-like methods
map.filter(v => v > 1) // WishMap { 'b' => 2, 'c' => 3 }
map.map(v => v * 2) // [2, 4, 6]
map.find(v => v === 2) // 2
map.every(v => v > 0) // true
map.some(v => v > 2) // true
map.reduce((acc, v) => acc + v, 0) // 6
```

## License

This project is licensed under the [MIT License](./LICENSE).
