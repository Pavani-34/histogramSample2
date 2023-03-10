import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import sample from "./sample2.json";
import RangeSlider from "./component/RangeSlider";
import Histogram from "./component/Histogram";
import RangeInput from "./component/RangeInput";

const DIV = styled.div`
  padding: 15px;
  canvas {
    height: 250px !important;
  }
`;

const SPACE = styled.div`
  height: 50px;
`;

function App() {
  const responseData = sample.range;
  const maxData = sample.max;
  const countData = [];
  const priceData = [];

  for (let i = 0; i < responseData.length; i += 1) {
    const thisPrice = responseData[i].from ? responseData[i].from : 0;
    const thisCount = responseData[i].doc_count;
    countData.push(thisCount || 0);
    priceData.push(thisPrice || 0);
  }
  countData[countData.length] = countData[countData.length - 1];
  priceData[priceData.length] = maxData;

  const range = [0, countData.length - 1];
  const domain = range; // defulat value
  const defaultInputValue = [
    Number(priceData[0]),
    Number(priceData[priceData.length - 1])
  ];
  // console.log(countData.length);
  const [updateValue, setUpdateValue] = useState(domain);
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const onUpdateCallBack = v => {
    setUpdateValue(v);
    // console.log(v);
    setInputValue([].concat(Number(priceData[v[0]]), Number(priceData[v[1]])));
  };
  const onChangeCallBack = v => {
    setUpdateValue(v);
    // console.log(Number(priceData[v[0]]), Number(priceData[v[1]]));
    // console.log(v);
    setInputValue([].concat(Number(priceData[v[0]]), Number(priceData[v[1]])));
  };

  // console.log(range);

  const handleInputChange = v => {
    let updateAry = domain;
    for (let i = 0; i < priceData.length; i += 1) {
      if (Number(priceData[i]) > v[0]) {
        updateAry[0] = i - 1;
        break;
      }
    }
    for (let i = 0; i < priceData.length; i += 1) {
      if (Number(priceData[i]) > v[1]) {
        updateAry[1] = i;
        break;
      } else {
        updateAry[1] = priceData.length;
      }
    }
    setUpdateValue([].concat(updateAry));
  };

  const resetFn = () => {
    setUpdateValue(domain);
    setInputValue(defaultInputValue);
  };

  useEffect(() => {
    // console.log(inputValue);
  }, [inputValue]);

  return (
    <DIV>
      <Histogram data={countData} highlight={updateValue} domain={domain} />
      <RangeSlider
        values={updateValue}
        mode={2}
        step={1}
        domain={domain}
        onChange={onChangeCallBack}
        onUpdate={onUpdateCallBack}
      />
      <SPACE />
      <RangeInput inputRange={inputValue} onChange={handleInputChange} />
      <button onClick={resetFn}>Reset</button>
    </DIV>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
