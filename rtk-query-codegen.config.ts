import type {ConfigFile} from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
    // schemaFile: 'sv.openapi.json',
    schemaFile: 'http://127.0.0.1:4523/export/openapi/2?version=3.0',
    apiFile: './src/library/redux/baseApi.ts',
    apiImport: 'baseApi',
    // outputFiles: {
    //     './src/api/endpoints.ts': {
    //         exportName: 'api',
    //     },
    // },
    outputFile: './src/library/redux/__generated__.ts',
    hooks: true,
};


export default config;
