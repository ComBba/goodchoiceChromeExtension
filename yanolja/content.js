(async () => {
    const result = await chrome.storage.local.get(["openaiApiKey"]);
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
        if (replyButtonFound) return; // 이미 "답변" 버튼이 발견되었으면 함수 종료
        const buttons = Array.from(node.querySelectorAll("button"));
        var isFirst = true;
        buttons.forEach((button, idxButton) => {
            if (button.textContent.trim() == "답변" && isFirst) {
                isFirst = false;
                replyButtonFound = true; // "답변" 버튼이 발견되었음을 기록
                clearInterval(intervalIdForReply); // "답변" 버튼을 찾으면 setInterval 중지
                console.log(idxButton, "첫번째 답변 버튼을 찾았습니다.");
                button.dispatchEvent(new Event("click"));
            }
        });
    }

    function checkForSaveButton(node) {
        console.log("[checkForSaveButton] isFirst:", isFirst);
        const buttons = Array.from(node.querySelectorAll("button"));
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
            const textareas = document.querySelectorAll("textarea");
            const indexButton = 0;
            if (textareas[indexButton]) {
                textareas[indexButton].dispatchEvent(new Event("click"));
                // "disabled" 클래스를 추가합니다
                generateReplyButton.classList.add("disabled");
                generateReplyButton.classList.add("v-btn--disabled");
                // 버튼을 비활성화합니다
                generateReplyButton.disabled = true;
                textareas[indexButton].value = "ChatGPT를 사용하여 답변을 생성합니다. 잠시만 기다려주세요...";
                textareas[indexButton].dispatchEvent(new Event("input"));

                // HTML에서 리뷰 데이터 추출
                const reviewContainer = replyButton.closest(".ReviewListItem");
                //console.log("reviewContainer: ", reviewContainer);
                const unick = reviewContainer.querySelector('td:nth-child(1) > span').textContent.trim();
                console.log("unick: ", unick);
                const arrate1 = reviewContainer.querySelector('td:nth-child(2) > div > div:nth-child(2) > span').textContent.trim();
                console.log("arrate1: ", arrate1);
                const aepcont = reviewContainer.querySelector('td:nth-child(3) > div > div.col.col-9 > div.body-3.BoardContent__content.col').textContent;
                console.log("aepcont: ", aepcont);

                const prompt = `고객명 ${unick}, 평점: ${arrate1}/5, [고객이 남긴 글] ${aepcont} .`;
                fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: config.headers,
                    body: JSON.stringify({
                        model: "gpt-4o",
                        messages: [
                            {
                                role: "system",
                                content: "당신은 호텔써밋의 프론트 예약관리 담당입니다."
                            },
                            {
                                role: "user",
                                content: prompt
                            },
                            {
                                role: "assistant",
                                content: "사장님이나 대표님같은 회사 상급자에 대한 언급과 점수에 대한 직접적인 언급은 하지 마세요. 일회용품에 대한 불편사항을 고객이 언급하면 6층 프론트 앞에 있는 자판기를 이용할 것을 추천하세요. 주차공간에 대한 불만사항은 답변에 개선한다는 내용을 언급하지 마세요. 점수가 8점이하이면 부정적인 리뷰입니다. 고객의 긍정 리뷰에는 웃는 얼굴로 감사 인사를 한다면 더욱 많은 고객들에게 숙소에 대한 좋은 이미지를 심어줄 수 있습니다.\n고객님이 리뷰에 남긴 평가글에 대한 답변을 친절하고 여성스러운 말투로 작성해야합니다. 답변은 긍정적인 리뷰와 부정적인 리뷰에 따라 다르게 작성해야합니다."
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
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
        });
    }
})();