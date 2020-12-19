import { Modal, Spin, Avatar } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import React from 'react';
import { modalItems } from '../../../globalData';
export default ({
  title,
  action,
  itemType,
  visible,
  loading,
  handleOk,
  handleCancel,
  payload,
}) => {
  const template = (type, payload) => {
    switch (type) {
      case modalItems.course.name:
        return (
          <>
            <p>
              <strong>Course ID</strong>: {payload.shortID}
            </p>
            <p>
              <strong>Particular</strong>:{' '}
              {payload.code + '-' + payload.name + ' (' + payload.session + ')'}
            </p>
          </>
        );
      case modalItems.enrolment.name:
        return (
          <>
            <strong>Student: </strong>
            {payload.student?.firstName} {payload.student?.lastName} (
            {payload.student?.cardID})
            <br />
            <br />
            <strong>Course (ID: {payload.course?.shortID}): </strong>
            {payload.course?.code} {payload.course?.name} (
            {payload.course?.session})
          </>
        );
      case modalItems.facePhoto.name:
        return (
          <>
            <Avatar
              shape='square'
              src={payload?.photoURL}
              size={200}
              icon={<FileImageOutlined />}
            />
          </>
        );
      case modalItems.participant.name:
        return (
          <div>
            <strong>Particular</strong>:{' '}
            {payload.firstName +
              '-' +
              payload.lastName +
              ' (' +
              (payload.cardID||payload.matricNumber) +
              ')'} {/* in case table and other stuff mess with cardID */}
        </div>
        );
      case modalItems.attendance.name:
        return (
          <>
            <p>
              <strong>Attendance ID: </strong>
              {payload.key}
            </p>
            <br />
            <p>
              <strong>Course: </strong>
              {payload.course}
            </p>
            <p>
              <strong>Date: </strong>
              {payload.date}
            </p>
            <p>
              <strong>Time: </strong>
              {payload.time}
            </p>
            <p>
              <strong>Stats: </strong>
              {payload.stats}
            </p>
          </>
        );
      default:
        return;
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      okText={action}
    >
      {!loading ? (
        <div>
          <p>
            Are you sure to{' '}
            <strong style={{ fontSize: '15px' }}>{action}</strong> the following{' '}
            {itemType}?
          </p>
          {template(itemType, payload)}
        </div>
      ) : (
        <Spin tip={'Loading, please wait...'}>
          <p>
            Are you sure to {action} the following {itemType}?
          </p>
          {template(itemType, payload)}
        </Spin>
      )}
    </Modal>
  );
};
