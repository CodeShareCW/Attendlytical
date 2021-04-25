import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";

export default ({ attendeesLength, absenteesLength }) => {
  const [data, setData] = useState([
    { name: "Attendees", value: attendeesLength },
    { name: "Absentees", value: absenteesLength },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [pieSize, setPieSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const PIECOLORS = ["#00C49F", "#ee8888"];

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setPieSize({ width: window.innerWidth, height: window.innerHeight });
    });
  }, []);

  useEffect(() => {
    setData([
      { name: "Attendees", value: attendeesLength },
      { name: "Absentees", value: absenteesLength },
    ]);
  }, [attendeesLength, absenteesLength]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  return (
    <PieChart width={pieSize.width} height={pieSize.height / 2}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        dataKey="value"
        cx={(pieSize.width * 3) / 7}
        cy={200}
        innerRadius={70}
        outerRadius={100}
        fill="#8884d8"
        onMouseEnter={onPieEnter}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={PIECOLORS[index % PIECOLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  );
};
