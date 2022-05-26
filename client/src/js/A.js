/* eslint-disable */
import { React, useState, useEffect, Component, Children } from "react";
import '../css/converter.css'

function A() {
    var [resJson, setResJson] = useState({
        response: '',
        input: '',
    })

    useEffect(() => {
        var phpCode = document.getElementById("phpTxt").value;
        document.getElementById("phpPre").innerHTML = phpCode.replaceAll("<", "&lt;");
        document.getElementById("phpPre").className = "";
        return () => {
          
        };
      }, []);

    var jsCode = "";
    
   
    function convert() {
        var gubun = "A";
        var code = document.getElementById("phpTxt").value;

        if (!code) {
            return;
        }

        if (gubun == "A") {

            
            var dec = decConvert(code);
            code = "<%!" + "\n" + dec + "\n" + "%>";
            
        } else if (gubun == "B") {

            
            var impl = implConvert(code);
            code = impl;

        } else {

            
            var browser = browConvert(code);
            code = browser;

        }

        code.replaceAll("__AND__", "&");
        code.replaceAll("__PLUS__", "\\+");
        code.replaceAll("__QUESTION_MARK__", "\\?");
        code.replaceAll("__CA_SE__", "case");
        code.replaceAll("__ART__", "alert");

        jsCode = code; 

        code = code.replaceAll("<", "&lt;");
        
        conSelect();

        

        // code = code.concat(respon.stringfy());
        

        document.getElementById("jspPre").innerHTML = code;

    }

    
    function decConvert(code) {
        var arrCode = code.split("\n");
        
        for(var i=0; i<arrCode.length; i++){

            if(arrCode[i].indexOf("include") != -1){
                //<%@ include file="/WEB-INF/views/include/header.jsp" %>
                arrCode[i] = arrCode[i].replaceAll("include", "<%@ include file=");
                arrCode[i] = arrCode[i].replaceAll(";", "%>");

            }

            if(arrCode[i].indexOf("$") != -1){
                arrCode[i] = arrCode[i].replaceAll("$", "var ");
            }

            if(arrCode[i].indexOf(".php") != -1){
                arrCode[i] = arrCode[i].replaceAll(".php", ".jsp");
            }
        }

        var result = arrCode.join("~");
        result = result.replaceAll("~", "\n");
        return result;
    }

    
    function implConvert(code) {
        var arrCode = code.split("\n");

        for(var i=0; i<arrCode.length; i++){

            if(arrCode[i].indexOf("<script>") != -1){
                arrCode[i] = arrCode[i].replaceAll("<script>", "<script type=\"text/javascript\">");
                break;
            }

            
            if(arrCode[i].indexOf("$") != -1){
                arrCode[i] = arrCode[i].replaceAll("$", "");
            }

            // Response.Write(" ");
            if(arrCode[i].indexOf("echo") != -1){
                arrCode[i] = arrCode[i].replaceAll("echo", "Response.Write");
            }

            if(arrCode[i].indexOf("exit") != -1){
                arrCode[i] = arrCode[i].replaceAll("exit", "return");
            }
            
        }

        var result = arrCode.join("~");
        result = result.replaceAll("~", "\n");
        return result;
    }

    
    function browConvert(code) {
        var arrCode = code.split("\n");

        for(var i=0; i<arrCode.length; i++){

            if(arrCode[i].indexOf("$PHP_SELF") != -1){
                arrCode[i] = arrCode[i].replaceAll("$PHP_SELF", "request.getRequestURL()");
            }
            
        }

        var result = arrCode.join("~");
        result = result.replaceAll("~", "\n");

        result = result.replaceAll("$", "");
        result = result.replaceAll("<?", "<%");
        result = result.replaceAll("?>", "%>");

        return result;
    }

    function copy() {
        navigator.clipboard.writeText(jsCode);
        
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
    async function conSelect() {
        var inputCode = document.getElementById("phpTxt").value;

        setResJson({
            ...resJson,
            input: inputCode
        })

        const response = await fetch('/asd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                input: inputCode
            })
        });

        const body = await response.text();

        console.log(body);

        setResJson({ 
            ...resJson,
            response: JSON.parse(body)
        });

        console.log(resJson.response+" /// "+resJson.input);
        
        // var response1 = JSON.parse(resJson.response[0]);
        // var response2 = JSON.parse(resJSON.response[1]);
        console.log("################# PARTITION #################");
        // console.log(response1);
        // console.log(response2);
        console.log(resJson.response[0].ASIS_ID);
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
            </div>
            {/* <form enctype="application/x-www-form-urlencoded"></form> */}
        </div>
      );
}

export default A;