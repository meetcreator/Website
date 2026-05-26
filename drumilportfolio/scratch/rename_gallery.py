import os

path = r'c:\Users\Drumil\Documents\GitHub\Website\olympiad\public\gallery'
files = os.listdir(path)

for f in files:
    if f != f.lower():
        old = os.path.join(path, f)
        temp = os.path.join(path, f + ".tmp")
        new = os.path.join(path, f.lower())
        
        # Rename to temp first to bypass case-insensitivity collision
        os.rename(old, temp)
        # Rename to lowercase
        if os.path.exists(new):
            print(f"ACTUAL Collision: {f} and {f.lower()} already exist? Deleting old.")
            os.remove(temp)
        else:
            os.rename(temp, new)
            print(f"Renamed: {f} -> {f.lower()}")
