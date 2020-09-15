import { FileImageOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Avatar, Button, Card, Layout, Modal, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { FacePhotoContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_FACE_PHOTOS_LIMIT } from "../../../globalData";
import { DELETE_FACE_PHOTO_MUTATION } from "../../../graphql/mutation";
import { FETCH_FACE_PHOTOS_QUERY } from "../../../graphql/query";
import { LoadingSpin } from "../../../utils/LoadingSpin";
import AddFacePhoto from "./addFacePhoto";

const { Content } = Layout;
export default () => {
  const {
    facePhotos,
    fetchedDone,
    loadFacePhotos,
    setFetchedDone,
  } = useContext(FacePhotoContext);

  const [isDescriptorVisible, setIsDescriptorVisible] = useState({});

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState();

  const { data, loading, refetch } = useQuery(FETCH_FACE_PHOTOS_QUERY, {
    onCompleted(data) {
      data.getFacePhotos.facePhotos.map((photo) => {
        setIsDescriptorVisible({ ...isDescriptorVisible, [photo._id]: false });
      });
    },
    onError(err) {
      CheckError(err);
    },
    variables: {
      limit: FETCH_FACE_PHOTOS_LIMIT,
    },
  });

  const [deleteFacePhotoCallback, deleteFacePhotoStatus] = useMutation(
    DELETE_FACE_PHOTO_MUTATION,
    {
      onError(err) {
        CheckError(err);
      },
    }
  );

  useEffect(() => {
    loadFacePhotos(data?.getFacePhotos.facePhotos || []);
    if (data && !data.getFacePhotos.hasNextPage) {
      setFetchedDone(true);
    }
  }, [data]);

  const handleDescriptorVisible = (id) => {
    setIsDescriptorVisible({
      ...isDescriptorVisible,
      [id]: !isDescriptorVisible[id],
    });
  };

  const handleDelete = () => {
    deleteFacePhotoCallback({
      update(_, { data }) {
        message.success(data.deleteFacePhoto);
        setSelectedPhoto(null);
        setIsDeleteModalVisible(false);
        refetch();
      },
      variables: {
        photoID: selectedPhoto._id,
      },
    });
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleFetchMore = () => {};
  return (
    <Layout className="enrolments layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: "Face Gallery", link: "/facegallery" }]}
        />

        <Content className="enrolments__content">
          <Card>
            <AddFacePhoto refetch={refetch} />
            <Card title={<strong>Your Gallery</strong>}>
              {loading && <LoadingSpin loading={loading} />}
              {facePhotos.map((photo, index) => (
                <Card key={photo._id}>
                  <Avatar
                    shape="square"
                    size={120}
                    src={photo.photoURL}
                    icon={<FileImageOutlined />}
                    alt={"Face Photo: " + index}
                  />
                  &nbsp;
                  <strong>Face Descriptor: </strong>
                  <Button onClick={() => handleDescriptorVisible(photo._id)}>
                    Show
                  </Button>
                  {isDescriptorVisible[photo._id] && (
                    <p
                      style={{
                        wordBreak: "break-all",
                        marginBottom: "10px",
                        backgroundColor: "lightblue",
                      }}
                    >
                      {photo.faceDescriptor}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Button
                      type="danger"
                      onClick={() => {
                        setIsDeleteModalVisible(true);
                        setSelectedPhoto(photo);
                      }}
                    >
                      Delete Photo
                    </Button>
                  </div>
                </Card>
              ))}
              {facePhotos.length > 0 && !fetchedDone && (
                <Button onClick={handleFetchMore} loading={loading}>
                  Load More
                </Button>
              )}

              {!loading && facePhotos.length !== 0 && fetchedDone && (
                <div className="allLoadedCard">
                  <h3>All Face Photo Loaded</h3>
                </div>
              )}

              {!loading && facePhotos.length === 0 && (
                <h1>No face photo added...</h1>
              )}
            </Card>
          </Card>
          <Modal
            visible={isDeleteModalVisible}
            title={<strong>Delete Photo</strong>}
            onOk={handleDelete}
            onCancel={handleCancel}
            okButtonProps={{
              loading: deleteFacePhotoStatus.loading,
              disabled: deleteFacePhotoStatus.loading,
            }}
            cancelButtonProps={{ disabled: deleteFacePhotoStatus.loading }}
            okText="Delete"
          >
            <Avatar
              shape="square"
              src={selectedPhoto?.photoURL}
              size={200}
              icon={<FileImageOutlined />}
            />
            <p>Are you sure to delete this photo?</p>
          </Modal>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
