import * as Realm from 'realm'
import * as fsPath from 'path'

const fs = require('fs-extra');

const debug = true

export enum Language {ObjC, Swift, Java, CS, JS}


export interface IConfig {
    oneFilePerClass: boolean,
    schemaNameAppend: string
} 

export type SchemaFile = {
    filename: string,
    content: string
}

export interface ISchemaExporter {
    exportSchema: (Realm) => SchemaFile[]
}

export class SchemaExporter implements ISchemaExporter {
    config: IConfig 
    realm: Realm
    realmName: string
    files: SchemaFile[]
    content = ''

    constructor(config: IConfig) {
        this.config = config    // currently unused
        this.content = ''
        this.files = []
    }

    appendLine(line: string) {
        this.content += line + '\n'
    }

    addFile(filename: string, content: string) {
        this.files.push({
            filename: filename, 
            content: content
        })
    }

    makeSchema(schema: Realm.ObjectSchema) {
        
    }
    
    exportSchema(realm: Realm): SchemaFile[] {
        this.realmName = fsPath.parse(realm.path).name
        this.realm = realm
       
        realm.schema.forEach(schema => {
            this.makeSchema(schema)
        })
        return this.files
    }

    writeFilesToDisk(path: string) {
        this.files.forEach(file => {
            const fullpath = fsPath.resolve(path, file.filename)
            if (debug) {
                console.log('--- path: ' + fullpath)
                console.log(file.content)
            }
            fs.outputFileSync(fullpath, file.content)
        })
    }
}

// ------------ Swift -----------

export class SwiftSchemaExporter extends SchemaExporter {
    constructor() {
        super(null)
    }

    exportSchema(realm: Realm): SchemaFile[] {
        this.appendLine('import Foundation')  
        this.appendLine('import RealmSwift\n')
        
        realm.schema.forEach(schema => {
            this.makeSchema(schema)
        })
        this.addFile(fsPath.parse(realm.path).name + '-model.swift', this.content)
        
        return this.files
    }

    makeSchema(schema: Realm.ObjectSchema) {
        this.appendLine(`class ${schema.name}: Object {`)
       
        // Properties
        let indexedProp = []
        for (const key in schema.properties) {
            let prop: any = schema.properties[key]
            this.appendLine('    ' + this.propertyLine(prop))
            if (prop.indexed && prop.name !== schema.primaryKey) {
                indexedProp.push(prop)
            }
        }

        // Primary key
        if (schema.primaryKey) {
            this.appendLine('')
            this.appendLine('    override static func primaryKey() -> String? {')
            this.appendLine('        return "' + schema.primaryKey + '"')
            this.appendLine('    }')
        }

        // Indexed Properties
        if (indexedProp.length > 0) {
            this.appendLine('')
            this.appendLine('    override static func indexedProperties() -> [String] {')
            
            let line = '        return ['
            let prop: any
            for (let i = 0; i < indexedProp.length; i++) {
                prop = indexedProp[i]
                line += `"${prop.name}"`
                if (i < indexedProp.length - 1)
                    line += ', '
            }
            this.appendLine(line + ']')
            this.appendLine('    }')
        }

        // End class
        this.appendLine('}') 
        this.appendLine('') 
    }
    
    propertyLine(prop): string {

        function propertyType(propType) {
            switch (propType) {
                case 'bool':   return 'Bool'
                case 'int':    return 'Int'
                case 'float':  return 'Float'
                case 'double': return 'Double'
                case 'string': return 'String'
                case 'data':   return 'Data'
                case 'date':   return 'Date'    
            }
            return propType
        }

        // Arrays
        if (prop.type === 'list') {
            let str = propertyType(prop.objectType)
            if (prop.optional)
                str += '?'
            return `let ${prop.name} = List<${str}>()`
        }

        let propType = propertyType(prop.type)

        // Optional types
        if (prop.optional) {
            switch (prop.type) {
                case 'bool': 
                case 'int':  
                case 'float': 
                case 'double':
                    return `let ${prop.name} = RealmOptional<${propType}>()`
                
                case 'string':
                case 'data': 
                case 'date':
                    return `@objc dynamic var ${prop.name}: ${propType}? = nil`
                
                case 'object':
                    return `@objc dynamic var ${prop.name}: ${prop.objectType}?`
                default:
                    return `ERROR - unknown type '${prop.type}'`
                }
        } 

        // Non Optional types
        let str = `@objc dynamic var ${prop.name}: ${propType} = `
        switch (prop.type) {
            case 'bool':
                return str + 'false'
            case 'int':
            case 'float':
            case 'double':
                return str + '0'
            case 'string':
                return str + '""'
            case 'data':
                return str + 'Data()'
            case 'date':
                return str + 'Date()'
            case 'object':
                return 'Objects must always be optional. Something is not right in this model!'
            case 'linkingObjects':
                return 'linkingObjects Unexpected!!!'
        }
    }
}

// ------------ JavaScript -----------

export class JSSchemaExporter extends SchemaExporter {
    constructor() {
        super(null)
    }

    exportSchema(realm: Realm): SchemaFile[] {
        realm.schema.forEach(schema => {
            this.makeSchema(schema)
        })
        this.addFile(fsPath.parse(realm.path).name + '-model.js', this.content)
        
        return this.files
    }

    makeSchema(schema: Realm.ObjectSchema) {
        this.appendLine(`exports.${schema.name} = {`)
        this.appendLine(`  name: '${schema.name}',`)
        
        if (schema.primaryKey) {
            this.appendLine(`  primaryKey: '${schema.primaryKey}'`)
        }

        // properties
        this.appendLine(`  properties: {`)
        let i = 1
        const lastIdx = Object.keys(schema.properties).length
        let line: string
        for (const key in schema.properties) {
            let primaryKey = (key === schema.primaryKey)
            line = '    ' + this.propertyLine(schema.properties[key], primaryKey)
            if (i++ < lastIdx) {
                line += ","
            }
            this.appendLine(line)
        }

        this.appendLine("  }\n}\n")
    }
    
    propertyLine(prop, primaryKey: boolean): string {
        // Name of the type
        let typeStr = ''
        switch (prop.type) {
            case 'list':
            case 'object':
            case 'linkingObjects':
                typeStr = prop.objectType
                break
            default:
                typeStr = prop.type
        }
        if (prop.optional && prop.type !== 'object') {
            typeStr += '?'
        }
        if (prop.type === "list") {
            typeStr += '[]'
        }

        // Make line
        let line = prop.name + ': ' 
        if (prop.indexed && !primaryKey) {
            line += `{ type: '${typeStr}', indexed: true }`
        } else {
            line += `'${typeStr}'`
        }
        return line
    }
}
