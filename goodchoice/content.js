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

    // MutationObserver를 사용하여 "댓글등록" 버튼이 나타나는 것을 감지
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const buttons = Array.from(node.querySelectorAll("button"));
                        buttons.forEach((button, idxButton) => {
                            if (button.textContent.includes("댓글등록")) {
                                addReplyButton(button, ((idxButton + 1) / 2) - 1);
                            }
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // JSON 데이터 가져오기
    const response = await fetch("https://ad.goodchoice.kr/review-v2?unreview=Y&q=&page=1&status=");
    const data = await response.json();
    const reviews = data.review.items;

    function addReplyButton(commentButton, indexButton) {
        // "댓글등록" 버튼의 CSS 복사
        const commentButtonStyle = window.getComputedStyle(commentButton);

        // "답변생성" 버튼 생성 및 추가
        const replyButton = document.createElement("button");
        replyButton.innerText = "답변생성";

        // "댓글등록" 버튼의 CSS를 "답변생성" 버튼에 적용
        replyButton.className = "btn btn-primary";
        //replyButton.style.cssText = commentButtonStyle.cssText;
        replyButton.style.marginLeft = "10px";
        commentButton.insertAdjacentElement("afterend", replyButton);

        // "답변생성" 버튼 클릭 이벤트
        replyButton.addEventListener("click", async () => {
            if (data && data.review && data.review.items && data.review.items.length > 0) {
                const textareas = document.querySelectorAll("textarea");
                if (textareas[indexButton]) {
                    replyButton.disabled = true;
                    replyButton.className = "btn btn-primary disabled";
                    textareas[indexButton].value = "ChatGPT를 사용하여 답변을 생성합니다. 잠시만 기다려주세요...";
                }
                const review = reviews[indexButton];
                const { unick, aepcont, arrate1, arrate2, arrate3 } = review;

                const prompt = `고객명 ${unick}, 시설에 대한 점수: ${arrate1}/10, 청결에 대한 점수: ${arrate2}/10, 친절에 대한 점수: ${arrate3}/10, [고객이 남긴 글] ${aepcont} .`;

                fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: config.headers,
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            {
                                role: "system",
                                content: "당신은 호텔써밋의 프론트 예약관리 담당입니다.\
                                고객님이 리뷰에 남긴 평가글에 대한 답변을 친절하고 여성스러운 말투로 작성해야합니다.\
                                답변은 긍정적인 리뷰와 부정적인 리뷰에 따라 다르게 작성해야합니다. "
                            },
                            {
                                role: "user",
                                content: prompt
                            },
                            {
                                role: "assistant",
                                content: "사장님이나 대표님같은 회사 상급자에 대한 언급과 점수에 대한 직접적인 언급은 하지 마세요.\
                                일회용품에 대한 불편사항을 고객이 언급하면 6층 프론트 앞에 있는 자판기를 이용할 것을 추천하세요.\
                                주차공간에 대한 불만사항은 답변에 개선한다는 내용을 언급하지 마세요.\
                                점수가 8점이하이면 부정적인 리뷰입니다.\
                                고객의 긍정 리뷰에는 웃는 얼굴로 감사 인사를 한다면 더욱 많은 고객들에게 숙소에 대한 좋은 이미지를 심어줄 수 있습니다.\
                                부정적인 리뷰에는 고객마다 숙소 이용 경험에 대해 평가하는 기준이 모두 다릅니다.\
                                불만족에 대한 친절한 답변은 다음 고객에게 긍정적인 인상을 줄 수 있습니다."
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
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
        });
    }
})();