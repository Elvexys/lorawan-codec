var LEM302_ALARM_FPORT = 33;
var LEM302_CYCLIC_DATA_MESSAGE_FPORT = 34;
var LEM302_CYCLIC_SYSTEM_MESSAGE_FPORT = 35;
var LEM302_DOWNLINK_FPORT = 35;
var LEM302_ALARM_PAYLOAD_LENGTH = 9;
var LEM302_CYCLIC_DATA_MESSAGE_PAYLOAD_LENGTH = 24;
var LEM302_CYCLIC_SYSTEM_MESSAGE_PAYLOAD_LENGTH = 19;
var LEM302_DOWNLINK_PAYLOAD_FORMAT = 0x01;

function hexToBytes(hex) {
  var bytes = [];
  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  }
  return bytes;
}

function bytesToUint(bytes) {
  var value;
  for (var i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
  }
  return value;
}
function bytesToInt16(bytes) {
  var a = bytesToUint(bytes);
  if ((a & 0x8000) > 0) {
    a = a - 0x10000;
  }
  return a;
}

function intToHexVal1Byte(int) {
  if (int < 0 || int > 255) {
    return "Unable to convert integer into 1 byte";
  }
  return parseInt(int.toString(16), 10);
}

function intToHexVal2Byte(int) {
  if (int < 0 || int > 65535) {
    return "Unable to convert integer into 2 byte";
  }
  var hexRep = int.toString(16);
  switch (hexRep.length){
    case 1:
      hexRep = "000"+hexRep;
      break;
    case 2:
      hexRep = "00"+hexRep;
      break;
    case 3:
      hexRep = "0"+hexRep;
      break;
    case 4:
      hexRep = "0"+hexRep;
      break;
    default:
      return "Unable to convert integer into 2 byte";
  }
  return [parseInt(hexRep.slice(0,2)), parseInt(hexRep.slice(2,4))];
}

// DecodeLEM302DevicePayload gets device payload hex string and port from network server and returns a map with all data_field and related values as JSON object.
function DecodeLEM302DevicePayload(data, port) {
  var returnedValues = {};
  var err = null;

  var dataByte = hexToBytes(data);
  // Check port
  switch (port) {
    case LEM302_ALARM_FPORT:
      if (dataByte.length !== LEM302_ALARM_PAYLOAD_LENGTH) {
        err = new Error("Alarm payload wrong length (received : " + dataByte.length + ", expected : " + LEM302_ALARM_PAYLOAD_LENGTH + ")");
        return { returnedValues: {}, err: err };
      } else {
        // This is a tricky one. The enabled bit in the byte corresponds to the phase in alarm
        // Multiple bits can be set in the same payload
        var bitFlag = null;
        try {
          bitFlag = bytesToUint(dataByte.slice(0, 1));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.alarm_phase = bitFlag;

        var ph1AlarmRmsCurrent = null;
        try {
          ph1AlarmRmsCurrent = bytesToUint(dataByte.slice(1, 3));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase1_alarm_rms_current = ph1AlarmRmsCurrent / 10; /*  // Unit is 100mA*/

        var ph2AlarmRmsCurrent = null;
        try {
          ph2AlarmRmsCurrent = bytesToUint(dataByte.slice(3, 5));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase2_alarm_rms_current = ph2AlarmRmsCurrent / 10; /*  // Unit is 100mA*/

        var ph3AlarmRmsCurrent = null;
        try {
          ph3AlarmRmsCurrent = bytesToUint(dataByte.slice(5, 7));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase3_alarm_rms_current = ph3AlarmRmsCurrent / 10; /*  // Unit is 100mA*/

        var ph4AlarmRmsCurrent = null;
        try {
          ph4AlarmRmsCurrent = bytesToUint(dataByte.slice(7, 9));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase4_alarm_rms_current = ph4AlarmRmsCurrent / 10; /*  // Unit is 100mA*/
      }
      break;
    case LEM302_CYCLIC_DATA_MESSAGE_FPORT:
      if (dataByte.length !== LEM302_CYCLIC_DATA_MESSAGE_PAYLOAD_LENGTH) {
        err = new Error(
            "Cyclic data message payload wrong length (received : " +
            dataByte.length +
            ", expected : " +
            LEM302_CYCLIC_DATA_MESSAGE_PAYLOAD_LENGTH +
            ")"
        );
        return { returnedValues: {}, err: err };
      } else {
        var ph1AvgRMSCurrent = null;
        try {
          ph1AvgRMSCurrent = bytesToUint(dataByte.slice(0, 2));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase1_average_rms_current = ph1AvgRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph1LargestRMSCurrent = null;
        try {
          ph1LargestRMSCurrent = bytesToUint(dataByte.slice(2, 4));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase1_largest_rms_current = ph1LargestRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph1AverageRMSVoltage = null;
        try {
          ph1AverageRMSVoltage = bytesToUint(dataByte.slice(4, 6));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase1_average_rms_voltage = ph1AverageRMSVoltage / 10; /*  // Unit is 100mV*/

        var ph2AvgRMSCurrent = null;
        try {
          ph2AvgRMSCurrent = bytesToUint(dataByte.slice(6, 8));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase2_average_rms_current = ph2AvgRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph2LargestRMSCurrent = null;
        try {
          ph2LargestRMSCurrent = bytesToUint(dataByte.slice(8, 10));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase2_largest_rms_current = ph2LargestRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph2AverageRMSVoltage = null;
        try {
          ph2AverageRMSVoltage = bytesToUint(dataByte.slice(10, 12));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase2_average_rms_voltage = ph2AverageRMSVoltage / 10; /*  // Unit is 100mV*/

        var ph3AvgRMSCurrent = null;
        try {
          ph3AvgRMSCurrent = bytesToUint(dataByte.slice(12, 14));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase3_average_rms_current = ph3AvgRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph3LargestRMSCurrent = null;
        try {
          ph3LargestRMSCurrent = bytesToUint(dataByte.slice(14, 16));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase3_largest_rms_current = ph3LargestRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph3AverageRMSVoltage = null;
        try {
          ph3AverageRMSVoltage = bytesToUint(dataByte.slice(16, 18));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase3_average_rms_voltage = ph3AverageRMSVoltage / 10; /*  // Unit is 100mV*/

        var ph4AvgRMSCurrent = null;
        try {
          ph4AvgRMSCurrent = bytesToUint(dataByte.slice(18, 20));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase4_average_rms_current = ph4AvgRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph4LargestRMSCurrent = null;
        try {
          ph4LargestRMSCurrent = bytesToUint(dataByte.slice(20, 22));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase4_largest_rms_current = ph4LargestRMSCurrent / 10; /*  // Unit is 100mA*/

        var ph4AverageRMSVoltage = null;
        try {
          ph4AverageRMSVoltage = bytesToUint(dataByte.slice(22, 24));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase4_average_rms_voltage = ph4AverageRMSVoltage / 10; /*  // Unit is 100mV*/
      }
      break;
    case LEM302_CYCLIC_SYSTEM_MESSAGE_FPORT:
      if (dataByte.length !== LEM302_CYCLIC_SYSTEM_MESSAGE_PAYLOAD_LENGTH) {
        err = new Error(
            "Cyclic system message payload wrong length (received : " +
            dataByte.length +
            ", expected : " +
            LEM302_CYCLIC_SYSTEM_MESSAGE_PAYLOAD_LENGTH +
            ")"
        );
        return { returnedValues: {}, err: err };
      } else {
        var formatVersion = null;
        try {
          formatVersion = bytesToUint(dataByte.slice(0, 1));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.format_version = formatVersion; // Currently, 1

        var fwVersionMajor = null;
        try {
          fwVersionMajor = bytesToUint(dataByte.slice(1, 2));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.fw_version_major = fwVersionMajor;

        var fwVersionMinor = null;
        try {
          fwVersionMinor = bytesToUint(dataByte.slice(2, 3));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.fw_version_minor = fwVersionMinor;

        var fwVersionPatch = null;
        try {
          fwVersionPatch = bytesToUint(dataByte.slice(3, 4));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.fw_version_patch = fwVersionPatch;

        var temperature = null;
        try {
          temperature = bytesToInt16(dataByte.slice(4, 6));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.temperature = temperature / 10; // Unit is 0.1 degC

        var humidity = null;
        try {
          humidity = bytesToUint(dataByte.slice(6, 7));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.humidity = humidity / 2; // Unit is 0.5 %

        var systemUptime = null;
        try {
          systemUptime = bytesToUint(dataByte.slice(7, 9));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.system_uptime = systemUptime;

        var ph13OverCurrentThreshold = null;
        try {
          ph13OverCurrentThreshold = bytesToUint(dataByte.slice(9, 11));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase1_3_overcurrent_threshold = ph13OverCurrentThreshold;

        var ph4OverCurrentThreshold = null;
        try {
          ph4OverCurrentThreshold = bytesToUint(dataByte.slice(11, 13));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.phase4_overcurrent_threshold = ph4OverCurrentThreshold;

        var overCurrentMeasurementWindow = null;
        try {
          overCurrentMeasurementWindow = bytesToUint(dataByte.slice(13, 14));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.overcurrent_measurement_window = overCurrentMeasurementWindow;

        var cyclicMessagePeriod = null;
        try {
          cyclicMessagePeriod = bytesToUint(dataByte.slice(14, 16));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.cyclic_message_period = cyclicMessagePeriod;

        var systemCyclicMessageRatio = null;
        try {
          systemCyclicMessageRatio = bytesToUint(dataByte.slice(16, 17));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.system_cyclic_message_ratio = systemCyclicMessageRatio;

        var linkCheckRatio = null;
        try {
          linkCheckRatio = bytesToUint(dataByte.slice(17, 18));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.link_check_ratio = linkCheckRatio;

        var linkCheckAttempt = null;
        try {
          linkCheckAttempt = bytesToUint(dataByte.slice(18, 19));
        } catch (e) {
          err = new Error("Unable to decode some fields : " + e.message);
          return { returnedValues: {}, err: err };
        }
        returnedValues.link_check_attempt = linkCheckAttempt;
      }
      break;
    default:
      return { returnedValues: {}, err: new Error("Unknown FPort") };
  }
  return { returnedValues: returnedValues, err: err };
}

// Return an array of integer, hex encoded.
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
        returnedByteArray[1] = intToHexVal2Byte(jsonObject[key])[0];
        returnedByteArray[2] = intToHexVal2Byte(jsonObject[key])[1];
        break;
      case "set_phase4_overcurrent_threshold":
        returnedByteArray[3] = intToHexVal2Byte(jsonObject[key])[0];
        returnedByteArray[4] = intToHexVal2Byte(jsonObject[key])[1];
        break;
      case "set_overcurrent_measurement_window":
        returnedByteArray[5] = intToHexVal1Byte(jsonObject[key]);
        break;
      case "set_cyclic_message_period":
        returnedByteArray[6] = intToHexVal2Byte(jsonObject[key])[0];
        returnedByteArray[7] = intToHexVal2Byte(jsonObject[key])[1];
        break;
      case "set_system_cyclic_message_ratio":
        returnedByteArray[8] = intToHexVal1Byte(jsonObject[key]);
        break;
      case "set_link_check_ratio":
        returnedByteArray[9] = intToHexVal1Byte(jsonObject[key]);
        break;
      case "set_link_check_attempt":
        returnedByteArray[10] = intToHexVal1Byte(jsonObject[key]);
        break;
      default:
        err = new Error("Unable to encode downlink, unknown data field: "+key);
        return {returnedByteArray: {}, err: err};
    }
  });

  return { returnedByteArray: returnedByteArray, err: err };
}

function main() {
    
  //Decode tests
  console.log(DecodeLEM302DevicePayload("00000006095B0139013C00010000001400010000002B0001", 34));
  console.log(DecodeLEM302DevicePayload("04003B003BFF45003B", 33));
  console.log(DecodeLEM302DevicePayload("01030503ffc95e000400960064280001020402", 35));
  console.log(DecodeLEM302DevicePayload("09063004B904B906F7", 33));
  console.log(DecodeLEM302DevicePayload("0103050300eb5e000400960064280001020402", 35));
  //Encode tests error
  console.log(DecodeLEM302DevicePayload("01030503ffc95e000400960064280001020402", 55));
  console.log(DecodeLEM302DevicePayload("HelloWorld", 33));

  // Encode tests
  console.log(EncodeLEM302DevicePayload(35, {"set_phase1_3_overcurrent_threshold":100}));
  console.log(EncodeLEM302DevicePayload(35, {"set_phase1_3_overcurrent_threshold":800}));
  console.log(EncodeLEM302DevicePayload(35, {"set_link_check_ratio":32}));
  console.log(EncodeLEM302DevicePayload(35, {"set_link_check_ratio":32, "set_link_check_attempt":2}));
  // Encode tests error
  console.log(EncodeLEM302DevicePayload(22, {"set_phase1_3_overcurrent_threshold":100}));
  console.log(EncodeLEM302DevicePayload(35, {"set_phase1_3_overcurrent_threshold":101.2}));
  console.log(EncodeLEM302DevicePayload(35, {"do_not_exist":32}));
}

main();
