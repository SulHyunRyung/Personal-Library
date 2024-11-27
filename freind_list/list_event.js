$(function() {
    const friends = ["cat", "user2", "user3", "user4", "user5"];
    const $textarea = $('#msgBox');
    const $friendList = $('#friendList');

    function getCaretCoordinates(element, position) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const style = window.getComputedStyle(element);

        for (const prop of style) {
            div.style[prop] = style[prop];
        }

        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';

        const text = element.value.substring(0, position);
        div.textContent = text;

        const span = document.createElement('span');
        span.textContent = element.value.substring(position) || '.';
        div.appendChild(span);

        const coordinates = {
            left: (span.offsetLeft + 5),
            top: (span.offsetTop + 15) 
        };

        document.body.removeChild(div);
        return coordinates;
    } // 타이핑 중인 커서 위치 추적 함수

    $textarea.on('keyup', function(event) {
        const cursorPosition = this.selectionStart;
        const textBeforeCursor = this.value.substring(0, cursorPosition);
        const match = textBeforeCursor.match(/@(\w*)$/);

        if (match) {
            const query = match[1].toLowerCase();
            const filteredFriends = friends.filter(friend =>
                friend.toLowerCase().startsWith(query)
            );

            if (filteredFriends.length > 0) {
                const caret = getCaretCoordinates(this, cursorPosition);
                $friendList.css({
                    position: 'absolute',
                    left: caret.left + $textarea.offset().left,
                    top: caret.top + $textarea.offset().top
                }).empty().show();

                filteredFriends.forEach(friend => {
                    const matchWord = matchHighLight(friend, query);
                    $friendList.append(`<li>@${matchWord}</li>`);
                });
            } else {
                $friendList.hide();
            }
        } else {
            $friendList.hide();
        }
    }); // @ 입력 이벤트

    $friendList.on('click', 'li', function() {
        const friendName = $(this).text().slice(1);
        const cursorPosition = $textarea[0].selectionStart;
        const textBeforeCursor = $textarea.val().substring(0, cursorPosition);
        const newText = textBeforeCursor.replace(/@\w*$/, `@${friendName} `);
        const textAfterCursor = $textarea.val().substring(cursorPosition);

        $textarea.val(newText + textAfterCursor);
        $friendList.hide();
        $textarea.focus();
        $textarea[0].setSelectionRange(newText.length, newText.length);
    }); // 리스트 클릭 이벤트 (자동완성)

    $(document).click(function(event) {
        if (!$(event.target).closest('#msgBox, #friendList').length) {
            $friendList.hide();
        }
    }); // 리스트 외부 클릭 이벤트 (리스트 제거)

    function matchHighLight(friend, query) {
        const startIdx = friend.toLowerCase().indexOf(query);
        if (startIdx !== -1) {
            const endIdx = startIdx + query.length;
            return friend.substring(0, startIdx) + 
                   '<span style="color: #000; font-weight: bold;">' + 
                   friend.substring(startIdx, endIdx) + 
                   '</span>' + 
                   friend.substring(endIdx);
        }
        return friend; 
    } // 일치 항목 강조 이펙트 함수
});
