import React, { useContext, useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { EmojiProcessing } from '../utils/EmojiProcessing';
import { ROBOT_ICON_URL } from '../assets';
import './drawBox.css';
import { FaceThresholdDistanceContext } from '../context';
export default ({
  fullDesc,
  faceMatcher,
  participants,
  imageWidth,
  imageHeight,
  setDetectionCount,
  setAbsentees,
  mode = 'Recognition',
}) => {
  const {threshold} = useContext(FaceThresholdDistanceContext)
  const [descriptors, setDescriptors] = useState(null);
  const [detections, setDetections] = useState(null);
  const [expressions, setExpressions] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function getDescription() {
      if (!!fullDesc) {
        await setDescriptors(fullDesc.map((fd) => fd.descriptor));
        await setDetections(fullDesc.map((fd) => fd.detection));
        await setExpressions(fullDesc.map((fd) => fd.expressions));
        if (!!descriptors && !!faceMatcher) {
          let match = await descriptors.map((descriptor) =>
            faceMatcher.findBestMatch(descriptor)
          );
          const attendees = match.map((m, index) => {
            const studentWhoAttend = participants.filter(
              (profile) => profile.student._id == m._label
            );

            if (
              !!studentWhoAttend &&
              studentWhoAttend.length > 0 &&
              !!expressions &&
              expressions.length > 0
            )
              return Object.assign(studentWhoAttend[0], {
                expression: Object.keys(expressions[index]).find(
                  (key) =>
                    expressions[index][key] ===
                    Object.values(expressions[index]).reduce((a, b) =>
                      Math.max(a, b)
                    )
                ),
              });
            return [];
          });

          setMatch(match);
          setAbsentees((prevAbsentees) =>
            prevAbsentees.filter((absentee) => !attendees.includes(absentee))
          );
        }
      }
    }
    getDescription();

    return () => {
      setDescriptors(null);
      setDetections(null);
      setExpressions(null);
    };
  }, [fullDesc, faceMatcher]);


  useEffect(()=>{
    if (!!detections)
      setDetectionCount(detections?.length);
  }, [detections])
  
  let box = null;

  if (!!detections) {
    box = detections.map((detection, i) => {
      const relativeBox = detection.relativeBox;
      const dimension = detection._imageDims;
      let _X = imageWidth * relativeBox._x;
      let _Y =
        (relativeBox._y * imageHeight * dimension._height) / dimension._width -
        imageHeight +0.1*imageHeight;
      let _W = imageWidth * relativeBox.width;
      let _H =
        (relativeBox.height * imageHeight * dimension._height) /
        dimension._width;

      //Detection mode
      if (mode === 'Detection') {
        return (
          <div key={i}>
            <div
              className='drawBox__detection-box'
              style={{
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            >
              <div
                className='drawBox__detection-label'
                style={{
                  width: _W,
                  transform: `translate(-3px,${_H}px)`,
                }}
              >
                <img
                  src={ROBOT_ICON_URL.link}
                  style={{
                    width: ROBOT_ICON_URL.width,
                    height: ROBOT_ICON_URL.height,
                  }}
                />
                : Feel like you are&nbsp;
                {!!expressions && expressions.length > 0 && (
                  <EmojiProcessing
                    exp={Object.keys(expressions[i]).find(
                      (key) =>
                        expressions[i][key] ===
                        Object.values(expressions[i]).reduce((a, b) =>
                          Math.max(a, b)
                        )
                    )}
                    size='xs'
                  />
                )}
              </div>
            </div>
          </div>
        );
      } //Recognition mode
      else
        return (
          <div key={i}>
            <div
              className={
                !!match && match[i] && match[i]._label !== 'unknown'
                  ? 'drawBox__recognition-knownBox'
                  : 'drawBox__recognition-unknownBox'
              }
              style={
                {
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            >
              {!!match && match[i] && match[i]._label !== 'unknown' ? (
                <>
                <div
                      style={{
                        position: "absolute",
                        color: 'green',
                        fontWeight: 900,
                        width: _W,
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      {`Euc Dist: ${match[i]._distance.toFixed(2)} < ${threshold} thres`}
                    </div>
                  <div
                    className='drawBox__recognition-knownLabel'
                    style={{
                      minWidth: 100,
                      width: _W,
                      transform: `translate(${_W}px,${-3}px)`,
                    }}
                  >
                    {participants.map((profile) => (
                      <div key={profile.student._id}>
                        {profile.student._id == match[i]._label && (
                          <>
                            <Avatar
                              src={profile.student.profilePictureURL}
                              icon={<UserOutlined />}
                            />
                            &nbsp;
                            {`${profile.student.firstName} (${profile.student.cardID})`}
                          </>
                        )}
                      </div>
                    ))}
                    <br />
                    <img
                      src={ROBOT_ICON_URL.link}
                      style={{
                        width: ROBOT_ICON_URL.width,
                        height: ROBOT_ICON_URL.height,
                      }}
                    />
                    : &nbsp;
                    {!!expressions && expressions.length > 0 && (
                      <EmojiProcessing
                        exp={Object.keys(expressions[i]).find(
                          (key) =>
                            expressions[i][key] ===
                            Object.values(expressions[i]).reduce((a, b) =>
                              Math.max(a, b)
                            )
                        )}
                        size='xs'
                      />
                    )}

                  </div>
                </>
              ) : (
                <div
                  className='drawBox__recognition-unknownLabel'
                  style={{
                    width: _W,
                    transform: `translate(${_W}px,${-3}px)`,
                  }}
                >
                  unknown
                  <br />
                </div>
              )}
            </div>
          </div>
        );
    });
  }

  return <div>{box}</div>;
};
