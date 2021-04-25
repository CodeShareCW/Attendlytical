export const drawFaceRect = (descriptions, ctx) => {
  // Loop through each desc
  descriptions &&
    descriptions.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const landmarksPoint=desc.landmarks._positions;

      ctx.font = "normal 18px Gotham, Helvetica Neue, sans-serif";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#08E";

      //draw 68 points
      landmarksPoint.map(point=>{
        ctx.beginPath();
        ctx.fillStyle = "#08E";
        ctx.arc(point._x, point._y, 3, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fill();
      })
    
      // Draw rectangles and text
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
    });
};
