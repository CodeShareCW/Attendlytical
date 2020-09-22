import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { EmojiProcessing } from '../../../utils/EmojiProcessing';

export default ({ participants, absentees, setAbsentees }) => {
  const [isPhotoVisible, setIsPhotoVisible] = useState({});

  /*const handleDoubleClick = (item) => {
    if (absentees.some(absentee=>absentee.student._id!=item.student._id)){
    setAbsentees((prevState) =>
      prevState.filter((absentee) => absentee !== item)
    );
    }
    else
    setAbsentees(prevState=>[item, ...prevState])

    console.log("target", item)
    console.log("absentees",absentees)
  };*/

  useEffect(() => {
    absentees.map((absentees) => {
      setIsPhotoVisible({ ...isPhotoVisible, [absentees.student._id]: false });
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
      dataSource={absentees}
      renderItem={(item) => (
        <List.Item
          key={item.student._id}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <List.Item.Meta
            avatar={
              <Avatar src={item.student.profilePictureURL} icon={<UserOutlined />} />
            }
            title={
              <span style={{ cursor: 'pointer' }}>
                {item.student.firstName} {item.student.lastName} (
                {item.student.cardID}){'  '}
              </span>
            }
            description={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <span>Mood Today: </span>
                  {item.expression ? (
                    <EmojiProcessing exp={item.expression} size='xs' />
                  ) : (
                    '-'
                  )}
                </div>

                <div>
                  Number of sample photo:{' '}
                  {item.facePhotos?.length === 0 ? (
                    <span
                      style={{
                        color: 'red',
                        fontWeight: 900,
                        fontSize: '20px',
                      }}
                    >
                      0
                    </span>
                  ) : (
                    item.facePhotos?.length || (
                      <span
                        style={{
                          color: 'red',
                          fontWeight: 900,
                          fontSize: '20px',
                        }}
                      >
                        0
                      </span>
                    )
                  )}
                </div>

                {item.photoPrivacy?.public && item.facePhotos?.length > 0 && (
                  <>
                    <div>
                      <Button onClick={() => handleShowPhoto(item.student._id)}>
                        {!isPhotoVisible[item.student._id]
                          ? 'Show Photo'
                          : 'Hide Photo'}
                      </Button>
                    </div>
                    {isPhotoVisible[item.student._id] && (
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
                                width: '100px',
                                height: '100px',
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
