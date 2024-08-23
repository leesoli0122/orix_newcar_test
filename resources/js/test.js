document.addEventListener('DOMContentLoaded', function () {
    let ticking = false;

    // 스크롤 이벤트 처리
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const bwLeft = window.scrollX;
                const header = document.querySelector('#header');

                if (header) {
                    header.style.transform = `translateX(-${bwLeft}px)`;
                    header.classList.toggle('scroll', window.scrollY > 0);
                }

                ticking = false;
            });

            ticking = true;
        }
    });

    // 3자리 수마다 콤마 적용
    $(document).on('keyup', 'input[inputmode=numeric]', function () {
        this.value = this.value.replace(/[^0-9]/g, '')
            .replace(/,/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    // 날짜 형식 자동 하이픈 붙이기
    $("#startDate, #endDate").on("keyup", function (e) {
        if (![37, 38, 39, 40, 8, 46].includes(e.which)) {
            const dateNumText = $.trim($(this).val()).replace(/[^0-9]/g, "");
            const textLength = dateNumText.length;
            let resultDate = "";

            if (textLength < 4) {
                resultDate += dateNumText;
            } else {
                resultDate += dateNumText.substr(0, 4) + (textLength >= 6 ? "-" + dateNumText.substr(4, 2) : "");
                if (textLength >= 6) {
                    resultDate += "-" + dateNumText.substr(6, 2);
                }
            }

            $(this).val(resultDate);
        }
    });

    // input focus 처리
    $('.form-control:not(.form-control.select, input.form-control:read-only), textarea, #loanRegNum').focus(function () {
        $('.fixed-btn-wrap').hide();
    }).blur(function () {
        $('.fixed-btn-wrap').show();
    });

    // 전체 동의 체크박스 및 하위 체크박스 처리
    function toggleCheckboxes($context, isChecked) {
        $context.find('input[type="checkbox"]').prop('checked', isChecked);
    }

    function updateCheckAllState($termsArea) {
        const allCheckboxes = $termsArea.find('input[type="checkbox"]').not('#allChk01').length;
        const checkedCheckboxes = $termsArea.find('input[type="checkbox"]:checked').not('#allChk01').length;
        $termsArea.find('#allChk01').prop('checked', allCheckboxes === checkedCheckboxes);
    }

    $('.terms-area').on('click', '#allChk01', function () {
        const isChecked = $(this).is(':checked');
        toggleCheckboxes($(this).closest('.terms-area'), isChecked);
    });

    $('.terms-area').on('click', '.level2 > fieldset .check.all', function () {
        const isChecked = $(this).is(':checked');
        toggleCheckboxes($(this).closest('.level2'), isChecked);
        updateCheckAllState($(this).closest('.terms-area'));
    });

    $('.terms-area').on('change', 'input[type="checkbox"]', function () {
        updateCheckAllState($(this).closest('.terms-area'));
    });

    // 팝업 처리
    $('[terms-pop]').on('click', function () {
        $('#' + $(this).attr('terms-pop')).toggle();
    });

    $('.btn-layer-close, .btn-primary').on('click', function () {
        $(this).closest('.layerpopup').hide();
    });

    // 아코디언
    $('.accordion .btn-accordion').click(function () {
        const accordionCont = $(this).closest('.accordion').find('.accordion-cont');
        $(this).parent().toggleClass('on');
        accordionCont.toggleClass('on');
    });

    // 선택 시 on
    $('.txt-detail-area, .model-group ul li, .brand ul li').on('click', function () {
        $('.txt-detail-area, .model-group ul li, .brand ul li').removeClass('on');
        $(this).addClass('on');
    });

    // 탭 처리
    $(".tab-item.type2 > li").click(function () {
        const tabCont = $(this).attr("data-tab");
        $(this).siblings().removeClass("on").end().addClass("on");
        $(".tab-content").addClass("dp-none");
        $("#" + tabCont).removeClass("dp-none");
    });

    $(".tab-item > li").click(function () {
        const tabCont = $(this).attr("data-tab");
        $(".tab-item > li").removeClass("on");
        $(this).addClass("on");
        $(".tab-content").addClass("dp-none");
        $("#" + tabCont).removeClass("dp-none");
    });

    // Select box 처리
    const btns = document.querySelectorAll('.btn-select:not(.btn-select.pop)');
    const lists = document.querySelectorAll('.select-list');

    btns.forEach((btn, index) => {
        const list = lists[index];
        if (list) { // list가 존재할 때만 이벤트 리스너 추가
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                if (!btn.classList.contains('disabled')) {
                    btn.classList.toggle('action');
                }
            });

            list.addEventListener('click', (event) => {
                if (event.target.nodeName === "BUTTON" && !btn.classList.contains('disabled')) {
                    btn.innerText = event.target.innerText;
                    btn.classList.remove('action');
                    const selectedBtn = document.querySelector('.btn-select.select-ok');
                    if (selectedBtn) {
                        selectedBtn.classList.remove('select-ok');
                    }
                    btn.classList.add('select-ok');

                    const currentSelected = document.querySelector('.select-list button.check');
                    if (currentSelected) {
                        currentSelected.classList.remove('check');
                    }
                    event.target.classList.add('check');
                }
            });
        }
    });

    // 기본 선택 옵션 설정
    const selectedOption = document.querySelector('.select button');
    if (selectedOption) {
        btns[0].innerText = selectedOption.innerText;
    }

    // 클릭 시 action 제거
    document.addEventListener('click', (event) => {
        const targetElement = event.target;
        btns.forEach((btn) => {
            if (!targetElement.closest('.btn-select') === btn) {
                btn.classList.remove('action');
            }
        });
    });

    // Chart.js 코드
    if (window.myChart) {
        window.myChart.destroy();
    }
    const doughnutChartElement = document.getElementById("doughnut-chart");
    if (doughnutChartElement) {
        window.myChart = new Chart(doughnutChartElement, {
            type: 'doughnut',
            data: {
                datasets: [{
                    backgroundColor: ["#1B6DFA", "#2DB9BC"],
                    data: [42, 8]
                }]
            },
            options: {
                responsive: false,
                tooltips: { enabled: false },
                animation: { duration: 0 }
            }
        });
    }
});

// 레이어팝업 높이 판단하여 block과 position 컨트롤
function layerFunc(_target) {
    if (!_target.hasClass('laypop-all')) {
        if (_target.outerHeight() > $(window).height()) {
            addBlock('full');
        } else {
            if (_target.attr('id') === "loadingLayer") {
                addBlock('removeEvent');
            } else if (_target.attr('id') === "customAlertLayer") {
                addBlock("fixed");
            } else {
                addBlock();
            }
        }
    }
}

// block 추가 및 삭제
function addBlock(_full) {
    $('.close').on('click', function () {
        $('.block').trigger('click');
    });
}

function deleteBlock(_full) {
    if (_full === 'fixed') {
        $('.block').fadeOut(300).remove();
    }
    $('html, .wrap').css({ 'height': '', 'overflow': '' });
    $('body').removeAttr('style');
}

// 메시지 팝업
function messagePopup(id) {
    const _target = $('#' + id);
    const currentTop = $(window).scrollTop();
    $('body').css({ 'position': 'fixed', 'top': -currentTop });
    _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
        closePopup(id);
        $('body').removeAttr('style');
        $(window).scrollTop(currentTop);
    });

    _target.fadeIn(600).addClass("on").focus();
}

// 화면 크기가 1200px 이하인지 확인하는 함수
function checkScreenSize() {
    const mediaQuery = window.matchMedia("(max-width: 1200px)");
    const elements = document.querySelectorAll('.txt-list-wrap .txt-detail-area');

    if (mediaQuery.matches) {
        // 화면이 1200px 이하일 때 mo 클래스를 추가
        elements.forEach(element => {
            // est를 포함하는 클래스가 없는 경우에만 mo 클래스를 추가
            if (!element.classList.contains('est')) {
                element.classList.add('mo');
                // mo 클래스가 있는 div에 onclick 이벤트 추가
                element.onclick = function() {
                    openPopup(element.getAttribute('data-popup-id')); // 팝업 ID를 data-attribute에서 가져옵니다
                };
            }
        });
    } else {
        // 화면이 1200px 이상일 때 mo 클래스를 제거
        elements.forEach(element => {
            element.classList.remove('mo');
            // onclick 이벤트를 제거
            element.onclick = null;
        });
    }
}

// 페이지가 로드될 때와 화면 크기가 변경될 때 checkScreenSize 함수를 호출
window.addEventListener('load', checkScreenSize);
window.addEventListener('resize', checkScreenSize);

// 팝업 열기 및 닫기
function openPopup(id) {
    const _target = $('#' + id);
    const currentTop = $(window).scrollTop();
    const isMobile = /Mobi|Android|iPhone|iPad|Tablet|Nexus 7/i.test(navigator.userAgent);
    const isEstimate = id.startsWith('estimate');

    // 화면 크기가 1200px 이하일 때만 팝업을 열기 위해 mo 클래스가 있는지 확인
    const hasMoClass = document.querySelector('.txt-list-wrap .txt-detail-area.mo') !== null;

    // 화면 크기가 1200px 이하인 경우에만 팝업을 열도록 수정
    const isScreenSizeValid = window.matchMedia("(max-width: 1200px)").matches;

    if (!hasMoClass || !isScreenSizeValid) {
        // mo 클래스가 없거나 화면 크기가 유효하지 않으면 팝업을 열지 않음
        return;
    }

    function showPopup() {
        // 팝업의 스타일을 설정하여 풀스크린으로 표시
        _target.css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'z-index': 9999,  // 팝업이 최상단에 표시되도록 z-index 설정
            'background': '#fff'  // 팝업 배경을 설정 (필요에 따라 조정)
        }).removeClass('close').addClass('on').show().focus();

        _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
            closePopup(id);
        });
    }

    if (isMobile && isEstimate) {
        // iOS Safari에서의 고정 포지션 문제 해결
        $('body').css({
            'overflow': 'hidden',
            'position': 'fixed',
            'width': '100%',
            'top': -currentTop + 'px'
        });

        showPopup();
    } else if (!isEstimate) {
        showPopup();
    }
}

function closePopup(id) {
    const _target = $('#' + id);
    const currentTop = parseInt($('body').css('top')) * -1 || 0;  // 현재 스크롤 위치 계산
    deleteBlock();
    _target.fadeOut(600).removeClass('on');

    // iOS Safari에서의 스크롤 위치 복원
    $('body').css({
        'overflow': '',
        'position': '',
        'width': '',
        'top': ''
    });
    $(window).scrollTop(currentTop);
}

function closePopupUp(id) {
    deleteBlock();
    $('#' + id).scrollTop(0).fadeOut(600);
}

function getCenterAlignPos(containerSize, targetSize) {
    return (containerSize - targetSize) / 2;
}