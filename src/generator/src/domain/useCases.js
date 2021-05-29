const useCases = ['create', 'update', 'delete', 'findOne']
const { toLowCamelCase, objToString } = require('../../utils')

async function generateRequest (schema){
    // schema to plain JSON
    const obj = Object.keys(schema).reduce((obj, key) => {
        const { name, type } = schema[key]
        obj[name] = type.name || type.constructor.name;
        return obj;
    }, {});

    //convert plain JSON and remove quotation marks(")
    const str = JSON.stringify(obj, null, 8)
        .replace(/"/g, '')
        .split('\n')

    //remove first and last lines
    str.shift()
    str.pop()

    return str.join('\n').trim()
}

module.exports =  async ({ generate, filesystem }) => async () => {
    const entities = require(`${filesystem.cwd()}/src/domain/entities`)
    const requires = {}
    
    for(const entity of Object.keys(entities)){
        if(entity.includes('Input')) continue
        const { name } = entities[entity].prototype.meta
        for(const action of useCases){
            // const nameInCC = toLowCamelCase(name)
            const useCaseName = `${action}${name}`
            await generate({
                template: `domain/usecases/${action}.ejs`,
                target: `src/domain/useCases/${useCaseName}.js`,
                props: { 
                    name: { 
                        pascalCase: name,
                        camelCase: toLowCamelCase(name)
                    },
                    request: name
                }
            })
            requires[useCaseName] = `require('./${useCaseName}')` 
        }
    }
    
    await generate({
        template: 'domain/usecases/index.ejs',
        target: `src/domain/useCases/index.js`,
        props: { requires: objToString(requires) }
    })
}

