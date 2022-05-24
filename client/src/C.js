/* eslint-disable */
import React, { Component, useState } from "react";
import './converter.css'


function C() {
    const [inputs, setInputs] = useState({
        inFoot: '',
        outFoot: ''
      });
    
      const { inFoot, outFoot } = inputs; // 비구조화 할당을 통해 값 추출
    
      const onChange = (e) => {
        const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출

        setInputs({
          ...inputs, // 기존의 input 객체를 복사한 뒤
          [name]: value // name 키를 가진 값을 value 로 설정
        });
      };
    
      const onReset = () => {
        var newData = '';
        var isOpen = false;
        var isSpace = false;
        var spaceVal = 0;
        const inData = inputs.inFoot;
        
        var dataArrA = inData.split('\n');

        dataArrA.forEach(line => {
          var dataArr = line.split(' ');
          let j = 0;
          var imsi = [];

          dataArr.forEach(words => {
              words = words.replaceAll("$", " ");
              words = words.replaceAll("(", " ");
              words = words.replaceAll(")", " ");
              words = words.replaceAll("\"", " ");
              words = words.replaceAll("'", " ");
              words = words.replaceAll("=", " ");
              words = words.toString().split(' ');
            
              words.forEach(word => {
                if(word != "") imsi.push(word);
              })
              console.log(imsi);
              
              console.log(imsi.find(isIt));
              
              j += 1;
          });

          for(var i=0; i<dataArr.length; i++) {
            if (dataArr[i] == 'console.log(') {
              isSpace = true;
              spaceVal = i+1;
            }
            if (i === 0) {
              newData += dataArr[i];
            } else if(isSpace && i === spaceVal) {
              newData += dataArr[i];
            } else {
              newData += " "+dataArr[i];
            }
          }

          newData += "\n";
        })
        

        //outFoot 변환 값 셋팅
        setInputs({
            ...inputs,
            ['outFoot']: newData
        })
      };

      return (
        <div className="convertBlock">
          <strong><label className="label" id="phpLabel">PHP INPUT</label></strong>
          <strong><label className="label" id="jspLabel">JSP OUTPUT</label></strong>
          <textarea name="inFoot" placeholder="php" onChange={onChange} value={inFoot} className="phpBox" />
          <textarea name="outFoot" placeholder="jsp" value={outFoot} readOnly={true} className="jspBox" />
          <button className="hi" onClick={onReset}>변환</button>
          <div>
            <b>값: </b>
            {inFoot} ({outFoot})
          </div>
        </div>
      );
}

function isIt(param) {
  if(param === 'if') {
    return true;
  }
}

export default C;