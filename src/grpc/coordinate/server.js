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

// Store mainWindow reference for IPC communication
let mainWindowRef = null;

function getCoordinate(call, callback) {
    const coordinate = call.request.coordinate;
    const response = {
        coordinate: coordinate,
        message: `${coordinate.latitude}, ${coordinate.longitude}`,
        timestamp: Date.now()
    };
    
    // Send coordinate to renderer process via IPC
    if (mainWindowRef && mainWindowRef.webContents) {
        try {
            mainWindowRef.webContents.send('coordinate-received', {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                message: response.message,
                timestamp: response.timestamp
            });
        } catch (error) {
            console.error('Error sending coordinate to renderer:', error);
        }
    }
    
    callback(null, response);
}

function getCoordinateList(call, callback) {
    const coordinates = call.request.coordinates;
    const response = {
        coordinates: coordinates,
        message: 'Coordinate list received',
        timestamp: Date.now()
    };
    callback(null, response);
}

function main(mainWindow) {
    // Store mainWindow reference for IPC communication
    mainWindowRef = mainWindow;
    
    var server = new grpc.Server();
    server.addService(
        coordinate_proto.CoordinateService.service, 
        {getCoordinate: getCoordinate, 
        getCoordinateList: getCoordinateList}
    );
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
          console.error(`Server binding failed: ${error.message}`);
          return;
        }
        console.log(`gRPC Server running at http://0.0.0.0:${port}`);
    });
    return server;
}

module.exports = { main, getCoordinate, getCoordinateList };

if (require.main === module) {
    main();
}