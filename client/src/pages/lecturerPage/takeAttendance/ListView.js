import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, List } from 'antd';
import React, { useEffect, useState } from 'react';
import FacebookEmoji from 'react-facebook-emoji';

export default ({ data, absentees, setAttendees, setAbsentees }) => {
  const [isPhotoVisible, setIsPhotoVisible] = useState({});

  const handleDoubleClick = (item) => {
    const test = absentees.find((absentee) => absentee === item);
    if (test) {
      setAttendees((prevState) => [...prevState, item]);
      setAbsentees((prevState) =>
        prevState.filter((absentee) => absentee !== item)
      );
    } else {
      setAbsentees((prevState) => [...prevState, item]);
      setAttendees((prevState) =>
        prevState.filter((attendee) => attendee !== item)
      );
    }
  };

  useEffect(() => {
    absentees.map((absentee) => {
      setIsPhotoVisible({ ...isPhotoVisible, [absentee._id]: false });
    });
  }, []);

  const handleShowPhoto = (id) => {
    setIsPhotoVisible({ ...isPhotoVisible, [id]: !isPhotoVisible[id] });
  };
  return (
    <List
      pagination={{
        pageSize: 20,
      }}
      itemLayout='horizontal'
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <List.Item.Meta
            avatar={
              <Avatar src={item.profilePictureURL} icon={<UserOutlined />} />
            }
            title={
              <span
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => handleDoubleClick(item)}
              >
                {item.firstName} {item.lastName} ({item.cardID}){'  '}
              </span>
            }
            description={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <span>Mood Today: </span>
                  <FacebookEmoji type='yay' size='xs' />
                </div>

                <div>
                  Number of sample photo: {item.facePhotos?.length || 0}
                </div>

                {item.facePhotos?.length > 0 && (
                  <>
                    <div>
                      <Button onClick={() => handleShowPhoto(item._id)}>
                        Toggle Show Photo
                      </Button>
                    </div>
                    {isPhotoVisible[item._id] && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'space-between',
                          flexWrap: 'wrap',
                        }}
                      >
                        {item.facePhotos?.map((photo) => (
                          <div key={photo._id}>
                            <img
                              src={photo.photoURL}
                              style={{
                                width: '50px',
                                height: '50px',
                                margin: '10px',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};
