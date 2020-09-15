import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CheckError } from "../../../ErrorHandling";
import { getFullFaceDescription, loadModels } from "../../../faceUtil";
import DrawBox from "../../../faceUtil/drawBox";
import {
  DEFAULT_UPLOAD_OPTION,
  DEFAULT_WEBCAM_RESOLUTION,
  inputSize,
  UPLOAD_OPTION,
  webcamResolutionType,
} from "../../../globalData";
import { ADD_FACE_PHOTO_MUTATION } from "../../../graphql/mutation";

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UploadFromWebcam = () => {
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
  const [inputDevices, setInputDevices] = useState([]);
  const [selectedWebcam, setSelectedWebcam] = useState();

  const [fullDesc, setFullDesc] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);

  const webcam = useRef();

  const handleSelectWebcam = (value) => {
    setSelectedWebcam(value);
  };
  const handleWebcamResolution = (value) => {
    webcamResolutionType.map((type) => {
      if (value === type.label) {
        setCamWidth(type.width);
        setCamHeight(type.height);
      }
    });
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (!!webcam.current) {
        getFullFaceDescription(webcam.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
          })
          .catch((err) => {
            message.info("Getting frame...");
          });
      }
    }

    let interval = setInterval(() => {
      capture();
    }, 1500);

    return () => clearInterval(interval);
  });

  return (
    <Card>
      <Form>
        <Form.Item label="Webcam">
          <Select
            defaultValue="Select Webcam"
            style={{ width: 500 }}
            onChange={handleSelectWebcam}
          >
            {inputDevices?.inputDevice?.map((device) => (
              <Option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </Option>
            ))}
          </Select>
          <span className="alert">Please select webcam</span>
        </Form.Item>
        <Form.Item label="Webcam Size">
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
      {selectedWebcam && (
        <Webcam
          ref={webcam}
          audio={false}
          width={camWidth}
          height={camHeight}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            deviceId: selectedWebcam,
          }}
        />
      )}

      <DrawBox
        fullDesc={fullDesc}
        imageHeight={camHeight}
        imageWidth={camWidth}
        boxColor={"blue"}
        mode="Detection"
        setDetectionCount={setDetectionCount}
      />

      {!selectedWebcam && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Select the available webcam to open
        </div>
      )}
      {selectedWebcam && (
        <div>
          <p>
            Number of detection: {detectionCount}{" "}
            {detectionCount > 1 && (
              <span className="alert">Cannot more than 2</span>
            )}
          </p>
          Face Descriptors:{" "}
          {detectionCount === 0
            ? "Empty"
            : fullDesc.map((desc, index) => (
                <div
                  key={index}
                  style={{
                    wordBreak: "break-all",
                    marginBottom: "10px",
                    backgroundColor: "lightblue",
                  }}
                >
                  <strong style={{ fontSize: "20px", color: "red" }}>
                    {index}:{" "}
                  </strong>
                  {desc.descriptor.toString()}
                </div>
              ))}
        </div>
      )}
    </Card>
  );
};

const UploadFromDisk = ({ addFacePhotoCallback, refetch, loading }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fullDesc, setFullDesc] = useState([]);
  const [faceDescriptor, setFaceDescriptor] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isRunningFaceDetector, setIsRunningFaceDetector] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);

  const [fileList, setFileList] = useState({});
  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList }) => {
    if (fileList.length === 0) {
      setFaceDescriptor([]);
      setDetectionCount(0);
      setFileList([]);
      return;
    }

    if (!fileList[0].url && !fileList[0].preview) {
      fileList[0].preview = await getBase64(fileList[0].originFileObj);
    }
    setPreviewImage(fileList[0].url || fileList[0].preview);
    setFileList(fileList);
    setTimeout(() => {
      if (fileList[0].preview.length > 0) {
        setIsRunningFaceDetector(true);
        getFullFaceDescription(fileList[0].preview, inputSize).then((data) => {
          setFullDesc(data);
          setDetectionCount(data.length);
          setFaceDescriptor(data[0]?.descriptor);
          setIsRunningFaceDetector(false);
        });
      }
    }, 1000);
  };

  const handleSubmit = () => {
    if (previewImage.length > 0 && faceDescriptor.length === 128)
      addFacePhotoCallback({
        update(_, data) {
          refetch();
          message.success("Add Face Photo Success!");
        },
        onError(err) {
          CheckError(err);
        },
        variables: {
          photoData: previewImage,
          faceDescriptor: faceDescriptor.toString(),
        },
      });
  };
  console.log(faceDescriptor);
  return (
    <>
      <Row style={{ display: "flex", alignItems: "center" }}>
        <Col>
          <Upload
            beforeUpload={() => false}
            multiple={false}
            listType="picture-card"
            onPreview={handlePreview}
            onChange={handleChange}
            accept="image/x-png,image/gif,image/jpeg"
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Col>
        <Col>
          {" "}
          <Button
            type="primary"
            loading={loading}
            disabled={
              previewImage.length === 0 ||
              loading ||
              detectionCount !== 1 ||
              faceDescriptor.length !== 128
            }
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Col>
      </Row>
      <Row>
        <div>
          {detectionCount > 1 && (
            <span className="alert">Only single face allowed</span>
          )}
          {detectionCount === 0 && (
            <span className="alert">No face detected</span>
          )}
          <p>
            Number of detection:{" "}
            {isRunningFaceDetector ? (
              <>
                Detecting face... <LoadingOutlined />
              </>
            ) : (
              detectionCount
            )}
          </p>
          Face Descriptor:{" "}
          {isRunningFaceDetector && (
            <>
              Generating 128 measurements... <LoadingOutlined />
            </>
          )}
          {detectionCount !== 1 && !isRunningFaceDetector && <span>Empty</span>}
          {detectionCount === 1 && (
            <div
              style={{
                wordBreak: "break-all",
                marginBottom: "10px",
                backgroundColor: "lightblue",
              }}
            >
              {faceDescriptor && faceDescriptor.toString()}
            </div>
          )}
        </div>
      </Row>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ({ addFacePhoto, refetch }) => {
  const [selectedUploadOption, setSelectedUploadOption] = useState(
    DEFAULT_UPLOAD_OPTION
  );

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadedModel, setLoadedModel] = useState([]);
  const [loadingMessageError, setLoadingMessageError] = useState("");

  const [addFacePhotoCallback, { loading }] = useMutation(
    ADD_FACE_PHOTO_MUTATION,
    {
      onError(err) {
        CheckError(err);
      },
    }
  );

  const handleSelectUploadOption = (value) => {
    setSelectedUploadOption(value);
  };

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(
        setLoadingMessage,
        setLoadedModel,
        setLoadingMessageError
      );
      setIsAllModelLoaded(true);
    }
    loadingtheModel();
  }, [isAllModelLoaded]);

  return (
    <Card>
      <Card title="Model Load">
        <ModelLoadStatus
          isAllModelLoaded={isAllModelLoaded}
          loadedModel={loadedModel}
          loadingMessageError={loadingMessageError}
          type="FD"
        />
        <ModelLoadStatus
          isAllModelLoaded={isAllModelLoaded}
          loadedModel={loadedModel}
          loadingMessageError={loadingMessageError}
          type="FLD"
        />
        <ModelLoadStatus
          isAllModelLoaded={isAllModelLoaded}
          loadedModel={loadedModel}
          loadingMessageError={loadingMessageError}
          type="FR"
        />
        <ModelLoadStatus
          isAllModelLoaded={isAllModelLoaded}
          loadedModel={loadedModel}
          loadingMessageError={loadingMessageError}
          type="FE"
        />
      </Card>
      <br />
      {isAllModelLoaded && loadingMessageError.length === 0 && (
        <div>
          {" "}
          <Row>
            <Form>
              <Form.Item label="Upload Option">
                <Select
                  defaultValue={DEFAULT_UPLOAD_OPTION}
                  style={{ width: 200 }}
                  onChange={handleSelectUploadOption}
                >
                  {UPLOAD_OPTION.map((op) => (
                    <Option key={op} value={op}>
                      {op}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Row>
          <Row>
            <Col>
              Selected Option: <strong>{selectedUploadOption}</strong>
            </Col>
          </Row>
          <Row>
            <Col>
              {selectedUploadOption === DEFAULT_UPLOAD_OPTION ? (
                <UploadFromDisk
                  addFacePhotoCallback={addFacePhotoCallback}
                  refetch={refetch}
                  loading={loading}
                />
              ) : (
                <UploadFromWebcam
                  addFacePhotoCallback={addFacePhotoCallback}
                  refetch={refetch}
                  loading={loading}
                />
              )}
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
};

const ModelLoadStatus = ({
  isAllModelLoaded,
  loadedModel,
  loadingMessageError,
  type,
}) => {
  const modelType = () => {
    switch (type) {
      case "FD":
        return "Face Detector";
      case "FLD":
        return "Facial Landmark Detector";
      case "FR":
        return "Feature Extractor";
      case "FE":
        return "Facial Expression Detector";
    }
  };
  return (
    <Row>
      <Col style={{ marginRight: "10px" }}>{modelType()}:</Col>
      <Col style={{ marginRight: "10px" }}>
        <strong>
          {!isAllModelLoaded ? (
            <strong>Loading</strong>
          ) : loadedModel.find((item) => item === type) ? (
            <strong>Loaded</strong>
          ) : (
            <strong style={{ color: "red" }}>{loadingMessageError}</strong>
          )}
        </strong>
      </Col>
      <Col>
        {!isAllModelLoaded && (
          <LoadingOutlined style={{ fontSize: "18px", color: "red" }} />
        )}
      </Col>
    </Row>
  );
};
