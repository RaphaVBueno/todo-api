import { Project } from 'ts-morph'
import fs from 'fs'

const project = new Project()
project.addSourceFilesAtPaths('src/**/*.ts')

project.getSourceFiles().forEach((file) => {
  let updated = false
  file.getImportDeclarations().forEach((importDecl) => {
    const importPath = importDecl.getModuleSpecifierValue()
    if (!importPath.startsWith('.') || importPath.endsWith('.js')) return

    importDecl.setModuleSpecifier(importPath + '.js')
    updated = true
  })

  if (updated) {
    fs.writeFileSync(file.getFilePath(), file.getFullText())
  }
})

console.log('✅ Imports corrigidos!')
