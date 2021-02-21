import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

function createElement(x1, y1, x2, y2, option) {
  if (option === "line") {
    return createElementLine(x1, y1, x2, y2);
  } else {
    return createElementRectangle(x1, y1, x2, y2);
  }
}

function createElementLine(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, roughElement };
}

function createElementRectangle(x1, y1, x2, y2) {
  const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, roughElement };
}

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [option, setOption] = useState("line");

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handleMouseDown = (event) => {
    setDrawing(true);
    const { clientX, clientY } = event;

    const element = createElement(clientX, clientY, clientX, clientY, option);
    setElements((prevState) => [...prevState, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, clientX, clientY, option);

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div>
      <input
        type="radio"
        value="line"
        name="line"
        onChange={() => setOption("line")}
        checked={option === "line"}
      />
      Line
      <input
        type="radio"
        value="rectangle"
        name="rectangle"
        onChange={() => setOption("rectangle")}
        checked={option === "rectangle"}
      />
      Rectangle
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
