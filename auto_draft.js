
// --- AUTO DRAFT REMAINING LOGIC ---

function autoDraftRemaining() {
    if (brandsConfig.length === 0) {
        showToast("No brands available to draft to!", "warning");
        return;
    }
    if (superstars.length === 0) {
        showToast("Roster is empty!", "info");
        return;
    }

    showConfirm(
        { 
            title: "Auto Draft Remaining?", 
            message: `This will automatically distribute all ${superstars.length} remaining superstars to the ${brandsConfig.length} brands. This action cannot be undone.` 
        },
        () => {
            performAutoDraft();
        }
    );
}

function performAutoDraft() {
    // Step A: Grouping
    // We create buckets for each combination of Sex + Tier
    const groups = {
        'man-high': [], 'woman-high': [],
        'man-mid': [], 'woman-mid': [],
        'man-low': [], 'woman-low': []
    };

    // Sort existing superstars into groups
    superstars.forEach(s => {
        // Fallbacks for data integrity
        const sex = (s.sex || 'man').toLowerCase();
        const tier = (s.tier || 'mid').toLowerCase();
        const key = `${sex}-${tier}`;

        if (groups[key]) {
            groups[key].push(s);
        } else {
            // If some weird data exists, dump it in man-mid
            groups['man-mid'].push(s);
        }
    });

    // Step B & C: Shuffle & Distribute
    // Order of importance: High -> Mid -> Low
    const groupOrder = ['man-high', 'woman-high', 'man-mid', 'woman-mid', 'man-low', 'woman-low'];
    
    // We maintain a persistent index to ensure fair round-robin distribution across groups
    let brandIndex = 0;

    // Fisher-Yates shuffle helper
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    groupOrder.forEach(groupKey => {
        const groupList = groups[groupKey];
        if (groupList && groupList.length > 0) {
            // Shuffle this specific group
            shuffleArray(groupList);
            
            // Distribute round-robin
            groupList.forEach(superstar => {
                const targetBrand = brandsConfig[brandIndex];
                addToBrandList(targetBrand.id, superstar);
                
                // Move to next brand
                brandIndex = (brandIndex + 1) % brandsConfig.length;
            });
        }
    });

    // Step D: State Update
    // All superstars have been drafted, so clear the available pool
    superstars = [];

    // Step E: UI Render
    renderSuperstarList(); // This will clear the left panel
    showToast("Auto draft completed successfully!", "success");
}
