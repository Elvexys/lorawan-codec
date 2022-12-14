var LEM302_DOWNLINK_PAYLOAD_FORMAT = 0x01;
var LEM302_DOWNLINK_FPORT = 35;

function intTo1Byte(int) {
  if (int < 0 || int > 255) {
    return "Unable to convert integer into 1 byte";
  }
  return int & 0xFF;
}

function intTo2Bytes(int) {
  if (int < 0 || int > 65535) {
    return "Unable to convert integer into 2 bytes";
  }
  return [int >> 8, int & 0xFF];
}

// ChirpStack v3 expect an array of bytes, in decimal ([225, 230, 255, 0]) returned
function EncodeLEM302DevicePayload(fPort, jsonObject) {
  var returnedByteArray = [0,0,0,0,0,0,0,0,0,0,0];
  var err = null;

  if (fPort !== LEM302_DOWNLINK_FPORT){
    err = new Error("Unable to encode downlink on port " + fPort+ ", expecting : " + LEM302_DOWNLINK_FPORT + ")");
    return {returnedByteArray: {}, err: err};
  }

  // Add format version
  returnedByteArray[0] = LEM302_DOWNLINK_PAYLOAD_FORMAT;
  // Iterate all configuration fields
  Object.keys(jsonObject).forEach(function (key) {
    // Value must be a an integer
    if (Math.floor(jsonObject[key]) !== jsonObject[key]){
        err = new Error("Unable to encode downlink, value of "+jsonObject[key]+" must be an integer");
        return {returnedByteArray: {}, err: err};
    }
    // Check port
    switch (key) {
      case "set_phase1_3_overcurrent_threshold":
        returnedByteArray[1] = intTo2Bytes(jsonObject[key])[0];
        returnedByteArray[2] = intTo2Bytes(jsonObject[key])[1];
        break;
      case "set_phase4_overcurrent_threshold":
        returnedByteArray[3] = intTo2Bytes(jsonObject[key])[0];
        returnedByteArray[4] = intTo2Bytes(jsonObject[key])[1];
        break;
      case "set_overcurrent_measurement_window":
        returnedByteArray[5] = intTo1Byte(jsonObject[key]);
        break;
      case "set_cyclic_message_period":
        returnedByteArray[6] = intTo2Bytes(jsonObject[key])[0];
        returnedByteArray[7] = intTo2Bytes(jsonObject[key])[1];
        break;
      case "set_system_cyclic_message_ratio":
        returnedByteArray[8] = intTo1Byte(jsonObject[key]);
        break;
      case "set_link_check_ratio":
        returnedByteArray[9] = intTo1Byte(jsonObject[key]);
        break;
      case "set_link_check_attempt":
        returnedByteArray[10] = intTo1Byte(jsonObject[key]);
        break;
      default:
        err = new Error("Unable to encode downlink, unknown data field: "+key);
        return {returnedByteArray: {}, err: err};
    }
  });

  return { returnedByteArray: returnedByteArray, err: err };
}


// Encode encodes the given object into an array of bytes.
//  - fPort contains the LoRaWAN fPort number
//  - obj is an object, e.g. {"temperature": 22.5}
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an array of bytes, e.g. [225, 230, 255, 0]
function Encode(fPort, obj, variables) {
  return EncodeLEM302DevicePayload(fPort, obj).returnedByteArray;
}
