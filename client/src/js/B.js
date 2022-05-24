import { React, useState } from "react";
import '../css/converter.css'

function B() {
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
        var newData = '';     // 최종 JSP OUTPUT 박스에 표시될 내용을 담는 변수
        var isOpen = false;   // 소괄호( '(' )가 열렸을 때 컨트롤
        var isIn = false;     // include 문 변환 시 <%= 컨트롤을 위한 변수
        var isSpace = false;
        var spaceVal = 0;
        var varTmp = [];
        const inData = inputs.inFoot;
        var dataArrA = inData.split("\n");
        var xCre = false;
        var openCnt = 0;
        var isOpenChg = false;

        dataArrA.forEach(data => {
            data = data.replace("\t", "");
            data = data.replace("	", "");
            data = data.replace("	", "");

            var cnt = 0;
            if(data.match("{") && data.match("^foreach")) { openCnt = 1; isOpenChg = true; }
            if(data.match("{") && !(data.match("^foreach"))) { openCnt += 1; }
            if(data.match("}")) { openCnt -= 1; }

            if(data.match("^foreach")) {
              var forea = [];
              data = data.replaceAll("(", " ");
              data = data.replaceAll(")", " ");
              data = data.replaceAll("$", " ");
              var foreaTmp = data.split(" ");

              foreaTmp.forEach(nd => {
                if(nd != "") forea.push(nd);
              })

              var strForea = "";
              strForea = strForea.concat(forea[(forea.length)-2].toString(), ".forEach(", forea[1].toString(), " => {");
              data = strForea.toString();
            }


            var dataArr = data.split(" ");

            console.log(openCnt);
            if( openCnt == 0 && isOpenChg) {
              dataArr[cnt] = "})";
              openCnt = 0;
              isOpenChg = false;
            }
            console.log(openCnt);

            dataArr.forEach(element => {
              element = element.replace("!", "");
              if(element.match("^echo")) {dataArr[cnt] = element.replaceAll("echo", "console.log");}
              if(element.match("^if")) { dataArr[cnt] = element.replaceAll("$", "");}
              
              
                switch(element) {
                    case '<?php':
                      dataArr[cnt].replaceAll('<?php', '<%');
                      dataArr[cnt] = '<%';
                      break;

                    case '<?':
                      dataArr[cnt] = '<%';
                      break;

                    case '?>':
                      dataArr[cnt] = '%>';
                      break;

                    case 'echo':
                      dataArr[cnt] = 'console.log('
                      isOpen = true;
                      break;

                    case 'include':
                      dataArr[cnt] = '<%@ include';
                      isIn = true;
                      break;

                    case 'if(':
                      xCre = true;
                      break;
                    
                    

                    default:
                      if(element[0] === '$') {
                        var imsi1 = element.replace("$", "");

                        imsi1 = imsi1.replace(";", "");
                        imsi1 = imsi1.split("=");
                        imsi1 = imsi1[0];

                        if(varTmp.indexOf(imsi1) == -1 && !xCre) {
                          dataArr[cnt] = dataArr[cnt].replace("$", "var ");
                          varTmp.push(imsi1);
                        } else {
                          dataArr[cnt] = dataArr[cnt].replace("$", "");
                          varTmp.push(imsi1);
                          xCre = false;
                        }
                      } // if $ end
                      if(element[element.length-1] === ';' && isOpen) {
                        dataArr[cnt] = dataArr[cnt].replace(";", ");");
                        isOpen = false;
                      } else if (element[element.length-1] === ';' && isIn) {
                        dataArr[cnt] = dataArr[cnt].replace(";", " %>");
                        isIn = false;
                      }
                      break;
                }
                
                cnt += 1;
            }); // dataArr.forEach End

            for(var i=0; i<dataArr.length; i++) {
                if (dataArr[i] === 'console.log(') {
                  isSpace = true;
                  spaceVal = i+1;
                }
                if (i === 0) {
                  newData += dataArr[i];
                } else if(isSpace && i === spaceVal) {
                  newData += dataArr[i];
                  isSpace = false;
                  spaceVal = 0;
                } else {
                  newData += " "+dataArr[i];
                }
              }
    
              newData += "\n";
        }); // dataArrA.forEach End

        newData = newData.replaceAll("$", "");

        
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
          <div style={{textAlign: "left", paddingLeft: "35px"}}>
            <br/><br/><br/>
            1. 모든 구문은 마지막에 세미콜론(;)을 찍어주어야 합니다.<br/>
            2. 정확한 변환이 이루어지지 않았을 수 있으니 변환 후 확인바랍니다.<br/>
            3. 장문의 코드 변환은 정확하지 못한 변환을 야기할 수 있으니 구간별로 구문을 잘라서 변환하는 것을 추천합니다.
          </div>
        </div>
      );
}

export default B;