(function () {
    const selectSelected = document.getElementById('select-selected-roster');
    const selectItems = document.getElementById('select-items-roster');
    const rosterInput = document.getElementById('wwe-roster-select');
    const tileDraft = document.getElementById('hub-tile-draft');
    const tileMatchcard = document.getElementById('hub-tile-matchcard');

    const rosterLogos = {
        "wwe2k26": "images/2k26.png",
        "aew": "images/aew-home.png",
        "wwe2k25": "images/2k25.png",
        "wwe2k24": "images/2k24.png",
        "wwe2k23": "images/2k23.png",
        "wwe2k22": "images/2k22.png",
        "wwe2k20": "images/2k20.png",
        "wwe2k19": "images/2k19.png",
    };

    function loadRosters() {
        fetch('data/wwe-rosters.json')
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (list) {
                if (!selectItems || !rosterInput) return;
                selectItems.innerHTML = '';

                if (!list || list.length === 0) {
                    list = [{ id: "wwe2k26", name: "WWE 2K26 (default)" }];
                }

                list.forEach(function (item) {
                    const logoUrl = rosterLogos[item.id] || rosterLogos["wwe2k26"];
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'select-item';
                    optionDiv.innerHTML = `<img src="${logoUrl}" class="roster-select-logo" alt=""> <span class="roster-select-name">${item.name}</span>`;
                    optionDiv.addEventListener('click', function () {
                        rosterInput.value = item.id;
                        selectSelected.innerHTML = `<img src="${logoUrl}" class="roster-select-logo" alt=""> <span class="roster-select-name">${item.name}</span>`;
                        selectItems.classList.add('select-hide');
                    });
                    selectItems.appendChild(optionDiv);
                });

                if (list.length > 0) {
                    const first = list[0];
                    const firstLogo = rosterLogos[first.id] || rosterLogos["wwe2k26"];
                    rosterInput.value = first.id;
                    selectSelected.innerHTML = `<img src="${firstLogo}" class="roster-select-logo" alt=""> <span class="roster-select-name">${first.name}</span>`;
                }
            })
            .catch(function () {
                console.error('Could not load roster list.');
                if (selectSelected) selectSelected.textContent = 'Error loading rosters';
            });
    }

    if (selectSelected) {
        selectSelected.addEventListener('click', function (e) {
            e.stopPropagation();
            selectItems.classList.toggle('select-hide');
        });
    }

    document.addEventListener('click', function () {
        if (selectItems && !selectItems.classList.contains('select-hide')) {
            selectItems.classList.add('select-hide');
        }
    });

    function getSelectedRosterId() {
        return rosterInput ? rosterInput.value || 'wwe2k26' : 'wwe2k26';
    }

    if (tileDraft) {
        tileDraft.addEventListener('click', function (e) {
            e.preventDefault();
            sessionStorage.setItem('draftRoster', getSelectedRosterId());
            window.location.href = 'draft.html';
        });
    }

    if (tileMatchcard) {
        tileMatchcard.addEventListener('click', function (e) {
            e.preventDefault();
            sessionStorage.setItem('draftRoster', getSelectedRosterId());
            window.location.href = 'matchcard-generator.html';
        });
    }

    var creditsLink = document.getElementById('hub-footer-credits');
    if (creditsLink) {
        creditsLink.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Credits: TheSmackDownHotel, SheetJS, html2canvas.');
        });
    }

    var openBugModal = document.getElementById('open-bug-modal');
    var bugReportModal = document.getElementById('bug-report-modal');
    var bugReportModalBackdrop = document.getElementById('bug-report-modal-backdrop');
    var bugReportModalClose = document.getElementById('bug-report-modal-close');

    function openBugReportModal() {
        if (bugReportModal) bugReportModal.removeAttribute('hidden');
    }
    function closeBugReportModal() {
        if (bugReportModal) bugReportModal.setAttribute('hidden', '');
    }

    if (openBugModal) {
        openBugModal.addEventListener('click', function (e) {
            e.preventDefault();
            openBugReportModal();
        });
    }
    if (bugReportModalClose) {
        bugReportModalClose.addEventListener('click', closeBugReportModal);
    }
    if (bugReportModalBackdrop) {
        bugReportModalBackdrop.addEventListener('click', closeBugReportModal);
    }

    loadRosters();
})();
