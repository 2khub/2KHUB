import cloudscraper
from bs4 import BeautifulSoup
import json
import re


def scrape_wrestletalk_universal():
    url = "https://wrestletalk.com/stats/wwe-2k23-confirmed-roster/"

    scraper = cloudscraper.create_scraper(
        browser={'browser': 'chrome', 'platform': 'windows', 'desktop': True}
    )
    print(f"Accesăm {url}...")

    try:
        response = scraper.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Luăm direct corpul paginii (body), ignorăm div-urile specifice
        body = soup.find('body')
        if not body:
            print("Eroare: Nu pot citi pagina (posibil blocaj Cloudflare sever).")
            return

        lines = body.get_text(separator='\n').split('\n')

        roster_list = []
        seen_names = set()

        print("Analizăm textul brut al paginii...")

        for line in lines:
            line = line.strip()
            # Ignorăm liniile goale sau cele extrem de lungi (paragrafe de articole)
            if not line or len(line) > 40:
                continue

            # Regex inteligent: Caută un text (nume), urmat eventual de cratimă/două puncte/spațiu, urmat de 2 sau 3 cifre
            match = re.search(r'^([A-Za-z0-9\s\.\'\-]+?)(?:\s*[-:–]\s*|\s+)(\d{2,3})$', line)

            if match:
                name = match.group(1).strip()
                overall = int(match.group(2))

                # Filtrăm logic: ratingurile WWE sunt între 60 și 100
                if 60 <= overall <= 100:
                    # Filtru suplimentar de siguranță pentru "gunoaie"
                    if any(bad_word in name.lower() for bad_word in
                           ['overall', 'rating', 'wwe', 'dlc', 'roster', 'top']):
                        continue

                    # Dacă numele e prea scurt, probabil e o eroare
                    if len(name) < 3:
                        continue

                    if name in seen_names:
                        continue

                    seen_names.add(name)

                    if overall <= 80:
                        tier = "low"
                    elif 81 <= overall <= 85:
                        tier = "mid"
                    else:
                        tier = "high"

                    clean_name = name.lower().replace(" ", "-").replace("'", "").replace(".", "").replace('"', "")

                    roster_list.append({
                        "name": name,
                        "tier": tier,
                        "sex": "man",
                        "img": f"images/{clean_name}.png"
                    })

        if roster_list:
            roster_list = sorted(roster_list, key=lambda x: x['name'].lower())
            with open('wwe2k23_roster.json', 'w', encoding='utf-8') as f:
                json.dump(roster_list, f, indent=2, ensure_ascii=False)
            print(f"✅ Gata! Am extras curat și am sortat {len(roster_list)} superstari.")
        else:
            print(
                "❌ Nu am găsit nicio potrivire. Verifică manual pagina în browser, e posibil să nu aibă date sub această formă pe ea.")

    except Exception as e:
        print(f"A apărut o eroare: {e}")


if __name__ == "__main__":
    scrape_wrestletalk_universal()