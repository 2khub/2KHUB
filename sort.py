import json


def sort_roster_alphabetically(json_path):
    # 1. Citim fișierul JSON actual
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Eroare la citirea JSON-ului: {e}")
        return

    # 2. Verificăm dacă există lista 'roster'
    if 'roster' in data:
        print(f"Am găsit {len(data['roster'])} wrestleri. Începem sortarea...")

        # Sortăm lista de dicționare alfabetic după valoarea cheii 'name'
        # .lower() ne asigură că "AJ Styles" și "aj styles" sunt tratate la fel (fără probleme cu majusculele)
        data['roster'] = sorted(data['roster'], key=lambda x: x['name'].lower())

        # 3. Salvăm datele sortate înapoi în același fișier (sau într-unul nou)
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print("✅ Succes! Roster-ul a fost sortat alfabetic și salvat.")
    else:
        print("❌ Eroare: Nu am găsit secțiunea 'roster' în fișier.")


# Rulăm scriptul pentru fișierul tău
if __name__ == "__main__":
    sort_roster_alphabetically("data/wwe2k24.json")