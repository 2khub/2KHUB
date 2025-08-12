  let superstars = [
  { name: "8-Ball", tier: "low", sex: "man", img: "images2/ron-harris-1997-8-ball.png" },
  { name: "Ahmed Johnson", tier: "mid", sex: "man", img: "images2/ahmed-johnson-1997.png" },
  { name: "Al Snow", tier: "mid", sex: "man", img: "images2/al-snow-2000.png" },
  { name: "Albert", tier: "mid", sex: "man", img: "images2/matt-bloom-1999-albert.png" },
  { name: "Animal", tier: "mid", sex: "man", img: "images2/animal-1997.png" },
  { name: "B.B.", tier: "low", sex: "woman", img: "images2/bb-1.png" },
  { name: "Barry Windham", tier: "low", sex: "man", img: "images2/barry-windham-1997.png" },
  { name: "Bart Gunn", tier: "low", sex: "man", img: "images2/bart-gunn-1997.png" },
  { name: "Big Boss Man", tier: "mid", sex: "man", img: "images2/big-boss-man-1998.png" },
  { name: "Big Show", tier: "high", sex: "man", img: "images2/big-show-2001.png" },
  { name: "Billy", tier: "mid", sex: "man", img: "images2/billy-gunn-2001-billy.png" },
  { name: "Billy Kidman", tier: "low", sex: "man", img: "images2/billy-kidman-2001.png" },
  { name: "Booker T", tier: "mid", sex: "man", img: "images2/booker-t-2001.png" },
  { name: "Bradshaw", tier: "mid", sex: "man", img: "images2/jbl-2003-bradshaw-new.png" },
  { name: "Bret \"The Hitman\" Hart", tier: "high", sex: "man", img: "images2/bret-hart-1984-new.png" },
  { name: "Brian Adams", tier: "low", sex: "man", img: "images2/crush-2000-brian-adams.png" },
  { name: "The British Bulldog", tier: "low", sex: "man", img: "images2/british-bulldog-1997.png" },
  { name: "Brock Lesnar", tier: "high", sex: "man", img: "images2/brock-lesnar-2000.png" },
  { name: "The Brooklyn Brawler", tier: "low", sex: "man", img: "images2/brooklyn-brawler-attitude-era.png" },
  { name: "Bruno Lauer", tier: "low", sex: "man", img: "images2/harvey-wippleman-2.png" },
  { name: "Bryan Clark", tier: "low", sex: "man", img: "images2/adam-bomb-1997-wrath.png" },
  { name: "Bubba Ray Dudley", tier: "mid", sex: "man", img: "images2/bubba-ray-dudley-2002.png" },
  { name: "Bull Buchanan", tier: "low", sex: "man", img: "images2/bull-buchanan-2000.png" },
  { name: "Chainz", tier: "low", sex: "man", img: "images2/brian-lee-chainz.png" },
  { name: "Chavo Guerrero", tier: "mid", sex: "man", img: "images2/chavo-guerrero-2001-new.png" },
  { name: "Chris Benoit", tier: "mid", sex: "man", img: "images2/chris-benoit-2001-alt.png" },
  { name: "Chris Jericho", tier: "high", sex: "man", img: "images2/chris-jericho-2002-1.png" },
  { name: "Chris Kanyon", tier: "low", sex: "man", img: "images2/chris-kanyon-2001.png" },
  { name: "Christian", tier: "mid", sex: "man", img: "images2/christian-2002-new.png" },
  { name: "Christopher Daniels", tier: "low", sex: "man", img: "images2/christopher-daniels-1998-new.png" },
  { name: "Chuck", tier: "low", sex: "man", img: "images2/chuck-palumbo-2002-chuck.png" },
  { name: "Chyna", tier: "high", sex: "woman", img: "images2/chyna-2000.png" },
  { name: "Crash", tier: "mid", sex: "man", img: "images2/crash-holly-2000.png" },
  { name: "Curtis Hughes", tier: "low", sex: "man", img: "images2/mr-hughes-1999-curtis-hughes.png" },
  { name: "D'Lo Brown", tier: "mid", sex: "man", img: "images2/dlo-brown-1998.png" },
  { name: "Dan Severn", tier: "low", sex: "man", img: "images2/dan-severn-1998.png" },
  { name: "David Flair", tier: "low", sex: "man", img: "images2/david-flair-2001.png" },
  { name: "Dean Malenko", tier: "mid", sex: "man", img: "images2/dean-malenko-2000.png" },
  { name: "Debra", tier: "low", sex: "woman", img: "images2/debra.png" },
  { name: "Diamond Dallas Page", tier: "mid", sex: "man", img: "images2/ddp-2010.png" },
  { name: "Dick Togo", tier: "low", sex: "man", img: "images2/dick-togo-2.png" },
  { name: "Doug Furnas", tier: "low", sex: "man", img: "images2/doug-furnas-1996.png" },
  { name: "\"Dr. Death\" Steve Williams", tier: "low", sex: "man", img: "images2/steve-williams-1998.png" },
  { name: "Droz", tier: "low", sex: "man", img: "images2/droz-2.png" },
  { name: "Edge", tier: "mid", sex: "man", img: "images2/edge-2002.png" },
  { name: "Eddie Guerrero", tier: "mid", sex: "man", img: "images2/eddie-guerrero-2000.png" },
  { name: "Essa Ríos", tier: "mid", sex: "man", img: "images2/essa-rios-1997.png" },
  { name: "Evan Karagias", tier: "low", sex: "man", img: "images2/evan-karagias-1.png" },
  { name: "The Fabulous Moolah", tier: "low", sex: "woman", img: "images2/fabolous-moolah-1983.png" },
  { name: "Fit Finlay", tier: "low", sex: "man", img: "images2/finlay-1999.png" },
  { name: "Funaki", tier: "mid", sex: "man", img: "images2/funaki-2002_copy.png" },
  { name: "Gangrel", tier: "mid", sex: "man", img: "images2/gangrel-1998-new.png" },
  { name: "George \"The Animal\" Steele", tier: "low", sex: "man", img: "images2/george-steele.png" },
  { name: "Gerald Brisco", tier: "low", sex: "man", img: "images2/gerald-brisco-1985.png" },
  { name: "Giant Silva", tier: "low", sex: "man", img: "images2/giant-silva-1998.png" },
  { name: "Gillberg", tier: "low", sex: "man", img: "images2/gillberg-1999.png" },
  { name: "The Godfather", tier: "mid", sex: "man", img: "images2/the-godfather-2002.png" },
  { name: "Goldust", tier: "mid", sex: "man", img: "images2/goldust-2002.png" },
  { name: "Golga", tier: "low", sex: "man", img: "images2/earthquake-1998-golga-new.png" },
  { name: "Grandmaster Sexay", tier: "mid", sex: "man", img: "images2/grand-master-sexay-1999.png" },
  { name: "Haku", tier: "mid", sex: "man", img: "images2/haku-1999-meng-new.png" },
  { name: "Hardcore Holly", tier: "mid", sex: "man", img: "images2/hardcore-holly-1999.png" },
  { name: "Hawk", tier: "mid", sex: "man", img: "images2/hawk-1997.png" },
  { name: "Hollywood Hulk Hogan", tier: "high", sex: "man", img: "images2/hulk-hogan-2002-new.png" },
  { name: "Hugh Morrus", tier: "low", sex: "man", img: "images2/bill-demott-2000-general-hugh-g-rection.png" },
  { name: "The Hurricane", tier: "mid", sex: "man", img: "images2/gregory-helms-2001-the-hurricane.png" },
  { name: "Ivory", tier: "mid", sex: "woman", img: "images2/ivory-2001-new.png" },
  { name: "The Jackal", tier: "low", sex: "man", img: "images2/don-callis-1997.png" },
  { name: "Jacqueline", tier: "mid", sex: "woman", img: "images2/jacqueline-2002.png" },
  { name: "Jacques Rougeau", tier: "low", sex: "man", img: "images2/the-mountie-1998.png" },
  { name: "Jazz", tier: "mid", sex: "woman", img: "images2/jazz-2001.png" },
  { name: "Jeff Hardy", tier: "mid", sex: "man", img: "images2/jeff-hardy-2002.png" },
  { name: "Jeff Jarrett", tier: "mid", sex: "man", img: "images2/jeff-jarrett-1999-1.png" },
  { name: "Jerry Lynn", tier: "low", sex: "man", img: "images2/jerry-lynn-1997.png" },
  { name: "Jim Cornette", tier: "low", sex: "man", img: "images2/jim-cornette-1993.png" },
  { name: "Jim Neidhart", tier: "low", sex: "man", img: "images2/jim-neidhart-1994.png" },
  { name: "Joey Abs", tier: "low", sex: "man", img: "images2/joey-abs.png" },
  { name: "Johnny Grunge", tier: "low", sex: "man", img: "images2/johnny-grunge-1997.png" },
  { name: "Just Joe", tier: "mid", sex: "man", img: "images2/joe-e-legend-2000-just-joe.png" },
  { name: "Justin Credible", tier: "mid", sex: "man", img: "images2/justin-credible-1997.png" },
  { name: "K-Kwik", tier: "mid", sex: "man", img: "images2/r-truth-2000-k-kwik.png" },
  { name: "Kane", tier: "high", sex: "man", img: "images2/kane-1999-new.png" },
  { name: "The Kat", tier: "low", sex: "woman", img: "images2/the-kat-2.png" },
  { name: "Ken Shamrock", tier: "mid", sex: "man", img: "images2/ken-shamrock.png" },
  { name: "Kevin Nash", tier: "high", sex: "man", img: "images2/kevin-nash-2004.png" },
  { name: "Kurrgan", tier: "low", sex: "man", img: "images2/kurrgan-1998.png" },
  { name: "Kurt Angle", tier: "high", sex: "man", img: "images2/kurt-angle-1999.png" },
  { name: "Lance Storm", tier: "mid", sex: "man", img: "images2/lance-storm.png" },
  { name: "Lita", tier: "high", sex: "woman", img: "images2/lita-2000-new.png" },
  { name: "Luna", tier: "mid", sex: "woman", img: "images2/luna-vachon.png" },
  { name: "Mae Young", tier: "low", sex: "woman", img: "images2/mae-young-1999.png" },
  { name: "Mark Canterbury", tier: "low", sex: "man", img: "images2/henry-o-godwinn-1998.png" },
  { name: "Mark Henry", tier: "mid", sex: "man", img: "images2/mark-henry-2002.png" },
  { name: "Mark Jindrak", tier: "mid", sex: "man", img: "images2/mark-jindrak-2001.png" },
  { name: "\"Marvelous\" Marc Mero", tier: "mid", sex: "man", img: "images2/marc-mero-4.png" },
  { name: "Matt Hardy", tier: "mid", sex: "man", img: "images2/matt-hardy-2002-new.png" },
  { name: "Maven", tier: "mid", sex: "man", img: "images2/maven.png" },
  { name: "Mick Foley", tier: "high", sex: "man", img: "images2/mick-foley-2000-new.png" },
  { name: "Molly Holly", tier: "mid", sex: "woman", img: "images2/molly-holly-2002.png" },
  { name: "Mosh", tier: "low", sex: "man", img: "images2/mosh-2.png" },
  { name: "Mr. McMahon", tier: "mid", sex: "man", img: "images2/vince-mcmahon-2000-1.png" },
  { name: "Mr. Perfect", tier: "mid", sex: "man", img: "images2/curt-hennig-2002.png" },
  { name: "Nicole Bass", tier: "low", sex: "woman", img: "images2/nicole-bass1999.png" },
  { name: "Pat Patterson", tier: "low", sex: "man", img: "images2/pat-patterson-1984.png" },
  { name: "The Patriot", tier: "low", sex: "man", img: "images2/the-patriot-june-30-1997.png" },
  { name: "Perry Saturn", tier: "mid", sex: "man", img: "images2/perry-saturn-2000.png" },
  { name: "Pete Gas", tier: "low", sex: "man", img: "images2/pete-gas.png" },
  { name: "Philip LaFon", tier: "low", sex: "man", img: "images2/phil-lafon-1996.png" },
  { name: "Pierre Ouellet", tier: "low", sex: "man", img: "images2/pco-1996.png" },
  { name: "Randy Orton", tier: "low", sex: "man", img: "images2/randy-orton-2002.png" },
  { name: "Raven", tier: "mid", sex: "man", img: "images2/raven-2002.png" },
  { name: "\"Ravishing\" Rick Rude", tier: "low", sex: "man", img: "images2/rick-rude-1999.png" },
  { name: "Reverend D-Von", tier: "mid", sex: "man", img: "images2/d-von-dudley-2002-reverend-devon-new.png" },
  { name: "Rhyno", tier: "mid", sex: "man", img: "images2/rhino-1999-1.png" },
  { name: "Ric Flair", tier: "high", sex: "man", img: "images2/ric-flair-2001.png" },
  { name: "Ricky Morton", tier: "low", sex: "man", img: "images2/ricky-morton.png" },
  { name: "Rico Costantino", tier: "low", sex: "man", img: "images2/rico-2002.png" },
  { name: "Rikishi", tier: "mid", sex: "man", img: "images2/rikishi-2002.png" },
  { name: "Road Dogg", tier: "mid", sex: "man", img: "images2/road-dogg-1998.png" },
  { name: "Rob Van Dam", tier: "high", sex: "man", img: "images2/rob-van-dam-2001-new.png" },
  { name: "Robert Gibson", tier: "low", sex: "man", img: "images2/robert-gibson.png" },
  { name: "Rocco Rock", tier: "low", sex: "man", img: "images2/rocco-rock.png" },
  { name: "The Rock", tier: "high", sex: "man", img: "images2/the-rock-2002-new.png" },
  { name: "Ron Simmons", tier: "mid", sex: "man", img: "images2/ron-simmons-1999-faarooq.png" },
  { name: "Ryan Shamrock", tier: "low", sex: "woman", img: "images2/ryan-shamrock-1999.png" },
  { name: "Sable", tier: "high", sex: "woman", img: "images2/sable-1996.png" },
  { name: "Sara", tier: "low", sex: "woman", img: "images2/sara-calaway.png" },
  { name: "Savio Vega", tier: "low", sex: "man", img: "images2/savio-vega-1998.png" },
  { name: "Scorpio", tier: "low", sex: "man", img: "images2/2-cold-scorpio-2.png" },
  { name: "Scott Hall", tier: "high", sex: "man", img: "images2/scott-hall-1999.png" },
  { name: "Scotty 2 Hotty", tier: "mid", sex: "man", img: "images2/scotty-2-hotty-1999.png" },
  { name: "Sgt. AWOL", tier: "low", sex: "man", img: "images2/the-wall-2000-sgt-awol.png" },
  { name: "Sgt. Slaughter", tier: "low", sex: "man", img: "images2/sgt-slaughter-2020.png" },
  { name: "Shane McMahon", tier: "mid", sex: "man", img: "images2/shane-mcmahon-1998-new.png" },
  { name: "Shawn Michaels", tier: "mid", sex: "man", img: "images2/images_wrestling_wrestlers_s_shawn-michaels-1996-new.webp" },
  { name: "Shawn Stasiak", tier: "mid", sex: "man", img: "images2/shawn-stasiak-1.png" },
  { name: "Skull", tier: "low", sex: "man", img: "images2/don-harris-1997-skull.png" },
  { name: "Spike Dudley", tier: "mid", sex: "man", img: "images2/spike-dudley-2002.png" },
  { name: "Stacy Keibler", tier: "low", sex: "woman", img: "images2/stacy-keibler-1999.png" },
  { name: "Stephanie McMahon", tier: "mid", sex: "woman", img: "images2/stephanie-mcmahon-2002.png" },
  { name: "Steve Blackman", tier: "mid", sex: "man", img: "images2/steve-blackman-new.png" },
  { name: "Steve Corino", tier: "low", sex: "man", img: "images2/steve-corino-1998.png" },
  { name: "Steven Richards", tier: "mid", sex: "man", img: "images2/stevie-richards-2002.png" },
  { name: "\"Stone Cold\" Steve Austin", tier: "high", sex: "man", img: "images2/steve-austin-1998.png" },
  { name: "Sunny", tier: "low", sex: "woman", img: "images2/sunny.png" },
  { name: "Tajiri", tier: "mid", sex: "man", img: "images2/images_wrestling_wrestlers_t_tajiri-2002-new.webp" },
  { name: "TAKA Michinoku", tier: "mid", sex: "man", img: "images2/images_wrestling_wrestlers_t_taka-michinoku-1997-new.webp" },
  { name: "Tazz", tier: "mid", sex: "man", img: "images2/taz-2001-tazz.png" },
  { name: "Tennessee Lee", tier: "low", sex: "man", img: "images2/col-robert-parker-1998-new.png" },
  { name: "Terri", tier: "low", sex: "woman", img: "images2/terri-runnels-1998.png" },
  { name: "Terry Funk", tier: "low", sex: "man", img: "images2/terry-funk-1998-1.png" },
  { name: "Terry Taylor", tier: "low", sex: "man", img: "images2/terry-taylor-5.png" },
  { name: "Test", tier: "mid", sex: "man", img: "images2/test-1998.png" },
  { name: "Thrash", tier: "low", sex: "man", img: "images2/images_wrestling_wrestlers_t_thrasher-2021.webp" },
  { name: "Tiger Ali Singh", tier: "low", sex: "man", img: "images2/tiger-ali-singh-5.png" },
  { name: "Tiger Jeet Singh", tier: "low", sex: "man", img: "images2/tiger-jeet-singh-1997.png" },
  { name: "Tiger Mask (IV)", tier: "low", sex: "man", img: "images2/tiger-mask-iv-yoshihiro-yamazaki-1.png" },
  { name: "Tito Santana", tier: "low", sex: "man", img: "images2/tito-santana-1991.png" },
  { name: "Tommy Dreamer", tier: "low", sex: "man", img: "images2/tommy-dreamer-2001.png" },
  { name: "Tori", tier: "low", sex: "woman", img: "images2/tori.png" },
  { name: "Torrie Wilson", tier: "mid", sex: "woman", img: "images2/torrie-wilson-2001.png" },
  { name: "Triple H", tier: "high", sex: "man", img: "images2/triple-h-2002-new.png" },
  { name: "Trish Stratus", tier: "high", sex: "woman", img: "images2/trish-stratus-2000-new.png" },
  { name: "The Undertaker", tier: "high", sex: "man", img: "images2/the-undertaker-2002-new.png" },
  { name: "Vader", tier: "mid", sex: "man", img: "images2/vader-1992-1.png" },
  { name: "Viscera", tier: "mid", sex: "man", img: "images2/big-daddy-v-1999-viscera.png" },
  { name: "William Regal", tier: "mid", sex: "man", img: "images2/william-regal-2002.png" },
  { name: "X-Pac", tier: "mid", sex: "man", img: "images2/sean-waltman-2002.png" },
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

    ["RAW", "SmackDown"].forEach((brand) => {
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
  const brands = ['RAW', 'SmackDown'];
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
  }
});

function resetDraft() {
  if (confirm("Are you sure you want to reset the draft?")) {
    localStorage.removeItem("draftData");
    document.getElementById("RAW-list").innerHTML = "";
    document.getElementById("SmackDown-list").innerHTML = "";
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
