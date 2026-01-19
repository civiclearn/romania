import os

ROOT = os.path.dirname(os.path.abspath(__file__))

changed_files = []

for root, dirs, files in os.walk(ROOT):
    for name in files:
        if not name.lower().endswith(".html"):
            continue

        path = os.path.join(root, name)

        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = content.replace('href="/index.html"', 'href="/"') \
                             .replace("href='/index.html'", "href='/'")

        if new_content != content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            changed_files.append(path)

print(f"Updated {len(changed_files)} files:")
for f in changed_files:
    print(" -", os.path.relpath(f, ROOT))
