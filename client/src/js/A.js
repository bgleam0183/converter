/* eslint-disable */
import { React, useState, useEffect, Component, Children } from "react";
import '../css/converter.css'
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

function A() {
    var [resJson, setResJson] = useState({
        response: '',
        input: ''
    })

    useEffect(() => {
        var phpCode = document.getElementById("phpTxt").value;
        document.getElementById("phpPre").innerHTML = phpCode.replaceAll("<", "&lt;");
        document.getElementById("phpPre").className = "";
        return () => {
          
        };
      }, []);

    var jsCode = "";
    var varChk = [];
    varChk.push("USERID", "USER_ID", "USERNAME", "USERPART", "USERBPART", "USERMPART", "USERGRADE", "USERTYPE");
   
    async function convert() {
        var gubun = "C";
        var code = document.getElementById("phpTxt").value;

        if (!code) {
            return;
        }

        if (gubun == "A") {
            
            await decConvert(code) //declare
            .then(dec => {
                code = dec;
            }).catch(err => console.log(err));
            
        } else {
            
            await browConvert(code) //browser
            .then(browser => {
                code = browser;
            }).catch(err => console.log(err));

        }

        code.replaceAll("__AND__", "&");
        code.replaceAll("__PLUS__", "\\+");
        code.replaceAll("__QUESTION_MARK__", "\\?");
        code.replaceAll("__CA_SE__", "case");
        code.replaceAll("__ART__", "alert");

        document.getElementById("jspTxt").value = code;

        code = code.replaceAll("<", "&lt;");
        document.getElementById("jspPre").innerHTML = code;
    }

    
    async function decConvert(code) {
        var arrCode = code.split("\n");
        var response = await conSelect('');

        for (var i=0; i < arrCode.length; i++) {

            if (arrCode[i].indexOf("//") != -1) continue;

            if (arrCode[i].indexOf("include_once") != -1) {
                var start  = arrCode[i].indexOf("include");
                var paramS = arrCode[i].indexOf("\"", start) + 1;
                var paramE = arrCode[i].indexOf("\"", paramS+1);
                var param  = arrCode[i].slice(paramS, paramE);
                
                arrCode[i] = arrCode[i].replaceAll(param, "");
                arrCode[i] = arrCode[i].replaceAll("\"", "");
                arrCode[i] = arrCode[i].replaceAll(");", "");

                for (var j=0; j < response.length; j++) {

                    if (response[j].STRUC_PHP.indexOf("include_once") != -1) {
                        var replace = response[j].STRUC_JSP;
                        replace = replace.replaceAll("{param1}", param);
                        arrCode[i] = replace.replaceAll("{param2}", "true");
                    }

                }

            } else if (arrCode[i].indexOf("include") != -1) {
                var start  = arrCode[i].indexOf("include");
                var paramS = arrCode[i].indexOf("\"", start) + 1;
                var paramE = arrCode[i].indexOf("\"", paramS+1);
                var param  = arrCode[i].slice(paramS, paramE);
                
                arrCode[i] = arrCode[i].replaceAll(param, "");
                arrCode[i] = arrCode[i].replaceAll("\"", "");
                arrCode[i] = arrCode[i].replaceAll(");", "");

                for (var j=0; j < response.length; j++) {

                    if (response[j].STRUC_PHP.indexOf("include_once") != -1) {

                    } else if (response[j].STRUC_PHP.indexOf("include") != -1) {
                        var replace = response[j].STRUC_JSP;
                        arrCode[i] = replace.replaceAll("{param1}", param);
                    }

                }
            }

            if (arrCode[i].indexOf("$") != -1) {
                var s   = arrCode[i].indexOf("$");//$의 시작위치
                var ind = arrCode[i].indexOf("=", s+1);//"="의 위치
                var v;

                if (ind != -1) {//"="이 문장안에 있는 경우
                    v = arrCode[i].slice(s+1, ind);//변수명 추출
                    varChk.push(v);//전역or지역 변수명으로 저장

                    arrCode[i] = arrCode[i].replaceAll("$", "var ");//타입 선언으로 치환
                } else {//"="이 문장안에 없는 경우

                    for (var j=0; j < varChk.length; j++) {//변수가 저장된 배열안에서 검색
                        var compare = arrCode[i].indexOf(varChk[j], s+1);

                        if (compare != -1) {//배열안에 변수가 있다면
                            arrCode[i] = arrCode[i].replaceAll("$", "");
                        }
                    }
                }
            }
        }

        var result = arrCode.join("~");
        result = result.replaceAll("~", "\n");
        return result;
    }

    function include_conversion(query, conv) {
        var result = "";
        var flag = conv.indexOf("include_once");

        for (var i=0; i < query.length; i++) {
            if (flag != -1 && query[i].STRUC_PHP.indexOf("include_once") != -1) {

                var param = query[i].STRUC_JSP;
                var s = conv.indexOf("\"") + 1;
                var e = conv.indexOf("\"", s);
                conv = conv.slice(s, e);

                param = param.replaceAll("{param1}", conv);
                result = param.replaceAll("{param2}", "true");

            }

            if (flag == -1 && query[i].STRUC_PHP.indexOf("include") != -1) {

                if (query[i].STRUC_PHP.indexOf("include_once") != -1) continue;
                
                var param = query[i].STRUC_JSP;
                var s = conv.indexOf("\"") + 1;
                var e = conv.indexOf("\"", s);
                conv = conv.slice(s, e);

                result = param.replaceAll("{param1}", conv);
            }
        }
        return result;
    }

    function arr_conversion(query, conv) {
        var result = "";

        for (var i=0; i<query.length; i++) {

            if (query[i].STRUC_PHP.indexOf("echo") != -1) {
                
                if (conv.indexOf("echo") == -1) continue;

                var param = query[i].STRUC_JSP;
                param = param.replaceAll("{param}", conv.slice(conv.indexOf("\"")+1, conv.lastIndexOf("\"")));
                
                if (conv.indexOf("break;") != -1) {
                    param = param + " break;";
                }

                result = param;
            }

            if (query[i].STRUC_PHP.indexOf("exit") != -1) {

                if (conv.indexOf("exit") == -1) continue;

                var param = query[i].STRUC_JSP;

                result = conv.replaceAll("exit", param);
            }
        }
        return result;
    }

    async function browConvert(code) {
        var arrCode = code.split("\n");
        var query = await conSelect('');

        var switch_flag = 0;

        for (var i=0; i < arrCode.length; i++) {
            var reArr = [];

            if (arrCode[i].indexOf("//") != -1) continue;

            var sub = arrCode[i].split(" ");// 단어 단위로 분리
            
            for (var j=0; j<sub.length; j++) {// 탭 분리 및 재배열

                if (sub[j].indexOf("\t") != -1) {
                    var cnt = 0;
                    var n = sub[j].indexOf("\t");
                    var ass = sub[j].split("\t");

                    while (cnt < ass.length) {
                        if(ass[cnt] == ''){
                            ass[cnt] = "\t";
                        }
                        cnt++;
                    }
                    reArr = reArr.concat(ass);

                } else {
                    reArr = reArr.concat(sub[j]);
                }
            }

            for (var j=0; j < reArr.length; j++) {
                var result = ""

                if (reArr[j].indexOf("=") != -1) {
                    // console.log(j);
                }

                if (reArr[j].indexOf("include") != -1) {
                    var conv = reArr[j];

                    if (reArr[j].indexOf("include_once") == -1) {
                        conv = reArr[j] + reArr[j+1];
                        result = include_conversion(query, conv);
                        reArr[j] = result;
                        reArr[j+1] = "";
                    } else {
                        result = include_conversion(query, conv);
                        reArr[j] = result;
                    }
                }

                if (reArr[j].indexOf("$PHP_SELF") != -1) {
                    reArr[j] = reArr[j].replaceAll("$PHP_SELF", "request.getRequestURL()");
                }

                if (reArr[j].indexOf("echo") != -1) {
                    result = arr_conversion(query, reArr.slice(j, reArr.length).join(" "));

                    for (var k=j+1; k<reArr.length; k++) {
                        reArr[k] = "";
                    }

                    reArr[j] = result;
                }

                if (reArr[j].indexOf("exit") != -1) {
                    result = arr_conversion(query, reArr[j]);
                    reArr[j] = result;
                }

                if (reArr[j].indexOf("switch") != -1 || switch_flag == 1) {
                    switch_flag = 1;

                    if (reArr[j].indexOf("<%") != -1) {
                        reArr[j] = "%> " + reArr[j] + " <%";
                    }

                    if (reArr[j].indexOf("out.println") != -1) {
                        //");
                    }

                    if (reArr[j].indexOf("}") != -1) {
                        switch_flag = 0;
                    }
                }
            }

            arrCode[i] = reArr.join(" ");

            var result = arrCode[i];

            if(result.indexOf("mysql_query") != -1) {
                var queS = result.indexOf("\"")+1;          // Query start
                var queE = result.indexOf("\"", queS);      // Query end
                
                var query = result.substring(queS, queE);   // Pure Query
    
                var variable = [];
    
                var idx;
                var befIdx;
                var cnt = 0;
    
                if(query.indexOf("$") != -1) {
                    befIdx = query.indexOf("$");
                    cnt = 1;
                    idx = query.indexOf("'", befIdx+1);
                    // console.log("init befIdx = "+query[befIdx+1]+"\ninit idx = "+query[idx+1]);
    
    
                    var tmp = query.slice(befIdx, idx);
                    tmp = tmp.replace("$", "");
                    // console.log("first tmp = "+tmp);
                    variable.push(tmp);
    
                    while(befIdx != -1) {
                        cnt = cnt+1;
                        // befIdx = idx;
                        befIdx = query.indexOf("$", idx+1);
                        
                        if(befIdx == -1) {
                            cnt = cnt-1;
                            break;
                        }

                        idx = query.indexOf("'", befIdx+1);
                        tmp = query.slice(befIdx, idx);
                        tmp = tmp.replace("$", "");

                        // console.log("cnt = "+cnt+"\nbefIdx = "+befIdx+"\nidx = "+idx+"\ntmp = "+tmp);
    
                        variable.push(tmp);
                    }
                }
    
                if(cnt != 0) {
                    while(cnt != 0) {
                        cnt = cnt - 1;
                        befIdx = query.indexOf("'");
                        idx = query.indexOf("'", befIdx+1);

                        var varBeg = query.slice(0, befIdx)+" ";
                        var varEnd = " "+query.slice(idx+1);

                        query = varBeg + "?" + varEnd;

                        var begin = result.slice(0, queS);
                        var end = result.slice(queE);
                        
                        result = begin + query + end;
                        
                        queE = result.indexOf("\"", queS);      // Query end refresh
                    }
                }

                idx = result.indexOf(")");
                query = result.slice(0, idx);   // I'm just use query variable without any reason.


                for(var j=0; j<variable.length; j++) {
                    // 콤마 붙이는 것 때매 포문 씀 if문으로 제어할것
                    query = query + ", " + variable[j];
                }
                result = query + ");";
            } // process Query Change Ended
            arrCode[i] = result;
        }
        // for(var i=0; i<3; i++) {console.log(arrCode[i]);}

        var result = arrCode.join("~");
        result = result.replaceAll("~", "\n");
        result = result.replaceAll("$", "");
        result = result.replaceAll("<?php", "<%");
        result = result.replaceAll("<?", "<%");
        result = result.replaceAll("?>", "%>");

        return result;
    }

    function copy() {
        jsCode = document.getElementById("jspTxt").value;
        navigator.clipboard.writeText(jsCode);
        ToastsStore.info("COPY COMPLETE");
    }

    function phpPreonClick() {
        document.getElementById("phpPre").className = "hidden";
        document.getElementById("phpTxt").className = "";
        document.getElementById("phpTxt").focus(); 
    }

    function phpTxtonBlur() {
        document.getElementById("phpPre").className = "";
        document.getElementById("phpTxt").className = "hidden";
        var phpCode = document.getElementById("phpTxt").value;
        document.getElementById("phpPre").innerHTML = phpCode.replaceAll("<", "&lt;");
    }

    function phpTxtonKeyDown(e) {
        if (e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
    
            var value = e.target.value;
    
            if (e.shiftKey) {
                if (value.charAt(start - 1) == "\t") {
                    e.target.value = (value.substring(0, start - 1) + value.substring(end));
                    e.target.selectionStart = e.target.selectionEnd = start - 1;
                }
            } else {
                e.target.value = (value.substring(0, start) + "\t" + value.substring(end));
                e.target.selectionStart = e.target.selectionEnd = start + 1;
            }
            // prevent the focus lose
            e.preventDefault();
        }
    }


    /**
     * conSelect means 'connect Select' >> communicate with nodejs server
     * 
     * when this function activated then NodeJS > express module gets
     * with the method and parameter.
     * 
     * and then express responsed then control the responed data
     *  */
    async function conSelect(param) {
        var inputVal = param;

        setResJson({
            ...resJson,
            input: inputVal
        })

        const response = await fetch('/asd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                input: inputVal
            })
        });

        const body = await response.text();

        setResJson({ 
            ...resJson,
            response: JSON.parse(body)
        });

        if( resJson.response.message == "No DB Connection" ) {
            alert("DB Connection in not Valid yet.\nPlease Try Again.");
            setResJson({
                ...resJson,
                response: {
                    message: ''
                }
            })
        }

        return JSON.parse(body);
    }

    async function conCon() {
        const response = await fetch('/dbCon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await response.text().then(ans => console.log(ans)).catch(err => console.log(err));
        ToastsStore.info("DB Connected");
    }

    async function conDis() {
        const response = await fetch('/dbDis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await response.text().then(ans => console.log(ans)).catch(err => console.log(err));
    }

    return (
        <div className="convertBlock">
            <strong><label className="label" id="phpLabel">PHP INPUT</label></strong>
            <strong><label className="label" id="jspLabel">JSP OUTPUT</label></strong>
            <div className="centerContent">
                <table>
                    <tbody>
                        <tr>
                        <td className="boxTd">
                            <div className="leftContent">
                                <pre id="phpPre" onClick={phpPreonClick}><code id="phpCode"></code></pre><textarea className="hidden" id="phpTxt" onBlur={phpTxtonBlur} onKeyDown={e => phpTxtonKeyDown(e)}></textarea>
                            </div>
                        </td>
                        <td className="btnTd">
                            <button id="dbCon" onClick={conCon}> Connect </button>
                            {/* <button id="dbDis" onClick={conDis}> Disconnect </button> */}
                            <button id="convertBtn" onClick={convert}> Convert </button>
                            <button id="copyBtn" onClick={copy}> Copy </button>
                        </td>
                        <td className="boxTd">
                            <div className="rightContent">
                                <pre id="jspPre"><code id="jspCode"></code></pre><textarea className="hidden" id="jspTxt"></textarea>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                </table>
                <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore} lightBackground/>
            </div>
        </div>
      );
}

export default A;