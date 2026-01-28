# About

An extended `Map` with Array-like methods and event emission.

# Links

[API Docs](https://danliyev.github.io/WishMap)

# Installation

## Using NPM Registry

```bash
npm install @danliyev/wishmap
```

## Using GitHub Packages Registry

1. Create a [GitHub Personal Access Token](https://github.com/settings/tokens/new) with `read:packages` scope

2. Add to your shell profile (`.bashrc`, `.zshrc`, or `.profile`):

```bash
export GITHUB_TOKEN=your_token_here
```

3. In your project directory, create `.npmrc`:

```
@danliyev:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

4. Install:

```bash
npm install @danliyev/wishmap
```

### Alternative: npm login

Authenticate once with GitHub Packages:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@danliyev
# Username: your-github-username
# Password: your-personal-access-token (with read:packages scope)
# Email: your-email
```

Then install normally:

```bash
npm install @danliyev/wishmap
```

See [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for more information.

# Usage

```typescript
import { WishMap } from '@danliyev/wishmap'

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

# License

This project is licensed under the [MIT License](./LICENSE).
