import { LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Card, Layout, message, Switch } from "antd";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ROBOT_ICON_URL } from "../../../assets";
import Modal from "../../../components/common/customModal";
import {
  Footer,
  Greeting,
  Navbar,
  PageTitleBreadcrumb,
} from "../../../components/common/sharedLayout";
import { FacePhotoContext } from "../../../context";
import { CheckError } from "../../../ErrorHandling";
import { FETCH_FACE_PHOTOS_LIMIT, modalItems } from "../../../globalData";
import {
  DELETE_FACE_PHOTO_MUTATION,
  TOGGLE_PHOTO_PRIVACY_MUTATION,
} from "../../../graphql/mutation";
import {
  FETCH_FACE_PHOTOS_COUNT_QUERY,
  FETCH_FACE_PHOTOS_QUERY,
  FETCH_PHOTO_PRIVACY_QUERY,
} from "../../../graphql/query";
import { EmojiProcessing } from "../../../utils/EmojiProcessing";
import { FetchChecker } from "../../../utils/FetchChecker";
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
  const [photoPrivacy, setPhotoPrivacy] = useState(false);

  const { data, loading, refetch, fetchMore } = useQuery(
    FETCH_FACE_PHOTOS_QUERY,
    {
      onCompleted(data) {
        data.getFacePhotos.facePhotos.map((photo) => {
          setIsDescriptorVisible({
            ...isDescriptorVisible,
            [photo._id]: false,
          });
        });
      },
      onError(err) {
        CheckError(err);
      },
      variables: {
        limit: FETCH_FACE_PHOTOS_LIMIT,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const photoPrivacyQuery = useQuery(FETCH_PHOTO_PRIVACY_QUERY, {
    onCompleted(data) {
      setPhotoPrivacy(data.getPhotoPrivacy);
    },
    onError(err) {
      CheckError(err);
    },
    notifyOnNetworkStatusChange: true,
  });

  const facePhotosCountQuery = useQuery(FETCH_FACE_PHOTOS_COUNT_QUERY, {
    onError(err) {
      CheckError(err);
    },
  });

  const [togglePhotoPrivacyCallback, togglePhotoPrivacyStatus] = useMutation(
    TOGGLE_PHOTO_PRIVACY_MUTATION,
    {
      onCompleted(data) {
        message.success(
          data.togglePhotoPrivacy ? "Set to public mode" : "Set to private mode"
        );
        photoPrivacyQuery.refetch();
      },
      onError(err) {
        CheckError(err);
      },
    }
  );

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
    if (data) {
      if (!data.getFacePhotos.hasNextPage) setFetchedDone(true);
      else setFetchedDone(false);
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
        facePhotosCountQuery.refetch();
      },
      variables: {
        photoID: selectedPhoto._id,
      },
    });
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleTogglePhotoPrivacy = (value) => {
    togglePhotoPrivacyCallback({
      update(_, { data }) {
        setPhotoPrivacy(data.togglePhotoPrivacy);
      },
      variables: {
        isPublic: value,
      },
    });
  };

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        limit: FETCH_FACE_PHOTOS_LIMIT,
        cursor: facePhotos[facePhotos.length - 1]._id,
      },
      onError(err) {
        CheckError(err);
      },
      updateQuery: (pv, { fetchMoreResult }) => {
        return {
          getFacePhotos: {
            __typename: "FacePhotos",
            facePhotos: [
              ...pv.getFacePhotos.facePhotos,
              ...fetchMoreResult.getFacePhotos.facePhotos,
            ],
            hasNextPage: fetchMoreResult.getFacePhotos.hasNextPage,
          },
        };
      },
    });
  };
  return (
    <Layout className="layout">
      <Navbar />
      <Layout>
        <Greeting />
        <PageTitleBreadcrumb
          titleList={[{ name: "Face Gallery", link: "/facegallery" }]}
        />

        <Content>
          <Card>
            <AddFacePhoto
              galleryRefetch={refetch}
              countRefetch={facePhotosCountQuery.refetch}
            />
            <Card
              title={
                <strong>
                  Your Gallery:{" "}
                  {facePhotosCountQuery.data?.getFacePhotosCount || 0}
                </strong>
              }
            >
              <span>
                <h1>
                  {" "}
                  {!photoPrivacyQuery.loading &&
                  !togglePhotoPrivacyStatus.loading ? (
                    <Switch
                      onChange={handleTogglePhotoPrivacy}
                      checked={photoPrivacy}
                    />
                  ) : (
                    <LoadingOutlined
                      style={{ fontSize: "25px", color: "blue" }}
                    />
                  )}
                  &nbsp;Public:{" "}
                  {photoPrivacyQuery.data?.getPhotoPrivacy ? "Yes" : "No"}{" "}
                  &nbsp;
                  <strong style={{ color: "darkred" }}>
                    (Lecturer can view your uploaded photo if public)
                  </strong>
                </h1>
              </span>
              {facePhotos.map((photo, index) => (
                <Card key={photo._id}>
                  <Card>
                    <img
                      height={150}
                      width={120}
                      data-src={photo.photoURL}
                      src={`${process.env.PUBLIC_URL}/img/loader.gif`}
                      className="lazyload"
                      alt={"Face Photo: " + index}
                    />
                    <br /> <br />
                    <div>
                      <img
                        src={ROBOT_ICON_URL.link}
                        style={{
                          width: ROBOT_ICON_URL.width,
                          height: ROBOT_ICON_URL.height,
                        }}
                      />
                      <span style={{ color: "darkblue", fontWeight: 900 }}>
                        : Feel like you are{" "}
                      </span>
                      <span>
                        <EmojiProcessing exp={photo.expression} size="sm" />
                      </span>
                    </div>
                  </Card>
                  &nbsp;
                  <strong>Face Descriptor: </strong>
                  <Button onClick={() => handleDescriptorVisible(photo._id)}>
                    {!isDescriptorVisible[photo._id] ? "Show" : "Hide"}
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
                    <p>Uploaded at: {moment(photo.createdAt).format("LLL")}</p>
                  </div>
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
              <LoadingSpin loading={loading} />
              {/*give text of fetch result*/}
              <FetchChecker
                loading={loading}
                payload={facePhotos}
                fetchedDone={fetchedDone}
                allLoadedMessage="All Face Photo Loaded"
                noItemMessage="No Face Photo Added..."
                handleFetchMore={handleFetchMore}
              />

              {/*modal backdrop*/}
              <Modal
                title="Delete Photo"
                action={modalItems.facePhoto.action.delete}
                itemType={modalItems.facePhoto.name}
                visible={isDeleteModalVisible}
                loading={deleteFacePhotoStatus.loading}
                handleOk={handleDelete}
                handleCancel={handleCancel}
                payload={selectedPhoto}
              />
            </Card>
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};
