import csv
from glob import glob
import os
from pathlib import Path


ORIGINAL_CSV_PATH = "../convertor/csv"
FIXED_CSV_PATH = "./csv/*.csv"
OUTPUT_PATH = "./output"
OUTPUT_FOR_DEBUG_PATH = "./output_debug"

fieldnames = ["key_name", "ko_kr"]


def export(data: list[dict[str, str]], filename: str, debug: bool = False) -> None:
    if len(data) == 0:
        print(f"{filename} 변경사항 없음")
        return
    path = Path(OUTPUT_PATH) / filename
    # path = os.path.join(OUTPUT_PATH, filename)
    if debug:
        data = [{"key_name": a["key_name"], "ko_kr": f"[{a["key_name"]}] {a["ko_kr"]}"} for a in data]
        path = Path(OUTPUT_FOR_DEBUG_PATH) / filename
        # path = os.path.join(OUTPUT_FOR_DEBUG_PATH, filename)
    with open(path, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(data)
    if debug:
        print(f"\033[92m{filename}\033[00m 변환 성공(debug)")
    else: 
        print(f"\033[92m{filename}\033[00m 변환 성공")


def main() -> int:
    os.makedirs(Path(OUTPUT_PATH), exist_ok=True)
    os.makedirs(Path(OUTPUT_FOR_DEBUG_PATH), exist_ok=True)

    target_csvs = glob(FIXED_CSV_PATH)

    for target_csv in target_csvs:
        filename = os.path.basename(target_csv)
        # original_csv = os.path.join(ORIGINAL_CSV_PATH, filename)
        original_csv = Path(ORIGINAL_CSV_PATH) / filename

        original = {}
        diff = []

        with open(original_csv, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                original[row["key_name"]] = row

        with open(target_csv, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                key_name = row["key_name"]
                try:
                    if original[key_name]["ko_kr"].strip() != row["ko_kr"].strip():
                        diff.append(
                            {"key_name": row["key_name"], "ko_kr": row["ko_kr"].strip()}
                        )
                except KeyError as error:
                    # "\033[91m [log]\033[00m" + 
                    print(f"\033[91m{filename}\033[00m 오류 ({error} 키가 존재하지 않습니다)")

        export(diff, filename)
        export(diff, filename, debug=True)

    return 0
