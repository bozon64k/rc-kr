from glob import glob
import os
from pathlib import Path

import UnityPy


AB_PATH = "C:\Program Files (x86)\Steam\steamapps\common\Reverse Collapse Code Name Bakery\windows\ReverseCollapse_Data\StreamingAssets\win\*.u3d"
AB_FILE_LIST = ["strings.u3d"]
OUTPUT_PATH = "./output"


def decrypt(data: bytes) -> bytes:
    return bytes([data[i] ^ 0x5C for i in range(len(data))])


def export(data: bytes) -> None:
    env = UnityPy.load(data)
    for obj in env.objects:
        if obj.type.name == "TextAsset":
            # export asset
            data = obj.read()
            # os.makedirs(os.path.join(OUTPUT_PATH, obj.container), exist_ok=True)
            path = os.path.join(OUTPUT_PATH, obj.container)  # f"{data.m_Name}.txt")
            output = Path(path)
            output.parent.mkdir(exist_ok=True, parents=True)
            output.write_bytes(data.m_Script.encode("utf-8", "surrogateescape"))


def main() -> int:
    print("Hello from decompiler!")
    u3d_files = glob(AB_PATH)

    for file_src in u3d_files:
        with open(file_src, "rb") as file:
            decrypted_file = decrypt(file.read())
            export(decrypted_file)

    return 0
