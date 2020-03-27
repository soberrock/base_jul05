
const packages = require('./package.json')
const dependencies = packages.dependencies
const devDependences = packages.devDependencies

const flatDeps = Object.keys(dependencies).join(' ')
const flatDevdeps = Object.keys(devDependences).join(' ')
console.log(flatDeps)
console.log("HERE")
console.log(flatDevdeps)