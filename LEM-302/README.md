# LEM-302

Elevxys LEM-302 payload encoder / decoder

## Field and object descriptions
### Uplink payload decoding
These examples decoder work for all tree uplink ports and provide a JSON Object as follow :
#### Cyclic data message
- phase1_average_rms_current

Phase 1 average current over last `cyclic message period` (A)
- phase1_largest_rms_current

Phase 1 largest current over last `cyclic message period` (A)
- phase1_average_rms_voltage

Phase 1 average voltage over last `cyclic message period` (V)
- phase2_average_rms_current

Phase 2 average current over last `cyclic message period` (A)
- phase2_largest_rms_current

Phase 2 largest current over last `cyclic message period` (A)
- phase2_average_rms_voltage

Phase 2 average voltage over last `cyclic message period` (V)
- phase3_average_rms_current

Phase 3 average current over last `cyclic message period` (A)
- phase3_largest_rms_current

Phase 3 largest current over last `cyclic message period` (A)
- phase3_average_rms_voltage

Phase 3 average voltage over last `cyclic message period` (V)
- phase4_average_rms_current

Phase 4 average current over last `cyclic message period` (A)
- phase4_largest_rms_current

Phase 4 largest current over last `cyclic message period` (A)
- phase4_average_rms_voltage

Phase 4 average voltage over last `cyclic message period` (V)

#### Alarm message
- alarm_phase
Phase bit array for alarming phase
  - 1 -> Phase 1 in Alarm
  - 2 -> Phase 2 in Alarm
  - 4 -> Phase 3 in Alarm
  - 8 -> Phase 4 in Alarm
  - 9 -> Phase 1 and 4 in Alarm
  - 15 -> Phase 1, 2, 3, 4 in Alarm 
  - ...

- phase1_alarm_rms_current

Phase 1 current when alarm was triggered (A)
- phase2_alarm_rms_current

Phase 2 current when alarm was triggered (A)
- phase3_alarm_rms_current

Phase 3 current when alarm was triggered (A)
- phase4_alarm_rms_current

Phase 4 current when alarm was triggered (A)

#### Cyclic system message
- format_version

Payload format version
- fw_version_major

Firmware major version number
- fw_version_minor

Firmware minor version number
- fw_version_patch

Firmware patch version number
- temperature

Device temperature (in °C)
- humidity

Device humidity (in %)
- system_uptime 

Device uptime (in hour)
- phase1_3_overcurrent_threshold

Configuration feedback of current over-current threshold on phase 1-3
- phase4_overcurrent_threshold

Configuration feedback of current over-current threshold on phase 4
- overcurrent_measurement_window

Configuration feedback of over-current measurement windows (default : 40ms)
- cyclic_message_period

Configuration feedback of cyclic message period (default : 15 min, in minutes)
- system_cyclic_message_ratio

Configuration feedback of ratio between system and process messages (default : 100, one system message each 100 process message)
- link_check_ratio

Configuration feedback of ratio between link check message and process message (default: 4, one link check every 4 process message)
- link_check_attempt

Configuration feedback of number of attempt to have a link check confirmation before rebooting (default: 2)

## Supported fields for downlink
- set_phase1_3_overcurrent_threshold

Configuration of current over-current threshold on phase 1-3 (in A)
- set_phase4_overcurrent_threshold

Configuration of current over-current threshold on phase 4 (in A)
- set_overcurrent_measurement_window

Configuration of over-current measurement windows (in ms)
- set_cyclic_message_period

Configuration of cyclic message period (in minutes)
- set_system_cyclic_message_ratio

Configuration of ratio between system and process messages
- set_link_check_ratio

Configuration of ratio between link check message and process message
- set_link_check_attempt

Configuration of number of attempt to have a link check confirmation before rebooting

