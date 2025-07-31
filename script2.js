  let superstars = [
  { name: "Adriana Rizzo", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/adrianna-rizzo-2024.png" },
  { name: "AJ Styles", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/aj-styles.png" },
  { name: "Akira Tozawa", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/akira-tozawa.png" },
  { name: "Alba Fyre", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/alba-fyre-new.png" },
  { name: "Aleister Black", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/aleister-black.jpg" },
  { name: "Alex Shelley", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/alex-shelley-2024.png" },
  { name: "Alexa Bliss", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/alexa-bliss.png" },
  { name: "Andrade", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/andrade-2.png" },
  { name: "Andre Chase", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/andre-chase-new.png" },
  { name: "Angel", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/angel-garza-2023-angel-new.png" },
  { name: "Angelo Dawkins", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/angelo-dawkins.png" },
  { name: "Apollo Crews", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/apollo-crews.png" },
  { name: "Arianna Grace", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/arianna-grace-2023-new.png" },
  { name: "Ashante \"Thee\" Adonis", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ashante-adonis.png" },
  { name: "Asuka", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/asuka-2.png" },
  { name: "Austin Theory", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/austin-theory-new.png" },
  { name: "Axiom", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/axiom.png" },
  { name: "B-Fab", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_b_b-fab-2024-1.webp" },
  { name: "Bayley", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/bayley.png" },
  { name: "Becky Lynch", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/becky-lynch.png" },
  { name: "Berto", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/humberto.png" },
  { name: "Bianca Belair", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/bianca-belair.png" },
  { name: "Blake Monroe", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/m/mariah-may-2025.png" },
  { name: "Brinley Reece", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/b/brinley-reece-2024.png" },
  { name: "Bronn Breakker", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bron-breakker.png" },
  { name: "Bronco Nima", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/b/bronco-nima.png" },
  { name: "Bronson Reed", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bronson-reed.png" },
  { name: "Brooks Jensen", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/brooks-jensen-new.png" },
  { name: "Brutus Creed", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/brutus-creed.png" },
  { name: "Candice LeRae", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/candice-lerae.png" },
  { name: "Carlee Bright", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/b/bronco-nima.png" },
  { name: "Carmelo Hayes", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/carmelo-hayes.png" },
  { name: "Chad Gable", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/chad-gable-2024.png" },
  { name: "Channing “Stacks” Lorenzo", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/channing-lorenzo-2024.png" },
  { name: "Charlie Dempsey", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/charlie-dempsey-2024.png" },
  { name: "Charlotte Flair", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/charlotte-flair-new.png" },
  { name: "Chelsea Green", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/chelsea-green-2024.png" },
  { name: "Chris Sabin", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/chris-sabin-2024.png" },
  { name: "CM Punk", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/cm-punk-2.png" },
  { name: "Cody Rhodes", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/cody-rhodes-2.png" },
  { name: "Cruz Del Toro", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/crus-del-toro.png" },
  { name: "Cutler James", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/cutler-james-2025-2.png" },
  { name: "Damian Priest", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/damian-priest.png" },
  { name: "Dante Chen", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dante-chen-2024.png" },
  { name: "Dexter Lumis", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/dexter-lumis-2.jpg" },
  { name: "Dion Lennox", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dion-lennox-2025-2.png" },
  { name: "Dominik Mysterio", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dominik-mysterio-2024.png" },
  { name: "Dragon Lee", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dragon-lee-2023.png" },
  { name: "Drew McIntyre", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/drew-mcintyre.png" },
  { name: "Edris Enofe", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/e/edris-enofe-2024.png" },
  { name: "Elton Prince", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/elton-prince.png" },
  { name: "Erik", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/e/erik-2024.png" },
  { name: "Erick Rowan", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/erick-rowan-2.jpg" },
  { name: "Ethan Page", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/ethan-page.png" },
  { name: "Fallon Henley", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/f/fallon-henley-2024-2.png" },
  { name: "Finn Balor", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/f/finn-balor-2021-new.png" },
  { name: "Giulia", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/giulia.jpg" },
  { name: "Grayson Waller", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/g/grayson-waller-2023-new.png" },
  { name: "Gunther", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/gunther.png" },
  { name: "Hank Walker", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/h/hank-walker-1.png" },
  { name: "Ilja Dragunov", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_i_ilja-dragunov-2024.webp" },
  { name: "Ivar", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/i/ivar-2024.png" },
  { name: "Ivy Nile", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ivy-nile.png" },
  { name: "Iyo Sky", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/iyo-sky.png" },
  { name: "Izzi Dame", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/i/izzi-dame-2024.png" },
  { name: "Jacob Fatu", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jacob-fatu.png" },
  { name: "Jacy Jayne", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jacy-jayne.png" },
  { name: "Jade Cargill", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_j_jade-cargill-2024.webp" },
  { name: "Jaida Parker", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jaida-parker-2023.png" },
  { name: "Jasper Troy", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jasper-troy-2025-1.png" },
  { name: "Jazmyn Nyx", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_j_jazmyn-nyx-2024.webp" },
  { name: "JC Mateo", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jeff-cobb-2025.png" },
  { name: "JD McDonagh", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jd-mcdonagh-2024.png" },
  { name: "Je'Von Evans", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jevon-evans.png" },
  { name: "Jey Uso", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jey-uso.png" },
  { name: "Jimmy Uso", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jimmy-uso.png" },
  { name: "Joaquin Wilde", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/joaquin-wilde.png" },
  { name: "Joe Gacy", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/joe-gacy-2.jpg" },
  { name: "Joe Hendry", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/joe-hendry-2021-2.png" },
  { name: "John Cena", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/john-cena-25.png" },
  { name: "Johnny Gargano", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/johnny-gargano.png" },
  { name: "Jordynne Grace", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jordynne-grace.jpg" },
  { name: "Josh Briggs", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/josh-briggs.png" },
  { name: "Julius Creed", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/julius-creed.png" },
  { name: "Kairi Sane", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_k_kairi-sane-2023-1.webp" },
  { name: "Kale Dixon", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/k/kale-dixon-2025.png#joomlaImage://local-images/wrestling/wrestlers/k/kale-dixon-2025.png?width=200&height=200" },
  { name: "Karmen Petrovic", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/k/karmen-petrovic-2024.png" },
  { name: "Karrion Kross", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/karrion-kross.png" },
  { name: "Kelani Jordan", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/kelani-jordan-3.png" },
  { name: "Kendal Grey", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_k_kendal-grey.webp" },
  { name: "Kevin Owens", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/kevin-owens.png" },
  { name: "Kiana James", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/kiana-james.png" },
  { name: "Kit Wilson", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/kit-wilson.png" },
  { name: "Kofi Kingston", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/k/kofi-kingston-2024.png" },
  { name: "LA Knight", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/la-knight.png" },
  { name: "Lainey Reid", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_l_lainey-reid-2024.webp" },
  { name: "Lash Legend", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lash-legend-2024.png" },
  { name: "Lexis King", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/lexis-king.png" },
  { name: "Lince Dorado", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lince-dorado-2020.png" },
  { name: "Liv Morgan", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/liv-morgan.png" },
  { name: "Logan Paul", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/logan-paul.png" },
  { name: "Lola Vice", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lola-vice-2022.png" },
  { name: "Luca Crusifino", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/luca-crusifino-2023-1.png" },
  { name: "Lucien Price", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lucien-price-1.png" },
  { name: "Lyra Valkyria", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/lyra-valkyria.png" },
  { name: "Malik Blade", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/m/malik-blade-2024.png" },
  { name: "Maxxine Dupri", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/maxxine-dupri.png" },
  { name: "Michin", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_m_mia-yim-2024-1.webp" },
  { name: "Mike Santana", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/m/mike-santana-2025.png" },
  { name: "Montez Ford", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/montez-ford.png" },
  { name: "Myles Borne", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_m_myles-borne-2022.webp" },
  { name: "Naomi", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/naomi.png" },
  { name: "Natalya", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/natalya.png" },
  { name: "Nathan Frazer", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/nathan-frazer.png" },
  { name: "New Jack", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/new-jack.jpg" },
  { name: "Nia Jax", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/nia-jax.png" },
  { name: "Nikki Bella", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/n/nikki-bella-2024.png" },
  { name: "Nikki Cross", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/nikki-cross-2.jpg" },
  { name: "Nikkita Lyons", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/n/nikkita-lyons-2023.png" },
  { name: "Niko Vance", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/n/niko-vance-2024.png" },
  { name: "Noam Dar", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/noam-dar.png" },
  { name: "Oba Femi", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/o/oba-femi-2023-new.png" },
  { name: "Osiris Griffin", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/o/osiris-griffin-2025-2.png" },
  { name: "Otis", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/otis.png" },
  { name: "Penta", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/penta.jpg" },
  { name: "Pete Dunne", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_p_pete-dunne-2024.webp" },
  { name: "Piper Niven", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/piper-niven.png" },
  { name: "R-Truth", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/r-truth.png" },
  { name: "Randy Orton", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/randy-orton.png" },
  { name: "Raquel Rodriguez", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/r/raquel-rodriguez-2024.png" },
  { name: "Rey Fenix", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_f_fenix-2023.webp" },
  { name: "Rey Mysterio", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/rey-mysterio.png" },
  { name: "Rhea Ripley", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/rhea-ripley.png" },
  { name: "Ricky Saints", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/r/ricky-starks-2022.png" },
  { name: "Ridge Holland", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_r_ridge-holland-2024.webp" },
  { name: "Roman Reigns", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/roman-reigns-new.png" },
  { name: "Roxanne Perez", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_r_roxanne-perez-2024.webp" },
  { name: "Rusev", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/r/rusev-2025.png" },
  { name: "Sami Zayn", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/sami-zayn.png" },
  { name: "Santos Escobar", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/santos-escobar.png" },
  { name: "Saquon Shugars", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/saquon-shugars-2025-2.png" },
  { name: "Scarlett", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/scarlett-2024.png" },
  { name: "Seth Rollins", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/seth-rollins.png" },
  { name: "Shawn Spears", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_s_shawn-spears-2024.webp" },
  { name: "Sheamus", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_s_sheamus-2022__copy.webp" },
  { name: "Shinsuke Nakamura", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/shinsuke-nakamura-2024.png" },
  { name: "Sol Ruca", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/sol-ruca-1.png" },
  { name: "Solo Sikoa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/solo-sikoa.png" },
  { name: "Stephanie Vaquer", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/stephanie-vaquer.jpg" },
  { name: "Tola Tonga", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_h_hikuleo-2022-new.webp" },
  { name: "Tama Tonga", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tama-tonga-2024.webp" },
  { name: "Tank Ledger", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tank-ledger-2024-2.png" },
  { name: "Tatum Paxley", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tatum-paxley-2024.png" },
  { name: "Tavion Heights", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tavion-heights-1.png" },
  { name: "The Miz", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/the-miz.png" },
  { name: "Thea Hail", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_thea-hail-2024.webp" },
  { name: "Tiffany Stratton", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/tiffany-stratton.png" },
  { name: "Tommaso Ciampa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tommaso-ciampa-2024.webp" },
  { name: "Tonga Loa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tonga-loa-2024.webp" },
  { name: "Tony D'Angelo", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tony-dangelo-2024.png" },
  { name: "Trick Williams", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/trick-williams.png" },
  { name: "Trish Stratus", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/trish-stratus.png" },
  { name: "Tyler Bate", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/tyler-bate.png" },
  { name: "Tyra Mae Steele", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tyra-mae-steele.webp" },
  { name: "Tyriek Igwe", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tyriek-igwe-new.png" },
  { name: "Tyson Dupont", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tyson-dupont-new.png" },
  { name: "Uriah Connors", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/u/uriah-connors-2025.png#joomlaImage://local-images/wrestling/wrestlers/u/uriah-connors-2025.png?width=200&height=200" },
  { name: "Uncle Howdy", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wwe2k24_roster_uncle-howdy.webp" },
  { name: "Wendy Choo", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/wendy-choo.png" },
  { name: "Wes Lee", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/w/wes-lee-2024-new.png" },
  { name: "Wren Sinclair", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_madi-wrenkowski-2024.webp" },
  { name: "Xavier Woods", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/x/xavier-woods-2024.png" },
  { name: "Yoshiki Inamura", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/y/yoshiki-inamura-2024-2.png" },
  { name: "Zaria", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/y/yoshiki-inamura-2024-2.png" },
  { name: "Zelina Vega", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/zelina-vega.png" },
  { name: "Zoey Stark", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/zoey-stark.png" },
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
      const tierSuperstars = superstars.filter(s => s.tier === currentTier && s.sex === currentSex);
      tierSuperstars.push(selected);

      const interval = setInterval(() => {
        const show = tierSuperstars[frame % tierSuperstars.length];
        animationArea.innerHTML = `
          <img src="${show.img}" alt="${show.name}" class="superstar-img-large">
          <h2>${show.name}</h2>
        `;
        frame++;
      }, 150);

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
