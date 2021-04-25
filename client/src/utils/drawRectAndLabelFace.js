export const drawRectAndLabelFace = (descriptions, faceDB, participants, ctx) => {
  // Loop through each desc
  descriptions &&
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const landmarksPoint=desc.landmarks._positions;

console.log(landmarksPoint)
      // const text = desc['class'];
      const bestMatch = faceDB.findBestMatch(desc.descriptor);
      // Set styling
      if (bestMatch._label != "unknown") {
        let filterParticipants = participants.filter(
          (participant) => participant.student._id == bestMatch._label
        );
        console.log(filterParticipants);
        bestMatch._label = filterParticipants[0].student.firstName +" "+ filterParticipants[0].student.lastName + " (" + filterParticipants[0].student.cardID + ")";
      }

      ctx.font = "normal 18px Gotham, Helvetica Neue, sans-serif";
      ctx.lineWidth = 2;
      ctx.strokeStyle = bestMatch._label == "unknown" ? "#E00" : "#0E0";

      //draw 68 points
      landmarksPoint.map(point=>{
        ctx.beginPath();
        ctx.fillText(bestMatch._label, x, y + height + 20);
        ctx.fillStyle = bestMatch._label == "unknown" ? "#E00" : "#0E0";
        ctx.arc(point._x, point._y, 3, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fill();
      })
    

      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillStyle = bestMatch._label == "unknown" ? "#E00" : "#0E0";
      ctx.rect(x, y, width, height);

      ctx.fillText(bestMatch._label, x, y + height + 20);
      ctx.fillText(`L2: ${bestMatch.distance.toFixed(2)}`, x, y);

      ctx.stroke();
    });
};
