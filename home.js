(function () {
    const selectSelected = document.getElementById('select-selected-roster');
    const selectItems = document.getElementById('select-items-roster');
    const rosterInput = document.getElementById('wwe-roster-select');
    const tileDraft = document.getElementById('hub-tile-draft');
    const tileMatchcard = document.getElementById('hub-tile-matchcard');

    const rosterLogos = {
        "wwe2k25": "https://cdn.prgloo.com/media/e92a667d77034df8b502d8f795b33da4.png?width=1200&height=1800",
        "wwe2k24": "https://preview.redd.it/wwe2k24-logo-revealed-via-random-google-search-v0-di1hp86n22cc1.png?width=640&crop=smart&auto=webp&s=5d3fc6bec84676f87daa3da0ae168cc0e871f4b4",
        "wwe2k23": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a9477219-f8e4-4ad7-a85d-3dda9dbc8d0d/dfmley9-031ce72b-5f28-45a2-a417-3bf5758af24e.png/v1/fill/w_1280,h_323/wwe_2k23_logo__transparent__by_dustydirk_dfmley9-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzIzIiwicGF0aCI6Ii9mL2E5NDc3MjE5LWY4ZTQtNGFkNy1hODVkLTNkZGE5ZGJjOGQwZC9kZm1sZXk5LTAzMWNlNzJiLTVmMjgtNDVhMi1hNDE3LTNiZjU3NThhZjI0ZS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.0-1XK7L4RYwO34gOvHWE6S0195_etuaKj4YU4G8LxRc",
        "wwe2k22": "https://cdn.prgloo.com/media/db23bca39db9428db1fd9e420ba228fc.png?width=1200&height=1800",
        "wwe2k20": "https://cdn.prgloo.com/media/ca3ef6d4384d4d3482d4e8fd42bd1ca0.png?width=1200&height=1800",
        "wwe2k19": "https://cdn.prgloo.com/media/fedec14cf49746aca1b2326a07ddebd7.png?width=1200&height=1800"
    };

    function loadRosters() {
        fetch('data/wwe-rosters.json')
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (list) {
                if (!selectItems || !rosterInput) return;
                selectItems.innerHTML = '';

                if (!list || list.length === 0) {
                    list = [{ id: "wwe2k25", name: "WWE 2K25 (default)" }];
                }

                list.forEach(function (item) {
                    const logoUrl = rosterLogos[item.id] || rosterLogos["wwe2k25"];
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
                    const firstLogo = rosterLogos[first.id] || rosterLogos["wwe2k25"];
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
        return rosterInput ? rosterInput.value || 'wwe2k25' : 'wwe2k25';
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
