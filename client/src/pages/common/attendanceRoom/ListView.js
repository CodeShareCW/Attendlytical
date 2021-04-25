import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";

export default ({ studentList }) => {
  const [isPhotoVisible, setIsPhotoVisible] = useState({});

  /*const handleDoubleClick = (item) => {
    if (studentList.some(absentee=>absentee.student._id!=item.student._id)){
    setstudentList((prevState) =>
      prevState.filter((absentee) => absentee !== item)
    );
    }
    else
    setstudentList(prevState=>[item, ...prevState])

    console.log("target", item)
    console.log("studentList",studentList)
  };*/

  useEffect(() => {
    studentList.map((studentList) => {
      setIsPhotoVisible({
        ...isPhotoVisible,
        [studentList.student._id]: false,
      });
    });
  }, []);

  const handleShowPhoto = (id) => {
    setIsPhotoVisible({ ...isPhotoVisible, [id]: !isPhotoVisible[id] });
  };

  return (
    <List
      pagination={{
        pageSize: 10,
      }}
      itemLayout="horizontal"
      dataSource={studentList}
      renderItem={(item) => (
        <List.Item
          key={item.student._id}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={item.student.profilePictureURL}
                icon={<UserOutlined />}
              />
            }
            title={
              <span style={{ cursor: "pointer" }}>
                {item.student.firstName} {item.student.lastName} (
                {item.student.cardID}){"  "}
              </span>
            }
            description={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <p>Check in: {item.attend_at? moment(item.attend_at).format("DD/MM/YYYY h:mm:ss a"): "-"}</p>
                </div>
                <div>
                  Number of sample photo:{" "}
                  {item.facePhotos?.length === 0 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: 900,
                        fontSize: "20px",
                      }}
                    >
                      0
                    </span>
                  ) : (
                    item.facePhotos?.length || (
                      <span
                        style={{
                          color: "red",
                          fontWeight: 900,
                          fontSize: "20px",
                        }}
                      >
                        0
                      </span>
                    )
                  )}
                </div>

                {item.facePhotos?.length > 0 && (
                  <>
                    <div>
                      <Button onClick={() => handleShowPhoto(item.student._id)}>
                        {!isPhotoVisible[item.student._id]
                          ? "Show Photo"
                          : "Hide Photo"}
                      </Button>
                    </div>
                    {isPhotoVisible[item.student._id] && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.facePhotos?.map((photo) => (
                          <div key={photo._id}>
                            <img
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "10px",
                              }}
                              data-src={photo.photoURL}
                              className="lazyload"
                              src={`${process.env.PUBLIC_URL}/img/loader.gif`}
                              alt={item.firstName}
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
