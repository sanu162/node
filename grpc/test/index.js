const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const options = {
    keepCase: true,
    longs:String,
    enums:String,
    defaults:true,
    oneofs:true,
};

const clientStremProto = grpc.loadPackageDefinition('./test.proto',)