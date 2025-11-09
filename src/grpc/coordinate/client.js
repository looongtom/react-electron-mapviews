var PROTO_PATH = __dirname + '/../../protos/coordinate.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var coordinate_proto = grpc.loadPackageDefinition(packageDefinition).coordinate;

function main() {
    var client = new coordinate_proto.CoordinateService('localhost:50051', grpc.credentials.createInsecure());
    client.getCoordinate({coordinate: {latitude: 1, longitude: 1}}, function(err, response) {
        console.log('Response:', response);
    });
}

module.exports = { main };

if (require.main === module) {
    main();
}