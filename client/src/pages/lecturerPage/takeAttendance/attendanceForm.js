import { DatePicker, Form, Select, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import {
  DEFAULT_WEBCAM_RESOLUTION,
  webcamResolutionType,
} from '../../../globalData';
import './TakeAttendance.css';


const { Option } = Select;

export default ({inputDevices, handleSelectWebcam, handleWebcamResolution}) => {
  return (
    <Form>
      <Form.Item label='Date'>
        <DatePicker defaultValue={moment()} format='YYYY/MM/DD' />
      </Form.Item>
      <Form.Item label='Time'>
        {' '}
        <TimePicker defaultValue={moment()} format='HH:mm' />
      </Form.Item>

      <Form.Item label='Webcam'>
        <Select
          defaultValue='Select Webcam'
          style={{ width: 500 }}
          onChange={handleSelectWebcam}
        >
          {inputDevices?.inputDevice?.map((device) => (
            <Option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Webcam Size'>
        <Select
          defaultValue={DEFAULT_WEBCAM_RESOLUTION.label}
          style={{ width: 200 }}
          onChange={handleWebcamResolution}
        >
          {webcamResolutionType.map((type) => (
            <Option key={type.label} value={type.label}>
              {type.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
