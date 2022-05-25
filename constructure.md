A페이지 css를 위한 구조 정리
.convertBlock
    .label = #phpLabel
    .label = #jspLabel
    .centerContent > table > tbody
        tr
        .boxTd
            .leftContent
                #phpPre
                    #phpCode
                .hidden = #phpTxt
        .btnTd
            #convertBtn
            #copyBtn
        .botTd
            .rightContent
                #jspPre
                    #jspCode
                .hidden = #jspTxt
