import cloudscraper
from bs4 import BeautifulSoup
import json


def scrape_gamerant_roster():
    url = "https://wrestletalk.com/stats/wwe-2k23-confirmed-roster/"

    # Folosim cloudscraper pentru a simula un browser
    scraper = cloudscraper.create_scraper()
    print(f"Accesăm: {url}...")

    try:
        response = scraper.get(url)
        if response.status_code != 200:
            print(f"Eroare la accesarea site-ului: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        roster_list = []

        # Pe GameRant, roster-ul este de regulă într-un tabel (tag <table>)
        table = soup.find('table')
        if not table:
            print("Nu am găsit tabelul cu roster-ul. Verifică dacă pagina s-a încărcat corect.")
            return

        # Extragem rândurile, sărind peste header (primul rând)
        rows = table.find_all('tr')[1:]

        for row in rows:
            cols = row.find_all('td')
            if len(cols) >= 2:
                # 1. Extragere Nume
                name = cols[0].get_text(strip=True)

                # 2. Extragere Rating (Overall)
                try:
                    overall_text = cols[1].get_text(strip=True)
                    overall = int(overall_text)
                except ValueError:
                    overall = 0  # Valoare default dacă nu există rating încă

                # 3. Calcul Tier (bazat pe logica ta)
                # low <= 80, mid 81-85, high >= 86
                if overall <= 80:
                    tier = "low"
                elif 81 <= overall <= 85:
                    tier = "mid"
                else:
                    tier = "high"

                # 4. Generare cale imagine (nume-superstar.png)
                # Transformăm numele în format de fișier (mic, fără spații/caractere speciale)
                img_name = name.lower().replace(" ", "-").replace("'", "").replace('"', "")
                img_path = f"images/{img_name}.png"

                # 5. Adăugare sex (presupunem 'man' implicit, GameRant nu separă mereu tabelele)
                # Putem face o verificare simplă sau lăsa 'man' pentru editare manuală
                sex = "man"

                roster_list.append({
                    "name": name,
                    "tier": tier,
                    "sex": sex,
                    "img": img_path
                })

        # Salvare în fișier JSON
        if roster_list:
            with open('data/wwe2k23.json', 'w', encoding='utf-8') as f:
                json.dump(roster_list, f, indent=2, ensure_ascii=False)
            print(f"Succes! Am extras {len(roster_list)} superstari în 'wwe2k23.json'.")
        else:
            print("Tabelul a fost găsit, dar nu s-au putut extrage date.")

    except Exception as e:
        print(f"A apărut o eroare: {e}")


if __name__ == "__main__":
    scrape_gamerant_roster()