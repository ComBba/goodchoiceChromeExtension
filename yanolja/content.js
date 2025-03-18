(async () => {
    console.log("[Extension Started]");
    const result = await chrome.storage.local.get(["openaiApiKey"]);
    console.log("API Key exists:", !!result.openaiApiKey);
    const apiKey = result.openaiApiKey;
    if (!apiKey) {
        alert("Please set your OpenAI API key in the extension popup.");
        return;
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }
    };

    let replyButtonFound = false; // "답변" 버튼이 발견되었는지 여부를 추적

    // MutationObserver를 사용하여 "답변" 버튼이 나타나는 것을 감지
    const observer = new MutationObserver((mutations) => {
        console.log("[MutationObserver] Mutations detected:", mutations.length);
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        checkForReplyButton(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 주기적으로 DOM을 확인하여 "답변" 버튼을 감지
    let intervalIdForReply;
    function startIntervalForReply() {
        console.log("[startIntervalForReply]")
        intervalIdForReply = setInterval(function () {
            checkForReplyButton(document.body);
        }, 1000); // 1초마다 작업 수행
    }
    startIntervalForReply();

    // 반복 작업을 위한 intervalId 변수 선언
    let intervalIdForSave;
    // 반복 작업을 정의하는 함수
    function startIntervalForSave() {
        console.log("[startIntervalForSave]");
        intervalIdForSave = setInterval(function () {
            checkForSaveButton(document.body);
        }, 1000); // 1초마다 작업 수행
    }
    // 초기 반복 작업 시작
    startIntervalForSave();

    let intervalIdForSaveMessage;
    function startIntervalForSavedOKMessage() {
        console.log("[startIntervalForSavedOKMessage]");
        intervalIdForSaveMessage = setInterval(function () {
            checkForSavedOKMessage(document.body);
        }, 1000);
    }
    startIntervalForSavedOKMessage()

    function checkForReplyButton(node) {
        console.log("[checkForReplyButton] replyButtonFound:", replyButtonFound);
        if (replyButtonFound) return;
        
        const buttons = Array.from(node.querySelectorAll("button.MuiButton-containedPrimary"));
        var isFirst = true;
        
        buttons.forEach((button, idxButton) => {
            console.log(button.textContent.trim());
            if (button.textContent.trim() == "답변" && isFirst) {
                isFirst = false;
                replyButtonFound = true;
                clearInterval(intervalIdForReply);
                console.log(idxButton, "첫번째 답변 버튼을 찾았습니다.");
                
                // 여러 가지 이벤트 트리거 방식 시도
                try {
                    // 방법 1: 마우스 이벤트 시뮬레이션
                    /*
                    button.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    button.dispatchEvent(new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    button.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                    */

                    // 방법 2: 직접 클릭
                    button.click();
                    
                    // 방법 3: 프로그래매틱 클릭
                    /*
                    const clickEvent = new Event('click', {
                        bubbles: true,
                        cancelable: true,
                    });
                    button.dispatchEvent(clickEvent);
                    */
                    
                    console.log("클릭 이벤트 발생 시도 완료");
                } catch (error) {
                    console.error("버튼 클릭 시도 중 에러:", error);
                }
            }
        });
    }

    function checkForSaveButton(node) {
        console.log("[checkForSaveButton] isFirst:", isFirst);
        const buttons = Array.from(node.querySelectorAll("button.MuiButton-containedPrimary"));
        var isFirst = true;
        
        buttons.forEach((button, idxButton) => {
            if (button.textContent.trim() == "저장" && isFirst) {
                clearInterval(intervalIdForSave); // "저장" 버튼을 찾으면 setInterval 중지
                console.log(idxButton, "첫번째 저장 버튼을 찾았습니다.");
                addReplyButton(button);
                isFirst = false;
            }
        });
    }

    //<span class="v-btn__content">   확인   </span>
    //#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__actions.ya-pa-24 > button > span
    //#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text.BaseDialog__contents.ya-pa-24 > div > div > span
    function checkForSavedOKMessage(node) {
        const messageDialog = node.querySelector("div.v-dialog.v-dialog--active.v-dialog--persistent.v-dialog--scrollable");
        if (!messageDialog) return;
        const spans = Array.from(messageDialog.querySelectorAll("span"));
        if (spans[0].textContent.trim() == "저장되었습니다.") {
            messageDialog.querySelector("button").dispatchEvent(new Event("click"));
            console.log("저장되었습니다. 메시지를 확인했습니다.");
            clearInterval(intervalIdForSaveMessage); // "저장되었습니다." setInterval 중지
            replyButtonFound = false;
            startIntervalForReply();
            startIntervalForSave();
        }
    }

    function addReplyButton(replyButton) {
        // "답변" 버튼의 CSS 복사
        const replyButtonStyle = window.getComputedStyle(replyButton);

        // "답변생성" 버튼 생성 및 추가
        const generateReplyButton = document.createElement("button");
        const generateReplySpan = document.createElement("span");
        generateReplySpan.class = "v-btn__content";
        generateReplySpan.innerText = "답변생성";

        for (var dataKey in replyButton.dataset) {
            //console.log(dataKey + ": " + replyButton.dataset[dataKey]);
            generateReplyButton.dataset[dataKey] = replyButton.dataset[dataKey];
        }
        // "답변" 버튼의 CSS를 "답변생성" 버튼에 적용
        generateReplyButton.size = "normal";
        generateReplyButton.className = replyButton.className;
        generateReplyButton.style.cssText = replyButtonStyle.cssText;
        generateReplyButton.style.marginLeft = "10px";
        generateReplyButton.appendChild(generateReplySpan);
        replyButton.insertAdjacentElement("afterend", generateReplyButton);

        // "답변생성" 버튼 클릭 이벤트
        generateReplyButton.addEventListener("click", async () => {
            try {
                const textareas = document.querySelectorAll("textarea");
                const indexButton = 0;
                if (textareas[indexButton]) {
                    //textareas[indexButton].dispatchEvent(new Event("click"));
                    generateReplyButton.disabled = true;
                    generateReplyButton.style.backgroundColor = "#ccc";
                    generateReplyButton.style.color = "#666";
                    generateReplyButton.style.cursor = "not-allowed";
                    generateReplyButton.style.pointerEvents = "none";

                    generateReplyButton.classList.add("disabled");
                    generateReplyButton.classList.add("v-btn--disabled");

                    textareas[indexButton].click();
                    textareas[indexButton].focus();
                    textareas[indexButton].value = "ChatGPT를 사용하여 답변을 생성합니다. 잠시만 기다려주세요...";
                    textareas[indexButton].dispatchEvent(new Event("input"));
                    //textareas[indexButton].dispatchEvent(new Event("change"));

                    // 새로운 selector로 리뷰 데이터 추출
                    const reviewContainer = document.querySelector('.MuiStack-root.css-t3dfpt');
                    if (!reviewContainer) {
                        console.error("리뷰 컨테이너를 찾을 수 없습니다.");
                        return;
                    }

                    // 리뷰 데이터 추출
                    const unick = reviewContainer.querySelector('.MuiTypography-14-bold').textContent.trim();
                    const aepcont = reviewContainer.querySelector('.MuiTypography-12-regular').textContent.trim();
                    const reviewDate = reviewContainer.querySelector('.MuiTypography-10-light').textContent.trim();

                    console.log("추출된 데이터:", {
                        unick,
                        aepcont,
                        reviewDate
                    });

                    const prompt = `고객명 ${unick}, [고객이 남긴 글] ${aepcont} .`;
                    fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: config.headers,
                        body: JSON.stringify({
                            model: "gpt-4o-mini",
                            messages: [
                                {
                                    role: "system",
                                    content: "당신은 호텔써밋의 프론트 예약관리 담당자입니다. 고객님이 리뷰에 남긴 평가글에 대한 답변을 친절하고 여성스러운 말투로 작성해야합니다."
                                },
                                {
                                    role: "user",
                                    content: prompt
                                },
                                {
                                    role: "assistant",
                                    content: "\
                                    다음 사항을 준수하여 작성하세요. \
                                    1. 점수가 3점이하이면 부정적인 리뷰입니다. \
                                    2. 사장님이나 대표님같은 회사 상급자에 대한 언급과 점수에 대한 직접적인 언급은 하지 마세요. \
                                    3. 일회용품에 대한 불편사항을 고객이 언급하면 6층 프론트 앞에 있는 자판기를 이용할 것을 추천하세요. \
                                    4. 주차공간에 대한 불만사항은 답변에 개선한다는 내용을 언급하지 마세요. \
                                    5. 고객의 긍정 리뷰에는 웃는 얼굴로 감사 인사를 한다면 더욱 많은 고객들에게 숙소에 대한 좋은 이미지를 심어줄 수 있습니다.\
                                    6. 고객의 부정적인 리뷰에는 고객마다 숙소 이용 경험에 대해 평가하는 기준이 모두 다릅니다.\
                                    7. 답변은 긍정적인 리뷰와 부정적인 리뷰에 따라 다르게 작성해야합니다. \
                                    "
                                },
                                {
                                    role: "user",
                                    content: "답변을 300자 이하로 작성해주세요."
                                }
                            ],
                            temperature: 0.8,
                            max_tokens: 800
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            const reply = data.choices[0].message.content.trim();
                            if (textareas[indexButton]) {
                                textareas[indexButton].value = reply;
                                textareas[indexButton].dispatchEvent(new Event("input"));
                                startIntervalForSavedOKMessage();
                                generateReplyButton.disabled = false;
                                generateReplyButton.style.backgroundColor = replyButton.style.backgroundColor;
                                generateReplyButton.style.color = replyButton.style.color;
                                generateReplyButton.style.cursor = "pointer";
                                generateReplyButton.style.pointerEvents = "auto";
                                generateReplyButton.classList.remove("disabled");
                                generateReplyButton.classList.remove("v-btn--disabled");

                            }
                        })
                        .catch(error => {
                            console.error("답변 생성 중 에러 발생:", error);
                            console.error("에러 상세:", error.stack);
                        });
                }
            } catch (error) {
                console.error("답변 생성 중 에러 발생:", error);
                console.error("에러 상세:", error.stack);
            }
        });
    }
})();