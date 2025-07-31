  let superstars = [
  { name: "AJ Styles", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/aj-styles.png" },
  { name: "Akam", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_a_akam-2023.webp" },
  { name: "Akira Tozawa", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/akira-tozawa.png" },
  { name: "Alba Fyre", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/alba-fyre-new.png" },
  { name: "Aleister Black", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/aleister-black.jpg" },
  { name: "Alexa Bliss", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/alexa-bliss.png" },
  { name: "Andrade", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/andrade-2.png" },
  { name: "Andre Chase", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/andre-chase-new.png" },
  { name: "Andre The Giant", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/andre-the-giant-1987.png" },
  { name: "Angel", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/a/angel-garza-2023-angel-new.png" },
  { name: "Angelo Dawkins", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/angelo-dawkins.png" },
  { name: "Apollo Crews", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/apollo-crews.png" },
  { name: "Ashante \"Thee\" Adonis", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ashante-adonis.png" },
  { name: "Asuka", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/asuka-2.png" },
  { name: "Austin Theory", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/austin-theory-new.png" },
  { name: "Axiom", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/axiom.png" },
  { name: "B-Fab", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_b_b-fab-2024-1.webp" },
  { name: "Baron Corbin", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/baron-corbin.png" },
  { name: "Batista", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/batista-new.png" },
  { name: "Bayley", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/bayley.png" },
  { name: "Becky Lynch", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/becky-lynch.png" },
  { name: "Berto", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/humberto.png" },
  { name: "Bianca Belair", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/bianca-belair.png" },
  { name: "Big E", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/big-e.png" },
  { name: "Blair Davenport", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/blair-davenport.png" },
  { name: "Boogeyman", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/boogeyman.png" },
  { name: "Booker T", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/booker-t.png" },
  { name: "Braun Strowman", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/braun-strowman.png" },
  { name: "Bray Wyatt", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bray-wyatt-new.png" },
  { name: "The Fiend", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/the-fiend.png" },
  { name: "Bret Hart", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bret-hart.png" },
  { name: "British Bulldog", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/british-bulldog.png" },
  { name: "Bronn Breakker", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bron-breakker.png" },
  { name: "Bronson Reed", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/bronson-reed.png" },
  { name: "Brooks Jensen", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/brooks-jensen-new.png" },
  { name: "Bruno Sammartino", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/bruno-sammartino.png" },
  { name: "Brutus Creed", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/brutus-creed.png" },
  { name: "Bubba Ray Dudley", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/b/bubba-ray-dudley-2015.png" },
  { name: "Candice LeRae", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/candice-lerae.png" },
  { name: "Carlito", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/carlito-2023.png" },
  { name: "Carmella", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/carmella.png" },
  { name: "Carmelo Hayes", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/carmelo-hayes.png" },
  { name: "Cedric Alexander", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_c_cedric-alexander-2023.webp" },
  { name: "Chad Gable", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/chad-gable-2024.png" },
  { name: "Channing “Stacks” Lorenzo", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/channing-lorenzo-2024.png" },
  { name: "Charlie Dempsey", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/charlie-dempsey-2024.png" },
  { name: "Charlotte Flair", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/charlotte-flair-new.png" },
  { name: "Chelsea Green", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/chelsea-green-2024.png" },
  { name: "Chyna", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/chyna.png" },
  { name: "CM Punk", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/cm-punk-2.png" },
  { name: "Cody Rhodes", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/cody-rhodes-2.png" },
  { name: "Stardust", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_c_cody-rhodes-2015-stardust-new.webp" },
  { name: "Cora Jade", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/cora-jade.png" },
  { name: "Cruz Del Toro", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/crus-del-toro.png" },
  { name: "D-Von Dudley", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/d-von-dudley-2015.png" },
  { name: "Dakota Kai", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/dakota-kai.png" },
  { name: "Damian Priest", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/damian-priest.png" },
  { name: "Dexter Lumis", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/dexter-lumis-2.jpg" },
  { name: "Doink The Clown", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/doink-the-clown.png" },
  { name: "Dominik Mysterio", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dominik-mysterio-2024.png" },
  { name: "Dragon Lee", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dragon-lee-2023.png" },
  { name: "Drew McIntyre", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/drew-mcintyre.png" },
  { name: "Duke Hudson", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/duke-hudson.png" },
  { name: "Dusty Rhodes", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/d/dusty-rhodes-1992-1.png" },
  { name: "Eddie Guerrero", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/eddie-guerrero-05.png" },
  { name: "Eddy Thorpe", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/e/eddy-thorpe-2023-new.png" },
  { name: "Elektra Lopez", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/elektra-lopez.png" },
  { name: "Elton Prince", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/elton-prince.png" },
  { name: "Eric Bischoff", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/eric-bischoff.png" },
  { name: "Erik", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/e/erik-2024.png" },
  { name: "Erick Rowan", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/erick-rowan-2.jpg" },
  { name: "Ethan Page", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/ethan-page.png" },
  { name: "Eve Torres", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/eve.png" },
  { name: "Faarooq", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/faarooq.png" },
  { name: "Fallon Henley", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/f/fallon-henley-2024-2.png" },
  { name: "Finn Balor", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/f/finn-balor-2021-new.png" },
  { name: "George \"The Animal\" Steele", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/george-steele.png" },
  { name: "Gigi Dolin", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/gigi-dolin.png" },
  { name: "Giovanni Vinci", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/giovanni-vinci.png" },
  { name: "Giulia", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/giulia.jpg" },
  { name: "Grayson Waller", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/g/grayson-waller-2023-new.png" },
  { name: "Gunther", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/gunther.png" },
  { name: "Harley Race", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/harley-race.png" },
  { name: "Headshrinker Fatu", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/fatu.png" },
  { name: "Headshrinker Samu", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/samu.png" },
  { name: "Honky Tonk Man", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/h/honky-tonk-man-2.png" },
  { name: "Hulk Hogan", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/hulk-hogan-80.png" },
  { name: "Hollywood Hogan", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/hollywood-hogan.png" },
  { name: "Ilja Dragunov", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_i_ilja-dragunov-2024.webp" },
  { name: "Indi Hartwell", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/indi-hartwell.png" },
  { name: "Isla Dawn", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/isla-dawn.png" },
  { name: "Islander Haku", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/h/haku-1991.png" },
  { name: "Islander Tama", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tonga-kid-1983.png" },
  { name: "Ivar", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/i/ivar-2024.png" },
  { name: "Ivy Nile", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ivy-nile.png" },
  { name: "Iyo Sky", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/iyo-sky.png" },
  { name: "Jacob Fatu", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jacob-fatu.png" },
  { name: "Jacy Jayne", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jacy-jayne.png" },
  { name: "Jade Cargill", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_j_jade-cargill-2024.webp" },
  { name: "Jaida Parker", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jaida-parker-2023.png" },
  { name: "Jakara Jackson", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jakara-jackson.png" },
  { name: "Jake \"The Snake\" Roberts", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/jake-roberts.png" },
  { name: "JBL", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/jbl.png" },
  { name: "Jalen Brunson", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jalen-brunson.jpg" },
  { name: "JD McDonagh", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jd-mcdonagh-2024.png" },
  { name: "Je'Von Evans", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/j/jevon-evans.png" },
  { name: "Jesse Ventura", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jesse-ventura.jpg" },
  { name: "Jey Uso", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jey-uso.png" },
  { name: "Jim \"The Anvil\" Neidhart", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/jim-neidhart.png" },
  { name: "Jimmy Uso", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jimmy-uso.png" },
  { name: "Joaquin Wilde", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/joaquin-wilde.png" },
  { name: "Joe Coffey", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/joe-coffey.png" },
  { name: "Joe Gacy", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/joe-gacy-2.jpg" },
  { name: "John Cena", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/john-cena-25.png" },
  { name: "Johnny Gargano", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/johnny-gargano.png" },
  { name: "Jordynne Grace", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/jordynne-grace.jpg" },
  { name: "Josh Briggs", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/josh-briggs.png" },
  { name: "Julius Creed", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/julius-creed.png" },
  { name: "Junk Yard Dog", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/junkyard-dog.jpg" },
  { name: "Kairi Sane", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_k_kairi-sane-2023-1.webp" },
  { name: "Kane", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/kane.png" },
  { name: "Karl Anderson", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/karl-anderson.png" },
  { name: "Karrion Kross", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/karrion-kross.png" },
  { name: "Katana Chance", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/katana-chance.png" },
  { name: "Kayden Carter", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/kayden-carter.png" },
  { name: "Kelani Jordan", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/kelani-jordan-3.png" },
  { name: "Ken Shamrock", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ken-shamrock.png" },
  { name: "Kevin Nash", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/kevin-nash.png" },
  { name: "Kevin Owens", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/kevin-owens.png" },
  { name: "Kiana James", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/kiana-james.png" },
  { name: "Kit Wilson", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/kit-wilson.png" },
  { name: "Kofi Kingston", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/k/kofi-kingston-2024.png" },
  { name: "KSI", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/ksi-2.jpg" },
  { name: "Kurt Angle", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/kurt-angle-2.png" },
  { name: "LA Knight", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/la-knight.png" },
  { name: "Lash Legend", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lash-legend-2024.png" },
  { name: "Lex Luger", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lex-luger-2000.png" },
  { name: "Lexis King", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/lexis-king.png" },
  { name: "Lita", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/lita.png" },
  { name: "Liv Morgan", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/liv-morgan.png" },
  { name: "Logan Paul", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/logan-paul.png" },
  { name: "Lola Vice", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/l/lola-vice-2022.png" },
  { name: "Ludwig Kaiser", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/ludwig-kaiser.png" },
  { name: "Luke Gallows", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/luke-gallows.png" },
  { name: "Lyra Valkyria", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/lyra-valkyria.png" },
  { name: "Mark Coffey", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/mark-coffey.png" },
  { name: "Mark Henry", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/mark-henry-2.jpg" },
  { name: "Maryse", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/maryse.png" },
  { name: "Maxxine Dupri", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/maxxine-dupri.png" },
  { name: "Michelle McCool", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/m/michelle-mccool-2009-new.png" },
  { name: "Michin", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_m_mia-yim-2024-1.webp" },
  { name: "Mick Foley", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/mick-foley.png" },
  { name: "Mankind", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/mankind.png" },
  { name: "Dude Love", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/dude-love-2.png" },
  { name: "Cactus Jack", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/cactus-jack.png" },
  { name: "Mighty Molly", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/mighty-molly-3.png" },
  { name: "Molly Holly", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/molly-holly-current.png" },
  { name: "Montez Ford", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/montez-ford.png" },
  { name: "Mr. Perfect", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/c/curt-hennig-2002.png" },
  { name: "Naomi", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/naomi.png" },
  { name: "Natalya", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/natalya.png" },
  { name: "Nathan Frazer", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/nathan-frazer.png" },
  { name: "New Jack", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/new-jack.jpg" },
  { name: "Nia Jax", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/nia-jax.png" },
  { name: "Nikki Cross", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/nikki-cross-2.jpg" },
  { name: "Nikkita Lyons", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/n/nikkita-lyons-2023.png" },
  { name: "Noam Dar", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/noam-dar.png" },
  { name: "Oba Femi", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/o/oba-femi-2023-new.png" },
  { name: "Omos", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/omos.png" },
  { name: "Oro Mensah", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/o/oro-mensah-2023-new.png" },
  { name: "Otis", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/otis.png" },
  { name: "Pat McAfee", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/p/pat-mcafee-2021.png" },
  { name: "Penta", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/penta.jpg" },
  { name: "Pete Dunne", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_p_pete-dunne-2024.webp" },
  { name: "Peter Maivia", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/peter-maivia.png" },
  { name: "Piper Niven", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/piper-niven.png" },
  { name: "R-Truth", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/r-truth.png" },
  { name: "Randy Orton", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/randy-orton.png" },
  { name: "Randy Savage", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/randy-savage.png" },
  { name: "Raquel Rodriguez", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/r/raquel-rodriguez-2024.png" },
  { name: "Rey Mysterio", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/rey-mysterio.png" },
  { name: "Rezar", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_r_rezar-2023.webp" },
  { name: "Rhea Ripley", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/rhea-ripley.png" },
  { name: "Rick Rude", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/rick-rude.png" },
  { name: "Rick Steiner", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/rick-steiner.png" },
  { name: "Ricky \"The Dragon\" Steamboat", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/ricky-steamboat.png" },
  { name: "Ridge Holland", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_r_ridge-holland-2024.webp" },
  { name: "Rikishi", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/rikishi-2.png" },
  { name: "Road Dogg", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/road-dogg.jpg" },
  { name: "Rob Van Dam", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/rob-van-dam.png" },
  { name: "Roddy Piper", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/roddy-piper.png" },
  { name: "Roman Reigns", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/roman-reigns-new.png" },
  { name: "Rosey", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/rosey-3.png" },
  { name: "Roxanne Perez", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_r_roxanne-perez-2024.webp" },
  { name: "Sami Zayn", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/sami-zayn.png" },
  { name: "Santos Escobar", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/santos-escobar.png" },
  { name: "Scarlett", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/scarlett-2024.png" },
  { name: "Scott Hall", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/scott-hall.png" },
  { name: "Seth Rollins", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/seth-rollins.png" },
  { name: "Scott Steiner", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/scott-steiner-2002.png" },
  { name: "Shaquille O'Neall", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/shaquille-oneal.jpg" },
  { name: "Shawn Michaels", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/shawn-michaels.png" },
  { name: "Shawn Spears", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_s_shawn-spears-2024.webp" },
  { name: "Shayna Baszler", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/shayna-baszler.png" },
  { name: "Sheamus", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_s_sheamus-2022__copy.webp" },
  { name: "Shinsuke Nakamura", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/shinsuke-nakamura-2024.png" },
  { name: "Shotzi", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/shotzi-new.png" },
  { name: "Sid Justice", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/sycho-sid.jpg" },
  { name: "Sika", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/sika.png" },
  { name: "Sol Ruca", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/s/sol-ruca-1.png" },
  { name: "Solo Sikoa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/solo-sikoa.png" },
  { name: "Sonya Deville", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/sonya-deville.png" },
  { name: "Stacy Keibler", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/stacy-keibler.png" },
  { name: "Stephanie McMahon", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/stephanie-mcmahon.png" },
  { name: "Stephanie Vaquer", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/stephanie-vaquer.jpg" },
  { name: "Stone Cold Steve Austin", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/steve-austin.png" },
  { name: "Superstar Billy Graham", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/billy-graham.png" },
  { name: "Syxx", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/syxx.png" },
  { name: "Tama Tonga", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tama-tonga-2024.webp" },
  { name: "Tamina", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/tamina.png" },
  { name: "Tatum Paxley", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tatum-paxley-2024.png" },
  { name: "Tegan Nox", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/tegan-nox-new.png" },
  { name: "Terry Funk", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/terry-funk-1998-1.png" },
  { name: "The Great Khali", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/great-khali.jpg" },
  { name: "The Great Muta", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/the-great-muta-1990s.png" },
  { name: "The Hurricane", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/the-hurricane.png" },
  { name: "The Iron Sheik", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/i/iron-sheik-1980s.png" },
  { name: "The Miz", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/the-miz.png" },
  { name: "The Rock", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/the-rock.png" },
  { name: "Thea Hail", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_thea-hail-2024.webp" },
  { name: "Tiffany Stratton", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/tiffany-stratton.png" },
  { name: "Tito Santana", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/tito-santana.jpg" },
  { name: "Tommaso Ciampa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tommaso-ciampa-2024.webp" },
  { name: "Tonga Loa", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wrestling_wrestlers_t_tonga-loa-2024.webp" },
  { name: "Tony D'Angelo", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/tony-dangelo-2024.png" },
  { name: "Trick Williams", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/trick-williams.png" },
  { name: "Triple H", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/t/triple-h-2013.png" },
  { name: "Trish Stratus", tier: "high", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/trish-stratus.png" },
  { name: "Tyler Bate", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/tyler-bate.png" },
  { name: "Tyler Breeze", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/tyler-breeze.png" },
  { name: "Tyrese Haliburton", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/tyrese-haliburton.jpg" },
  { name: "Ultimate Warrior", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/ultimate-warrior.png" },
  { name: "Umaga", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/umaga.png" },
  { name: "Uncle Howdy", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/jch-optimize/ng/images_wwe2k24_roster_uncle-howdy.webp" },
  { name: "Undertaker", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/undertaker.png" },
  { name: "Vader", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/vader.png" },
  { name: "Valhalla", tier: "low", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/valhalla.png" },
  { name: "Victoria", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/victoria.jpg" },
  { name: "Wade Barrett", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/wade-barrett-new.png" },
  { name: "Wendy Choo", tier: "mid", sex: "woman", img: "https://www.thesmackdownhotel.com/images/wwe2k25/roster/wendy-choo.png" },
  { name: "Wes Lee", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/w/wes-lee-2024-new.png" },
  { name: "William Regal", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/william-regal-new.png" },
  { name: "Wolfgang", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/wolfgang.png" },
  { name: "X-Pac", tier: "low", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k23/roster/x-pac.png" },
  { name: "Xavier Woods", tier: "mid", sex: "man", img: "https://www.thesmackdownhotel.com/images/wrestling/wrestlers/x/xavier-woods-2024.png" },
  { name: "Yokozuna", tier: "high", sex: "man", img: "https://www.thesmackdownhotel.com/images/wwe2k24/roster/yokozuna.png" },
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
