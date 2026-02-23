import os
import json
import difflib
import re


def clean_name(filename):
    # Scoatem extensia (.png, .jpg)
    name = os.path.splitext(filename)[0]
    # Totul cu litere mici
    name = name.lower()
    # Înlocuim cratimele și underscore-urile cu spații
    name = name.replace("_", " ").replace("-", " ")
    # Scoatem cuvinte inutile des întâlnite în pack-urile de poze (poți adăuga și altele aici)
    name = re.sub(r'(render|2k\d{2}|wwe|official|transparent)', '', name).strip()
    # Ștergem spațiile duble
    name = re.sub(r'\s+', ' ', name)
    return name


def fix_image_names_smart(json_path, images_folder):
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Eroare la citirea JSON-ului: {e}")
        return

    roster_list = data.get('roster', [])
    official_files = [os.path.basename(p['img']) for p in roster_list if 'img' in p]

    if not os.path.exists(images_folder):
        print(f"Folderul {images_folder} nu există.")
        return

    existing_files = [f for f in os.listdir(images_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

    # Creăm un dicționar cu fișierele vechi curățate
    # Ex: {"AJ_Styles_Render.png": "aj styles"}
    old_files_dict = {f: clean_name(f) for f in existing_files}

    renamed_count = 0
    missing = []

    print(f"Începem potrivirea inteligentă pentru {len(official_files)} superstari...\n")

    for official in official_files:
        if official in existing_files:
            continue  # E deja corect

        clean_official = clean_name(official)  # ex: "cody rhodes"
        best_match = None

        # 1. Metoda sigură: Verificăm dacă numele din JSON se ascunde în numele fișierului tău
        for orig_old, clean_old in old_files_dict.items():
            if clean_official == clean_old or clean_official in clean_old:
                best_match = orig_old
                break

        # 2. Fallback: Fuzzy matching, dar pe numele curățate și cu strictețe mare (80%)
        if not best_match:
            clean_old_list = list(old_files_dict.values())
            matches = difflib.get_close_matches(clean_official, clean_old_list, n=1, cutoff=0.8)
            if matches:
                matched_clean = matches[0]
                # Căutăm fișierul original corespunzător acestui nume curățat
                for orig_old, clean_old in old_files_dict.items():
                    if clean_old == matched_clean:
                        best_match = orig_old
                        break

        # Dacă am găsit un câștigător clar, redenumim
        if best_match:
            old_path = os.path.join(images_folder, best_match)
            new_path = os.path.join(images_folder, official)

            try:
                os.rename(old_path, new_path)
                print(f"[ OK ] {best_match} ---> {official}")
                renamed_count += 1
                # Îl ștergem din dicționar ca să nu-l mai folosim la altul
                del old_files_dict[best_match]
                existing_files.remove(best_match)
            except Exception as e:
                print(f"[ ERROARE ] Nu am putut redenumi {best_match}: {e}")
        else:
            missing.append(official)

    print(f"\n✅ Am corectat {renamed_count} poze.")
    if missing:
        print(
            f"❌ Nu am găsit nicio potrivire sigură pentru următoarele {len(missing)} poze (probabil lipsesc din folder):")
        for m in missing:
            print(f"  - {m}")


# Dă-i drumul
if __name__ == "__main__":
    fix_image_names_smart("data/wwe2k25.json", "images")