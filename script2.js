  let superstars = [
  { name: "Adriana Rizzo", tier: "mid", sex: "woman", img: "images/adrianna-rizzo-2024.png" },
  { name: "AJ Styles", tier: "mid", sex: "man", img: "images/aj-styles.png" },
  { name: "Akira Tozawa", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_akira-tozawa.webp" },
  { name: "Alba Fyre", tier: "low", sex: "woman", img: "images/alba-fyre-new.png" },
  { name: "Aleister Black", tier: "mid", sex: "man", img: "images/aleister-black-2025-1.png" },
  { name: "Alex Shelley", tier: "mid", sex: "man", img: "images/alex-shelley-2024.png" },
  { name: "Alexa Bliss", tier: "mid", sex: "woman", img: "images/alexa-bliss.png" },
  { name: "Andrade", tier: "mid", sex: "man", img: "images/andrade-2.png" },
  { name: "Andre Chase", tier: "low", sex: "man", img: "images/andre-chase-new.png" },
  { name: "Angel", tier: "low", sex: "man", img: "images/angel-garza-2023-angel-new.png" },
  { name: "Angelo Dawkins", tier: "mid", sex: "man", img: "images/angelo-dawkins.png" },
  { name: "Apollo Crews", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_apollo-crews.webp" },
  { name: "Arianna Grace", tier: "low", sex: "woman", img: "images/arianna-grace-2023-new.png" },
  { name: "Ashante \"Thee\" Adonis", tier: "low", sex: "man", img: "images/images_wwe2k24_roster_ashante-adonis.webp" },
  { name: "Asuka", tier: "high", sex: "woman", img: "images/images_wwe2k24_roster_asuka-2.webp" },
  { name: "Austin Theory", tier: "low", sex: "man", img: "images/austin-theory-new.png" },
  { name: "Axiom", tier: "mid", sex: "man", img: "images/images_wwe2k24_roster_axiom.webp" },
  { name: "B-Fab", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_b_b-fab-2024-1.webp" },
  { name: "Bayley", tier: "mid", sex: "woman", img: "images/bayley.png" },
  { name: "Becky Lynch", tier: "mid", sex: "woman", img: "images/becky-lynch.png" },
  { name: "Berto", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_humberto.webp" },
  { name: "Bianca Belair", tier: "high", sex: "woman", img: "images/bianca-belair.png" },
  { name: "Blake Monroe", tier: "high", sex: "woman", img: "images/mariah-may-2025.png" },
  { name: "Brinley Reece", tier: "low", sex: "woman", img: "images/brinley-reece-2024.png" },
  { name: "Bronn Breakker", tier: "high", sex: "man", img: "images/images_wwe2k24_roster_bron-breakker.webp" },
  { name: "Bronco Nima", tier: "mid", sex: "man", img: "images/bronco-nima.png" },
  { name: "Bronson Reed", tier: "high", sex: "man", img: "images/images_wwe2k24_roster_bronson-reed.webp" },
  { name: "Brooks Jensen", tier: "low", sex: "man", img: "images/brooks-jensen-new.png" },
  { name: "Brutus Creed", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_brutus-creed.webp" },
  { name: "Candice LeRae", tier: "low", sex: "woman", img: "images/candice-lerae.png" },
  { name: "Carlee Bright", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_c_carlee-bright.webp" },
  { name: "Carmelo Hayes", tier: "mid", sex: "man", img: "images/carmelo-hayes.png" },
  { name: "Chad Gable", tier: "mid", sex: "man", img: "images/chad-gable-2024.png" },
  { name: "Channing “Stacks” Lorenzo", tier: "low", sex: "man", img: "images/channing-lorenzo-2024.png" },
  { name: "Charlie Dempsey", tier: "low", sex: "man", img: "images/charlie-dempsey-2024.png" },
  { name: "Charlotte Flair", tier: "high", sex: "woman", img: "images/charlotte-flair-new.png" },
  { name: "Chelsea Green", tier: "mid", sex: "woman", img: "images/chelsea-green-2024.png" },
  { name: "Chris Sabin", tier: "mid", sex: "man", img: "images/chris-sabin-2024.png" },
  { name: "CM Punk", tier: "high", sex: "man", img: "images/cm-punk-2.png" },
  { name: "Cody Rhodes", tier: "high", sex: "man", img: "images/cody-rhodes-2.png" },
  { name: "Cruz Del Toro", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_crus-del-toro.webp" },
  { name: "Cutler James", tier: "mid", sex: "man", img: "images/cutler-james-2025-2.png" },
  { name: "Damian Priest", tier: "mid", sex: "man", img: "images/damian-priest.png" },
  { name: "Dante Chen", tier: "low", sex: "man", img: "images/dante-chen-2024.png" },
  { name: "Dexter Lumis", tier: "mid", sex: "man", img: "images/dexter-lumis-2024-1.png" },
  { name: "Dion Lennox", tier: "mid", sex: "man", img: "images/dion-lennox-2025-2.png" },
  { name: "Dominik Mysterio", tier: "mid", sex: "man", img: "images/dominik-mysterio-2024.png" },
  { name: "Dragon Lee", tier: "low", sex: "man", img: "images/dragon-lee-2023.png" },
  { name: "Drew McIntyre", tier: "high", sex: "man", img: "images/drew-mcintyre.png" },
  { name: "Edris Enofe", tier: "low", sex: "man", img: "images/edris-enofe-2024.png" },
  { name: "Elton Prince", tier: "low", sex: "man", img: "images/images_wwe2k24_roster_elton-prince.webp" },
  { name: "Erik", tier: "mid", sex: "man", img: "images/erik-2024.png" },
  { name: "Erick Rowan", tier: "mid", sex: "man", img: "images/erick-rowan-2024-1.png" },
  { name: "Ethan Page", tier: "mid", sex: "man", img: "images/ethan-page.png" },
  { name: "Fallon Henley", tier: "low", sex: "woman", img: "images/fallon-henley-2024-2.png" },
  { name: "Finn Balor", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_f_finn-balor-2021-new.webp" },
  { name: "Giulia", tier: "mid", sex: "woman", img: "images/giulia-2025.png" },
  { name: "Grayson Waller", tier: "low", sex: "man", img: "images/images_wrestling_wrestlers_g_grayson-waller-2023-new.webp" },
  { name: "Gunther", tier: "high", sex: "man", img: "images/gunther.png" },
  { name: "Hank Walker", tier: "mid", sex: "man", img: "images/hank-walker-1.png" },
  { name: "Ilja Dragunov", tier: "low", sex: "man", img: "images/images_wrestling_wrestlers_i_ilja-dragunov-2024.webp" },
  { name: "Ivar", tier: "mid", sex: "man", img: "images/ivar-2024.png" },
  { name: "Ivy Nile", tier: "low", sex: "woman", img: "images/images_wwe2k24_roster_ivy-nile.webp" },
  { name: "Iyo Sky", tier: "high", sex: "woman", img: "images/iyo-sky.png" },
  { name: "Izzi Dame", tier: "mid", sex: "woman", img: "images/izzi-dame-2024.png" },
  { name: "Jacob Fatu", tier: "mid", sex: "man", img: "images/jacob-fatu.png" },
  { name: "Jacy Jayne", tier: "mid", sex: "woman", img: "images/jacy-jayne.png" },
  { name: "Jade Cargill", tier: "high", sex: "woman", img: "images/images_wrestling_wrestlers_j_jade-cargill-2024.webp" },
  { name: "Jaida Parker", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_j_jaida-parker-2023.webp" },
  { name: "Jasper Troy", tier: "high", sex: "man", img: "images/jasper-troy-2025-1.png" },
  { name: "Jazmyn Nyx", tier: "mid", sex: "woman", img: "images/images_wrestling_wrestlers_j_jazmyn-nyx-2024.webp" },
  { name: "JC Mateo", tier: "mid", sex: "man", img: "images/jeff-cobb-2025.png" },
  { name: "JD McDonagh", tier: "mid", sex: "man", img: "images/jd-mcdonagh-2024.png" },
  { name: "Je'Von Evans", tier: "low", sex: "man", img: "images/images_wrestling_wrestlers_j_jevon-evans.webp" },
  { name: "Jey Uso", tier: "high", sex: "man", img: "images/jey-uso.png" },
  { name: "Jimmy Uso", tier: "mid", sex: "man", img: "images/jimmy-uso.png" },
  { name: "Joaquin Wilde", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_joaquin-wilde.webp" },
  { name: "Joe Gacy", tier: "mid", sex: "man", img: "images/joe-gacy-2024-2.png" },
  { name: "Joe Hendry", tier: "high", sex: "man", img: "images/joe-hendry-2021-2.png" },
  { name: "John Cena", tier: "high", sex: "man", img: "images/images_wwe2k24_roster_john-cena.webp" },
  { name: "Johnny Gargano", tier: "mid", sex: "man", img: "images/images_wwe2k23_roster_johnny-gargano.webp" },
  { name: "Jordynne Grace", tier: "mid", sex: "woman", img: "images/jordynne-grace-2025-1.png" },
  { name: "Josh Briggs", tier: "low", sex: "man", img: "images/images_wwe2k24_roster_josh-briggs.webp" },
  { name: "Julius Creed", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_julius-creed.webp" },
  { name: "Kairi Sane", tier: "mid", sex: "woman", img: "images/images_wrestling_wrestlers_k_kairi-sane-2023-1.webp" },
  { name: "Kale Dixon", tier: "low", sex: "man", img: "images/kale-dixon-2025.png" },
  { name: "Karmen Petrovic", tier: "mid", sex: "woman", img: "images/karmen-petrovic-2024.png" },
  { name: "Karrion Kross", tier: "mid", sex: "man", img: "images/images_wwe2k23_roster_karrion-kross.webp" },
  { name: "Kelani Jordan", tier: "mid", sex: "woman", img: "images/kelani-jordan-3.png" },
  { name: "Kendal Grey", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_k_kendal-grey.webp" },
  { name: "Kevin Owens", tier: "mid", sex: "man", img: "images/images_wwe2k24_roster_kevin-owens.webp" },
  { name: "Kiana James", tier: "low", sex: "woman", img: "images/kiana-james.png" },
  { name: "Kit Wilson", tier: "low", sex: "man", img: "images/images_wwe2k24_roster_kit-wilson.webp" },
  { name: "Kofi Kingston", tier: "mid", sex: "man", img: "images/kofi-kingston-2024.png" },
  { name: "LA Knight", tier: "high", sex: "man", img: "images/images_wwe2k23_roster_la-knight.webp" },
  { name: "Lainey Reid", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_l_lainey-reid-2024.webp" },
  { name: "Lash Legend", tier: "mid", sex: "woman", img: "images/lash-legend-2024.png" },
  { name: "Lexis King", tier: "mid", sex: "man", img: "images/lexis-king.png" },
  { name: "Lince Dorado", tier: "mid", sex: "man", img: "images/lince-dorado-2020.png" },
  { name: "Liv Morgan", tier: "high", sex: "woman", img: "images/liv-morgan.png" },
  { name: "Logan Paul", tier: "high", sex: "man", img: "images/images_wwe2k23_roster_logan-paul.webp" },
  { name: "Lola Vice", tier: "mid", sex: "woman", img: "images/lola-vice-2022.png" },
  { name: "Luca Crusifino", tier: "mid", sex: "man", img: "images/luca-crusifino-2023-1.png" },
  { name: "Lucien Price", tier: "mid", sex: "man", img: "images/lucien-price-1.png" },
  { name: "Lyra Valkyria", tier: "mid", sex: "woman", img: "images/lyra-valkyria.png" },
  { name: "Malik Blade", tier: "low", sex: "man", img: "images/malik-blade-2024.png" },
  { name: "Maxxine Dupri", tier: "low", sex: "woman", img: "images/images_wwe2k24_roster_maxxine-dupri.webp" },
  { name: "Michin", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_m_mia-yim-2024-1.webp" },
  { name: "Mike Santana", tier: "low", sex: "man", img: "images/mike-santana-2025.png" },
  { name: "Montez Ford", tier: "mid", sex: "man", img: "images/montez-ford.png" },
  { name: "Myles Borne", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_m_myles-borne-2022.webp" },
  { name: "Naomi", tier: "high", sex: "woman", img: "images/naomi.png" },
  { name: "Natalya", tier: "low", sex: "woman", img: "images/natalya.png" },
  { name: "Nathan Frazer", tier: "mid", sex: "man", img: "images/images_wwe2k24_roster_nathan-frazer.webp" },
  { name: "New Jack", tier: "mid", sex: "man", img: "images/new-jack.jpg" },
  { name: "Nia Jax", tier: "high", sex: "woman", img: "images/nia-jax.png" },
  { name: "Nikki Bella", tier: "high", sex: "woman", img: "images/nikki-bella-2024.png" },
  { name: "Nikki Cross", tier: "mid", sex: "woman", img: "images/nikki-cross-2024-1.png" },
  { name: "Nikkita Lyons", tier: "mid", sex: "woman", img: "images/nikkita-lyons-2023.png" },
  { name: "Niko Vance", tier: "low", sex: "man", img: "images/niko-vance-2024.png" },
  { name: "Noam Dar", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_noam-dar.webp" },
  { name: "Oba Femi", tier: "high", sex: "man", img: "images/oba-femi-2023-new.png" },
  { name: "Osiris Griffin", tier: "mid", sex: "man", img: "images/osiris-griffin-2025-2.png" },
  { name: "Otis", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_otis.webp" },
  { name: "Penta", tier: "high", sex: "man", img: "images/penta-2025-1.png" },
  { name: "Pete Dunne", tier: "low", sex: "man", img: "images/images_wrestling_wrestlers_p_pete-dunne-2024.webp" },
  { name: "Piper Niven", tier: "low", sex: "woman", img: "images/piper-niven.png" },
  { name: "R-Truth", tier: "mid", sex: "man", img: "images/r-truth.png" },
  { name: "Randy Orton", tier: "high", sex: "man", img: "images/randy-orton.png" },
  { name: "Raquel Rodriguez", tier: "mid", sex: "woman", img: "images/raquel-rodriguez-2024.png" },
  { name: "Rey Fenix", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_f_fenix-2023.webp" },
  { name: "Rey Mysterio", tier: "high", sex: "man", img: "images/rey-mysterio.png" },
  { name: "Rhea Ripley", tier: "high", sex: "woman", img: "images/rhea-ripley.png" },
  { name: "Ricky Saints", tier: "high", sex: "man", img: "images/ricky-starks-2022.png" },
  { name: "Ridge Holland", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_r_ridge-holland-2024.webp" },
  { name: "Roman Reigns", tier: "high", sex: "man", img: "images/roman-reigns-new.png" },
  { name: "Roxanne Perez", tier: "mid", sex: "woman", img: "images/images_wrestling_wrestlers_r_roxanne-perez-2024.webp" },
  { name: "Rusev", tier: "mid", sex: "man", img: "images/rusev-2025.png" },
  { name: "Sami Zayn", tier: "high", sex: "man", img: "images/images_wwe2k23_roster_sami-zayn.webp" },
  { name: "Santos Escobar", tier: "mid", sex: "man", img: "images/images_wwe2k23_roster_santos-escobar.webp" },
  { name: "Saquon Shugars", tier: "mid", sex: "man", img: "images/saquon-shugars-2025-2.png" },
  { name: "Scarlett", tier: "low", sex: "woman", img: "images/scarlett-2024.png" },
  { name: "Seth Rollins", tier: "high", sex: "man", img: "images/seth-rollins.png" },
  { name: "Shawn Spears", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_s_shawn-spears-2024.webp" },
  { name: "Sheamus", tier: "mid", sex: "man", img: "images/images_wwe2k24_roster_sheamus.webp" },
  { name: "Shinsuke Nakamura", tier: "mid", sex: "man", img: "images/shinsuke-nakamura-2024.png" },
  { name: "Sol Ruca", tier: "mid", sex: "woman", img: "images/sol-ruca-1.png" },
  { name: "Solo Sikoa", tier: "mid", sex: "man", img: "images/solo-sikoa.png" },
  { name: "Stephanie Vaquer", tier: "mid", sex: "woman", img: "images/stephanie-vaquer-2024.png" },
  { name: "Talla Tonga", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_h_hikuleo-2022-new.webp" },
  { name: "Tama Tonga", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_t_tama-tonga-2024.webp" },
  { name: "Tank Ledger", tier: "mid", sex: "man", img: "images/tank-ledger-2024-2.png" },
  { name: "Tatum Paxley", tier: "mid", sex: "woman", img: "images/tatum-paxley-2024.png" },
  { name: "Tavion Heights", tier: "mid", sex: "man", img: "images/tavion-heights-1.png" },
  { name: "The Miz", tier: "mid", sex: "man", img: "images/the-miz.png" },
  { name: "Thea Hail", tier: "mid", sex: "woman", img: "images/images_wrestling_wrestlers_t_thea-hail-2024.webp" },
  { name: "Tiffany Stratton", tier: "high", sex: "woman", img: "images/images_wwe2k24_roster_tiffany-stratton.webp" },
  { name: "Tommaso Ciampa", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_t_tommaso-ciampa-2024.webp" },
  { name: "Tonga Loa", tier: "mid", sex: "man", img: "images/images_wrestling_wrestlers_t_tonga-loa-2024.webp" },
  { name: "Tony D'Angelo", tier: "mid", sex: "man", img: "images/tony-dangelo-2024.png" },
  { name: "Trick Williams", tier: "high", sex: "man", img: "images/trick-williams.png" },
  { name: "Trish Stratus", tier: "high", sex: "woman", img: "images/images_wwe2k24_roster_trish-stratus.webp" },
  { name: "Tyler Bate", tier: "low", sex: "man", img: "images/images_wwe2k23_roster_tyler-bate.webp" },
  { name: "Tyra Mae Steele", tier: "low", sex: "woman", img: "images/images_wrestling_wrestlers_t_tyra-mae-steele.webp" },
  { name: "Tyriek Igwe", tier: "low", sex: "man", img: "images/tyriek-igwe-new.png" },
  { name: "Tyson Dupont", tier: "low", sex: "man", img: "images/tyson-dupont-new.png" },
  { name: "Uriah Connors", tier: "low", sex: "man", img: "images/uriah-connors-2025.png" },
  { name: "Uncle Howdy", tier: "mid", sex: "man", img: "images/bo-dallas-2024-1.png" },
  { name: "Wendy Choo", tier: "mid", sex: "woman", img: "images/wendy-choo.png" },
  { name: "Wes Lee", tier: "mid", sex: "man", img: "images/wes-lee-2024-new.png" },
  { name: "Wren Sinclair", tier: "mid", sex: "woman", img: "images/images_madi-wrenkowski-2024.webp" },
  { name: "Xavier Woods", tier: "mid", sex: "man", img: "images/xavier-woods-2024.png" },
  { name: "Yoshiki Inamura", tier: "mid", sex: "man", img: "images/yoshiki-inamura-2024-2.png" },
  { name: "Zaria", tier: "mid", sex: "woman", img: "images/zaria.png" },
  { name: "Zelina Vega", tier: "mid", sex: "woman", img: "images/zelina-vega.png" },
  { name: "Zoey Stark", tier: "mid", sex: "woman", img: "images/images_wwe2k23_roster_zoey-stark.webp" },
]

    let currentTier = "high";
    let currentSex = "man";

    function setCategory(sex) {
      currentSex = sex;
      currentTier = "high";
      alert("Now the draft is only done in the category: " + sex.toUpperCase());
      renderSuperstarList();
    }

    function draftForBrand(brand) {
      const available = superstars.filter(s => s.tier === currentTier && s.sex === currentSex);
      if (available.length === 0) {
        if (currentTier === "high") currentTier = "mid";
        else if (currentTier === "mid") currentTier = "low";
        else {
          alert("All the superstars in this category were drafted!");
          return;
        }
        saveDraft();
        return draftForBrand(brand);
        
      }

      const index = Math.floor(Math.random() * available.length);
      const selected = available[index];
      const pos = superstars.findIndex(s => s.name === selected.name);
      if (pos > -1) superstars.splice(pos, 1);

      startDraftAnimation(brand, selected);
      renderSuperstarList();
    }

    function startDraftAnimation(brand, selected) {
      const animationArea = document.getElementById("superstar-animation");
      animationArea.innerHTML = "";

      let frame = 0;
      const tierSuperstars = [...superstars, selected];
      tierSuperstars.push(selected);

      const interval = setInterval(() => {
        const show = tierSuperstars[frame % tierSuperstars.length];
        animationArea.innerHTML = `
          <img src="${show.img}" alt="${show.name}" class="superstar-img-large">
          <h2>${show.name}</h2>
        `;
        frame++;
      }, 30);

      setTimeout(() => {
        clearInterval(interval);
        animationArea.innerHTML = `
          <img src="${selected.img}" alt="${selected.name}" class="superstar-img-large">
          <h2>${selected.name} goes to ${brand}!</h2>
        `;

        const li = document.createElement("li");
        li.innerHTML = `<img src="${selected.img}" class="superstar-img"> ${selected.name}`;
        document.getElementById(`${brand}-list`).appendChild(li);
      }, 3000);
    }

    function addSuperstar() {
      const name = document.getElementById("name").value.trim();
      let img = document.getElementById("img").value.trim();
      const tier = document.getElementById("tier").value;
      const sex = document.getElementById("sex").value;

      if (!name) {
        alert("Complete the name!");
        return;
      }
      if (img === "") {
        img = "https://api-private.atlassian.com/users/a25a5a617b9f22fbabc6b6582e575ae8/avatar"; // ← poți schimba cu orice URL vrei
      }
      superstars.push({ name, img, tier, sex });
      alert(`${name} has been added to the list`);

      document.getElementById("name").value = "";
      document.getElementById("img").value = "";
      renderSuperstarList();
    }

    function renderSuperstarList() {
  const container = document.getElementById("superstar-list");
  container.innerHTML = "";

  superstars.forEach((s, index) => {
    const card = document.createElement("div");
    card.className = "superstar-card";
    card.style.backgroundImage = `url('${s.img || "https://upload.wikimedia.org/wikipedia/en/e/ee/Unknown-person.gif"}')`;

    // Buton stergere
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      superstars.splice(index, 1);
      renderSuperstarList();
    };

    const info = document.createElement("div");
    info.className = "info";
    info.textContent = s.name;

    const buttons = document.createElement("div");
    buttons.className = "buttons";

    ["RAW", "SmackDown", "NXT"].forEach((brand) => {
      const btn = document.createElement("button");
      btn.textContent = brand;
      btn.className = `button${brand.toLowerCase()}`;
      btn.onclick = () => addToBrand(s, brand);
      buttons.appendChild(btn);
    });

    card.appendChild(deleteBtn);
    card.appendChild(info);
    card.appendChild(buttons);
    container.appendChild(card);
  });
}


    function removeSuperstar(index) {
      superstars.splice(index, 1);
      renderSuperstarList();
    }

    function manualAssign(name, brand) {
      const i = superstars.findIndex(s => s.name === name);
      if (i > -1) {
        const s = superstars.splice(i, 1)[0];
        const li = document.createElement("li");
        li.innerHTML = `<img src="${s.img}" class="superstar-img"> ${s.name}`;
        document.getElementById(`${brand}-list`).appendChild(li);
        renderSuperstarList();
      }
    }

    renderSuperstarList();
    function exportToExcel() {
  const brands = ['RAW', 'SmackDown', 'NXT'];
  const wb = XLSX.utils.book_new();

  brands.forEach(brand => {
    const list = document.getElementById(`${brand}-list`);
    const data = [];

    for (const li of list.children) {
      const name = li.innerText.trim();
      data.push([name]);
    }

    // Construim sheet-ul cu spațiu și titlu
    const sheetData = [
      [`${brand} Roster`],      // Titlu
      [],                       // Linie goală
      ["Name"],                 // Headere
      ...data                   // Superstaruri
    ];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    ws["!cols"] = [{ wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, brand);
  });

  XLSX.writeFile(wb, 'WWE_Draft.xlsx');
}
window.addEventListener("load", () => {
  const saved = JSON.parse(localStorage.getItem("draftData"));
  if (saved) {
    document.getElementById("RAW-list").innerHTML = saved.RAW;
    document.getElementById("SmackDown-list").innerHTML = saved.SmackDown;
    document.getElementById("NXT-list").innerHTML = saved.NXT;
  }
});

function resetDraft() {
  if (confirm("Are you sure you want to reset the draft?")) {
    localStorage.removeItem("draftData");
    document.getElementById("RAW-list").innerHTML = "";
    document.getElementById("SmackDown-list").innerHTML = "";
    document.getElementById("NXT-list").innerHTML = "";
  }
}
function addToBrand(s, brand) {
  const li = document.createElement("li");
  li.innerHTML = `<img src="${s.img}" class="superstar-img"> ${s.name}`;
  document.getElementById(`${brand}-list`).appendChild(li);

  // Elimină superstarul din listă
  const index = superstars.findIndex(x => x.name === s.name);
  if (index > -1) {
    superstars.splice(index, 1);
  }

  renderSuperstarList();
}
document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const allCards = document.querySelectorAll("#superstar-list .superstar-card");

  allCards.forEach(card => {
    const name = card.querySelector(".info").textContent.toLowerCase();
    if (name.includes(query)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
});
