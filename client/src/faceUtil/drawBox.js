import React, { useEffect, useState } from "react";
import FacebookEmoji from "react-facebook-emoji";
import { EmojiExpressionsType } from "../globalData";

export default (props) => {
  const [descriptors, setDescriptors] = useState(null);
  const [detections, setDetections] = useState(null);
  const [expressions, setExpressions] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    async function getDescription() {
      const { fullDesc, faceMatcher } = props;
      if (!!fullDesc) {
        await setDescriptors(fullDesc.map((fd) => fd.descriptor));
        await setDetections(fullDesc.map((fd) => fd.detection));
        await setExpressions(fullDesc.map((fd) => fd.expressions));
        if (!!descriptors && !!faceMatcher) {
          let match = await descriptors.map((descriptor) =>
            faceMatcher.findBestMatch(descriptor)
          );
          setMatch(match);
        }
      }

      console.log(descriptors, detections);
    }
    getDescription();

    return ()=>{
      //clean effect because it will cause the mess from previous effect
      setDescriptors(null)
      setDetections(null)
      setExpressions(null)
    }
  }, [props]);

  const EmojiProcessing = ({ exp }) => {
    const emojiExpression = EmojiExpressionsType.find(
      (type) => type.expression === exp
    );
    if (
      emojiExpression.expression === "disgusted" ||
      emojiExpression.expression === "fearful"
    )
      return <strong style={{fontSize: "50px"}}>{emojiExpression.emoji}</strong>;
    return <FacebookEmoji type={emojiExpression.emoji} />;
  };

  const { imageWidth, imageHeight, boxColor } = props;

  let box = null;

  if (!!detections) {

    console.log("Expression Length", expressions?.length)
    console.log("Detection Lentght:", detections?.length)
    box = detections.map((detection, i) => {
      const relativeBox = detection.relativeBox;
      const dimension = detection._imageDims;
      let _X = imageWidth * relativeBox._x;
      let _Y =
        (relativeBox._y * imageHeight * dimension._height) / dimension._width -
        imageHeight +
        100;
      let _W = imageWidth * relativeBox.width;
      let _H =
        (relativeBox.height * imageHeight * dimension._height) /
        dimension._width;
      return (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              border: "solid",
              borderColor:
                !!match && match[i] && match[i]._label !== "unknown"
                  ? "rgba(0, 255, 0, 0.4)"
                  : "rgba(125, 125, 125, 0.4)",
              height: _H,
              width: _W,
              transform: `translate(${_X}px,${_Y}px)`,
            }}
          >
            {!!match && match[i] && match[i]._label !== "unknown" ? (
              <div
                style={{
                  backgroundColor: "rgba(0, 255, 0, 0.4)",
                  border: "solid",
                  width: _W,
                  marginTop: 0,
                  color: "#fff",
                  transform: `translate(-3px,${_H}px)`,
                }}
              >
                {match[i]._label}
                <br />
                {
                  !!expressions&&expressions.length>0&&
                  <EmojiProcessing
                    exp={Object.keys(expressions[i]).find(
                      (key) =>
                        expressions[i][key] ===
                        Object.values(expressions[i]).reduce((a, b) =>
                          Math.max(a, b)
                        )
                    )}
                    width={_W}
                    height={_H}
                  />
                }
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "rgba(125, 125, 125, 0.4)",
                  border: "solid",
                  width: _W,
                  marginTop: 0,
                  color: "#fff",
                  transform: `translate(-3px,${_H}px)`,
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
