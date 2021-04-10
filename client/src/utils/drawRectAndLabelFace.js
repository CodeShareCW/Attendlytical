export const drawRectAndLabelFace = (descriptions, faceDB, participants, ctx) => {
  // Loop through each desc
  descriptions &&
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
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

      ctx.font = "normal 15px Gotham, Helvetica Neue, sans-serif";
      ctx.lineWidth = 2;
      ctx.strokeStyle = bestMatch._label == "unknown" ? "#999999" : "#00EE00";

      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillStyle = bestMatch._label == "unknown" ? "#999999" : "#00EE00";
      ctx.rect(x, y, width, height);
      ctx.fillText(bestMatch._label, x, y + height + 20);

      ctx.stroke();
    });
};
