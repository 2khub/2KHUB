  let superstars = [
{ name: "Al Snow", tier: "low", sex: "man", img: "images3/al-snow-2000.png" },
{ name: "Alicia Fox", tier: "low", sex: "woman", img: "images3/alicia-fox-2008.png" },
{ name: "Antonio", tier: "low", sex: "man", img: "images3/antonio-2004.png" },
{ name: "Armando Estrada", tier: "low", sex: "man", img: "images3/armando-estrada-2007-new.png" },
{ name: "Ashley Massaro", tier: "low", sex: "woman", img: "images3/ashley-massaro.png" },
{ name: "Balls Mahoney", tier: "low", sex: "man", img: "images3/balls-mahoney-2005.png" },
{ name: "Barry Windham", tier: "mid", sex: "man", img: "images3/barry-windham-1997.png" },
{ name: "Batista", tier: "high", sex: "man", img: "images3/batista-2007.png" },
{ name: "Beth Phoenix", tier: "high", sex: "woman", img: "images3/beth-phoenix-2008-new.png" },
{ name: "Big Boss Man", tier: "mid", sex: "man", img: "images3/big-boss-man-1998.png" },
{ name: "Big Daddy V", tier: "mid", sex: "man", img: "images3/big-daddy-v-2007.png" },
{ name: "Big Show", tier: "high", sex: "man", img: "images3/big-show-2011.png" },
{ name: "Billy Gunn", tier: "mid", sex: "man", img: "images3/billy-gunn-2003.png" },
{ name: "Billy Kidman", tier: "mid", sex: "man", img: "images3/images_wrestling_wrestlers_b_billy-kidman-2004.webp" },
{ name: "The Blue Meanie", tier: "low", sex: "man", img: "images3/the-blue-meanie-2005.png" },
{ name: "Bobby Lashley", tier: "high", sex: "man", img: "images3/bobby-lashley-2005.png" },
{ name: "The Boogeyman", tier: "mid", sex: "man", img: "images3/boogeyman-2007.png" },
{ name: "Booker T", tier: "high", sex: "man", img: "images3/booker-t-2006-king-booker-new.png" },
{ name: "The Brian Kendrick", tier: "mid", sex: "man", img: "images3/the-brian-kendrick-2008.png" },
{ name: "Brock Lesnar", tier: "high", sex: "man", img: "images3/images_wrestling_wrestlers_b_brock-lesnar-2003.webp" },
{ name: "Brooke Adams", tier: "low", sex: "woman", img: "images3/brooke-tessmacher-2006-brooke-adams.png" },
{ name: "Bubba Ray Dudley", tier: "mid", sex: "man", img: "images3/bubba-ray-dudley-2002.png" },
{ name: "Candice Michelle", tier: "low", sex: "woman", img: "images3/candice-michelle-2008.png" },
{ name: "Carlito", tier: "mid", sex: "man", img: "images3/carlito-2006.png" },
{ name: "Carmella", tier: "low", sex: "woman", img: "images3/carmella-decesare.png" },
{ name: "Charlie Haas", tier: "mid", sex: "man", img: "images3/charlie-haas-2006.png" },
{ name: "Chavo Guerrero", tier: "mid", sex: "man", img: "images3/chavo-guerrero-2011.png" },
{ name: "Chris Benoit", tier: "high", sex: "man", img: "images3/chris-benoit-2005.png" },
{ name: "Chris Jericho", tier: "high", sex: "man", img: "images3/chris-jericho-2007.png" },
{ name: "Chris Kanyon", tier: "mid", sex: "man", img: "images3/chris-kanyon-2001.png" },
{ name: "Chris Masters", tier: "mid", sex: "man", img: "images3/chris-adonis-2007-chris-masters.png" },
{ name: "Christian", tier: "high", sex: "man", img: "images3/christian-2003.png" },
{ name: "Christopher Nowinski", tier: "low", sex: "man", img: "images3/chris-nowinski.png" },
{ name: "Christy Hemme", tier: "low", sex: "woman", img: "images3/christy-hemme-2004.png" },
{ name: "Chuck Palumbo", tier: "mid", sex: "man", img: "images3/chuck-palumbo-2008.png" },
{ name: "CM Punk", tier: "high", sex: "man", img: "images3/cm-punk-2006.png" },
{ name: "Cody Rhodes", tier: "mid", sex: "man", img: "images3/cody-rhodes-2013.png" },
{ name: "Crash Holly", tier: "mid", sex: "man", img: "images3/crash-holly-2000.png" },
{ name: "Curt Hawkins", tier: "low", sex: "man", img: "images3/curt-hawkins-2007.png" },
{ name: "D'Lo Brown", tier: "mid", sex: "man", img: "images3/dlo-brown-2004.png" },
{ name: "D-Von Dudley", tier: "mid", sex: "man", img: "images3/d-von-dudley-2003.png" },
{ name: "Daivari", tier: "low", sex: "man", img: "images3/daivari-2004.png" },
{ name: "Danny Basham", tier: "low", sex: "man", img: "images3/danny-basham.png" },
{ name: "Danny Doring", tier: "low", sex: "man", img: "images3/danny-doring-2006.png" },
{ name: "Dawn Marie", tier: "low", sex: "woman", img: "images3/dawn-marie-2004.png" },
{ name: "Deuce", tier: "low", sex: "man", img: "images3/deuce-2007.png" },
{ name: "Diamond Dallas Page", tier: "mid", sex: "man", img: "images3/images_wrestling_wrestlers_d_ddp-2010.webp" },
{ name: "Domino", tier: "mid", sex: "man", img: "images3/domino-2007.png" },
{ name: "Doug Basham", tier: "low", sex: "man", img: "images3/doug-basham-2006.png" },
{ name: "Drew McIntyre", tier: "mid", sex: "man", img: "images3/drew-mcintyre-2006-drew-galloway.png" },
{ name: "Eddie Guerrero", tier: "high", sex: "man", img: "images3/eddie-guerrero-2005-new.png" },
{ name: "Edge", tier: "high", sex: "man", img: "images3/edge-2006.png" },
{ name: "Eugene", tier: "mid", sex: "man", img: "images3/eugene.png" },
{ name: "Evan Bourne", tier: "low", sex: "man", img: "images3/matt-sydal-2008-evan-bourne.png" },
{ name: "Eve Torres", tier: "low", sex: "woman", img: "images3/eve-torres-2008-new.png" },
{ name: "Ezekiel", tier: "low", sex: "man", img: "images3/ezekiel-jackson-2008.png" },
{ name: "The Fabulous Moolah", tier: "low", sex: "woman", img: "images3/fabolous-moolah-1983.png" },
{ name: "Festus", tier: "low", sex: "man", img: "images3/luke-gallows-2007-festus-new.png" },
{ name: "Finlay", tier: "mid", sex: "man", img: "images3/finlay-2001.png" },
{ name: "Francine", tier: "low", sex: "woman", img: "images3/francine.png" },
{ name: "Frankie Kazarian", tier: "low", sex: "man", img: "images3/frankie-kazarian-2005.png" },
{ name: "Funaki", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_f_funaki-2002__copy.webp" },
{ name: "Gail Kim", tier: "low", sex: "woman", img: "images3/gail-kim-2003.png" },
{ name: "Giant Bernard", tier: "low", sex: "man", img: "images3/matt-bloom-2008-giant-bernard.png" },
{ name: "Goldberg", tier: "high", sex: "man", img: "images3/goldberg-2003.png" },
{ name: "Goldust", tier: "mid", sex: "man", img: "images3/goldust-2005.png" },
{ name: "Grandmaster Sexay", tier: "low", sex: "man", img: "images3/grand-master-sexay-1999.png" },
{ name: "The Great Khali", tier: "mid", sex: "man", img: "images3/images_wrestling_wrestlers_t_the-great-khali-2007.webp" },
{ name: "Gregory Helms", tier: "mid", sex: "man", img: "images3/gregory-helms-2006.png" },
{ name: "\"Hacksaw\" Jim Duggan", tier: "low", sex: "man", img: "images3/jim-duggan-2005-new.png" },
{ name: "Hardcore Holly", tier: "mid", sex: "man", img: "images3/hardcore-holly-1999.png" },
{ name: "Heidenreich", tier: "low", sex: "man", img: "images3/heidenreich.png" },
{ name: "Hiroko", tier: "low", sex: "woman", img: "images3/hiroko-suzuki.png" },
{ name: "Horace Hogan", tier: "low", sex: "man", img: "images3/horace-hogan-4.png" },
{ name: "Hornswoggle", tier: "low", sex: "man", img: "images3/swoggle-2006-hornswoggle.png" },
{ name: "Hulk Hogan", tier: "high", sex: "man", img: "images3/hulk-hogan-2005-new.png" },
{ name: "Ivory", tier: "low", sex: "woman", img: "images3/ivory-2001-new.png" },
{ name: "Jacqueline", tier: "low", sex: "woman", img: "images3/images_wrestling_wrestlers_j_jacqueline-2007.webp" },
{ name: "Jamie Noble", tier: "low", sex: "man", img: "images3/jamie-noble-2001.png" },
{ name: "Jazz", tier: "low", sex: "woman", img: "images3/jazz-2001.png" },
{ name: "Jeff Hardy", tier: "high", sex: "man", img: "images3/jeff-hardy-2008.png" },
{ name: "Jesse", tier: "low", sex: "man", img: "images3/jesse-2007.png" },
{ name: "Jillian Hall", tier: "low", sex: "woman", img: "images3/jillian-hall.png" },
{ name: "Jimmy Wang Yang", tier: "low", sex: "man", img: "images3/jimmy-wang-yang-2006.png" },
{ name: "John \"Bradshaw\" Layfield", tier: "high", sex: "man", img: "images3/jbl-2004.png" },
{ name: "John Cena", tier: "high", sex: "man", img: "images3/john-cena-2008.png" },
{ name: "John Morrison", tier: "mid", sex: "man", img: "images3/john-morrison-2006.png" },
{ name: "Johnny Stamboli", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_j_johnny-stamboli-2002__copy.webp" },
{ name: "JTG", tier: "low", sex: "man", img: "images3/jtg-2006.png" },
{ name: "Juventud", tier: "low", sex: "man", img: "images3/juventud-guerrera-2005.png" },
{ name: "Kane", tier: "high", sex: "man", img: "images3/kane-2004.png" },
{ name: "Katie Lea Burchill", tier: "low", sex: "woman", img: "images3/katarina-2008-katie-lea-burchill.png" },
{ name: "Kelly Kelly", tier: "low", sex: "woman", img: "images3/images_wrestling_wrestlers_k_kelly-kelly-new.webp" },
{ name: "Kenzo Suzuki", tier: "low", sex: "man", img: "images3/kenzo-suzuki-2004.png" },
{ name: "Kevin Nash", tier: "high", sex: "man", img: "images3/kevin-nash-2004-new.png" },
{ name: "Kid Kash", tier: "low", sex: "man", img: "images3/kid-kash-2002.png" },
{ name: "Kofi Kingston", tier: "mid", sex: "man", img: "images3/kofi-kingston-2007-new.png" },
{ name: "Krissy Vaine", tier: "low", sex: "woman", img: "images3/krissy-vaine-3.png" },
{ name: "Kurt Angle", tier: "high", sex: "man", img: "images3/kurt-angle-2002.png" },
{ name: "Lance Cade", tier: "mid", sex: "man", img: "images3/lance-cade-2008.png" },
{ name: "Lance Storm", tier: "mid", sex: "man", img: "images3/lance-storm.png" },
{ name: "Layla", tier: "low", sex: "woman", img: "images3/layla-2008-new.png" },
{ name: "Lita", tier: "high", sex: "woman", img: "images3/lita-2005-new.png" },
{ name: "Luther Reigns", tier: "low", sex: "man", img: "images3/luther-reigns.png" },
{ name: "Mark Henry", tier: "high", sex: "man", img: "images3/mark-henry-2003.png" },
{ name: "Mark Jindrak", tier: "low", sex: "man", img: "images3/mark-jindrak-2003.png" },
{ name: "Maryse", tier: "low", sex: "woman", img: "images3/maryse-2008.png" },
{ name: "Matt Hardy", tier: "mid", sex: "man", img: "images3/matt-hardy-2005-new.png" },
{ name: "Melina", tier: "mid", sex: "woman", img: "images3/melina-2007.png" },
{ name: "Michelle McCool", tier: "mid", sex: "woman", img: "images3/michelle-mccool-2007.png" },
{ name: "Mick Foley", tier: "high", sex: "man", img: "images3/mick-foley-2003-new.png" },
{ name: "Mickie James", tier: "mid", sex: "woman", img: "images3/mickie-james-2008-new.png" },
{ name: "The Miz", tier: "mid", sex: "man", img: "images3/the-miz-2007.png" },
{ name: "Montel Vontavious Porter", tier: "mid", sex: "man", img: "images3/mvp-2008.png" },
{ name: "Mr. Kennedy", tier: "mid", sex: "man", img: "images3/mr-anderson-2006-mr-kennedy.png" },
{ name: "Mr. Perfect", tier: "low", sex: "man", img: "images3/curt-hennig-2002.png" },
{ name: "Natalya", tier: "mid", sex: "woman", img: "images3/images_wrestling_wrestlers_n_natalya-2009-new.webp" },
{ name: "Nunzio", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_n_nunzio-2002.webp" },
{ name: "Orlando Jordan", tier: "low", sex: "man", img: "images3/orlando-jordan-2005.png" },
{ name: "Paul Burchill", tier: "low", sex: "man", img: "images3/paul-burchill-2008.png" },
{ name: "Paul London", tier: "mid", sex: "man", img: "images3/paul-london-2008.png" },
{ name: "Randy Orton", tier: "high", sex: "man", img: "images3/randy-orton-2007.png" },
{ name: "Raven", tier: "low", sex: "man", img: "images3/raven-2002.png" },
{ name: "René Duprée", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_r_rene-dupree-2006-new.webp" },
{ name: "Rey Mysterio", tier: "high", sex: "man", img: "images3/images_wrestling_wrestlers_r_rey-mysterio-2005-new.webp" },
{ name: "Rhino", tier: "mid", sex: "man", img: "images3/rhino-1999-1.png" },
{ name: "Ric Flair", tier: "high", sex: "man", img: "images3/ric-flair-2001.png" },
{ name: "Ricky Ortiz", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_r_ricky-ortiz-2008.webp" },
{ name: "Rikishi", tier: "mid", sex: "man", img: "images3/rikishi-2002.png" },
{ name: "The Road Warrior", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_a_animal-2006-road-warrior.webp" },
{ name: "Rob Conway", tier: "low", sex: "man", img: "images3/rob-conway-2005.png" },
{ name: "Rob Van Dam", tier: "high", sex: "man", img: "images3/rob-van-dam-2001-new.png" },
{ name: "Robbie McAllister", tier: "low", sex: "man", img: "images3/robbie-mcallister.png" },
{ name: "Rochelle Loewen", tier: "low", sex: "woman", img: "images3/rochelle-loewen.png" },
{ name: "The Rock", tier: "high", sex: "man", img: "images3/the-rock-2003-new.png" },
{ name: "Ron Simmons", tier: "low", sex: "man", img: "images3/ron-simmons-2006-new.png" },
{ name: "\"Rowdy\" Roddy Piper", tier: "low", sex: "man", img: "images3/roddy-piper-2005.png" },
{ name: "Sable", tier: "mid", sex: "woman", img: "images3/sable-2003.png" },
{ name: "Sabu", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_s_sabu-2000s.webp" },
{ name: "The Sandman", tier: "low", sex: "man", img: "images3/the-sandman-2000.png" },
{ name: "Santino Marella", tier: "mid", sex: "man", img: "images3/santino-marella-2007.png" },
{ name: "Scott Hall", tier: "high", sex: "man", img: "images3/scott-hall-1999.png" },
{ name: "Scott Steiner", tier: "mid", sex: "man", img: "images3/scott-steiner-2002.png" },
{ name: "Scotty 2 Hotty", tier: "mid", sex: "man", img: "images3/scotty-2-hotty-2003.png" },
{ name: "Sean O'Haire", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_s_sean-o-haire-2001.webp" },
{ name: "Shad Gaspard", tier: "low", sex: "man", img: "images3/shad-gaspard-2006.png" },
{ name: "Shane McMahon", tier: "mid", sex: "man", img: "images3/shane-mcmahon-2005.png" },
{ name: "Shannon Moore", tier: "mid", sex: "man", img: "images3/images_wrestling_wrestlers_s_shannon-moore-2006-new.webp" },
{ name: "Shawn Michaels", tier: "high", sex: "man", img: "images3/images_wrestling_wrestlers_s_shawn-michaels-2008-new.webp" },
{ name: "Shawn Stasiak", tier: "low", sex: "man", img: "images3/shawn-stasiak-1.png" },
{ name: "Shelton Benjamin", tier: "mid", sex: "man", img: "images3/shelton-benjamin-2008.png" },
{ name: "Stacy Keibler", tier: "mid", sex: "woman", img: "images3/stacy-keibler-2006.png" },
{ name: "\"Stone Cold\" Steve Austin", tier: "high", sex: "man", img: "images3/steve-austin-1998.png" },
{ name: "Super Crazy", tier: "low", sex: "man", img: "images3/images_wrestling_wrestlers_s_super-crazy-2005-new.webp" },
{ name: "Tajiri", tier: "mid", sex: "man", img: "images3/images_wrestling_wrestlers_t_tajiri-2002-new.webp" },
{ name: "Ted DiBiase Jr.", tier: "mid", sex: "man", img: "images3/ted-dibiase-jr-2008.png" },
{ name: "Terri", tier: "low", sex: "woman", img: "images3/terri-runnels-1998.png" },
{ name: "Test", tier: "mid", sex: "man", img: "images3/test-2006.png" },
{ name: "Tommy Dreamer", tier: "low", sex: "man", img: "images3/tommy-dreamer-2001.png" },
{ name: "Tony Atlas", tier: "low", sex: "man", img: "images3/tony-atlas-2008.png" },
{ name: "Torrie Wilson", tier: "mid", sex: "woman", img: "images3/torrie-wilson-2001.png" },
{ name: "Trevor Murdoch", tier: "low", sex: "man", img: "images3/trevor-murdoch-2005.png" },
{ name: "Triple H", tier: "high", sex: "man", img: "images3/triple-h-2008.png" },
{ name: "Trish Stratus", tier: "high", sex: "woman", img: "images3/trish-stratus-2004-new.png" },
{ name: "Umaga", tier: "mid", sex: "man", img: "images3/umaga-2005.png" },
{ name: "The Undertaker", tier: "high", sex: "man", img: "images3/the-undertaker-2006-new.png" },
{ name: "Victoria", tier: "mid", sex: "woman", img: "images3/tara-2007-victoria-new.png" },
{ name: "Vladimir Kozlov", tier: "mid", sex: "man", img: "images3/vladimir-kozlov.png" },
{ name: "William Regal", tier: "mid", sex: "man", img: "images3/william-regal-2007.png" },
{ name: "X-Pac", tier: "mid", sex: "man", img: "images3/sean-waltman-2002.png" },
{ name: "Zack Ryder", tier: "low", sex: "man", img: "images3/zack-ryder-2007.png" },
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

    ["RAW", "SmackDown", "ECW"].forEach((brand) => {
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
  const brands = ['RAW', 'SmackDown', 'ECW'];
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
    document.getElementById("ECW-list").innerHTML = saved.ECW;
  }
});

function resetDraft() {
  if (confirm("Are you sure you want to reset the draft?")) {
    localStorage.removeItem("draftData");
    document.getElementById("RAW-list").innerHTML = "";
    document.getElementById("SmackDown-list").innerHTML = "";
    document.getElementById("ECW-list").innerHTML = "";
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
