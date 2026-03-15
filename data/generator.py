import json
import os
import glob

# Seteaza folderul unde ai fisierele JSON vechi
folder_path = './'
output_file = 'all_time_roster.json'

# Folosim un dictionar pentru a evita duplicatele. Cheia va fi numele.
all_time_roster_dict = {}

# Parcurgem toate fisierele .json
for filepath in glob.glob(os.path.join(folder_path, '*.json')):
    if output_file in filepath:
        continue

    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)

            # Verificam daca JSON-ul are structura ta specifica (cu cheia "roster")
            if isinstance(data, dict) and "roster" in data:
                roster_list = data["roster"]

                for wrestler in roster_list:
                    name = wrestler.get('name')

                    # Daca are nume si nu a fost deja adaugat
                    if name and name not in all_time_roster_dict:
                        # Facem o copie ca sa nu modificam originalul
                        wrestler_clean = wrestler.copy()

                        # --- MODIFICAREA NOUA: Setam tier-ul tuturor la 'mid' ---
                        wrestler_clean['tier'] = "mid"

                        # Aici putem sterge eventuale chei de 'show' sau 'brand' din vechile JSON-uri
                        if 'show' in wrestler_clean:
                            del wrestler_clean['show']
                        if 'brand' in wrestler_clean:
                            del wrestler_clean['brand']

                        all_time_roster_dict[name] = wrestler_clean

            else:
                print(f"Ignor {filepath} - Nu are formatul asteptat (lipseste cheia 'roster').")

        except json.JSONDecodeError:
            print(f"Eroare: Nu am putut citi {filepath}.")

# Construim structura finala pe care o asteapta site-ul tau
final_data = {
    "brands": [
        {"name": "Free Agents", "color": "#808080"},
        {"name": "Legends", "color": "#FFD700"}
    ],
    "roster": list(all_time_roster_dict.values())
}

# Salvam fisierul nou
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=4, ensure_ascii=False)

print(f"Succes! Am combinat fisierele si am setat {len(all_time_roster_dict)} superstaruri unice la tier 'mid'.")
print(f"Fisierul a fost salvat ca {output_file}.")