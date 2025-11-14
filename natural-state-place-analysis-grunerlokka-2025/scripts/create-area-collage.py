#!/usr/bin/env python3
"""
Create a 2x2 collage of the 4 Oslo area images
"""

from PIL import Image
import os

# Paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
areas_dir = os.path.join(base_dir, 'public', 'images', 'areas')

# Input images (in order: top-left, top-right, bottom-left, bottom-right)
images = [
    'grunerlokka.jpg',  # Top-left
    'bjørvika.jpg',     # Top-right
    'sentrum.jpg',      # Bottom-left
    'majorstuen.jpg'    # Bottom-right
]

# Target dimensions for each quadrant (1920x1080 / 2 = 960x540 per image)
target_width = 960
target_height = 540

# Output dimensions (full 16:9 ratio)
output_width = 1920
output_height = 1080

print("Creating 2x2 collage of Oslo areas...")

# Load and resize images
image_objects = []
for img_name in images:
    img_path = os.path.join(areas_dir, img_name)
    print(f"Loading {img_name}...")
    img = Image.open(img_path)

    # Resize to fit quadrant while maintaining aspect ratio (crop to fill)
    img_ratio = img.width / img.height
    target_ratio = target_width / target_height

    if img_ratio > target_ratio:
        # Image is wider, resize by height and crop width
        new_height = target_height
        new_width = int(new_height * img_ratio)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        # Crop to center
        left = (new_width - target_width) // 2
        img = img.crop((left, 0, left + target_width, target_height))
    else:
        # Image is taller, resize by width and crop height
        new_width = target_width
        new_height = int(new_width / img_ratio)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        # Crop to center
        top = (new_height - target_height) // 2
        img = img.crop((0, top, target_width, top + target_height))

    image_objects.append(img)

# Create new image for collage
collage = Image.new('RGB', (output_width, output_height))

# Paste images in 2x2 grid
print("Assembling collage...")
collage.paste(image_objects[0], (0, 0))                          # Top-left: Grünerløkka
collage.paste(image_objects[1], (target_width, 0))               # Top-right: Bjørvika
collage.paste(image_objects[2], (0, target_height))              # Bottom-left: Sentrum
collage.paste(image_objects[3], (target_width, target_height))   # Bottom-right: Majorstuen

# Save collage
output_path = os.path.join(areas_dir, 'sammenligning-collage.jpg')
collage.save(output_path, 'JPEG', quality=90, optimize=True)

print(f"✓ Collage created: {output_path}")
print(f"  Dimensions: {output_width}x{output_height}")
print(f"  Layout:")
print(f"    Top-left: Grünerløkka")
print(f"    Top-right: Bjørvika")
print(f"    Bottom-left: Sentrum")
print(f"    Bottom-right: Majorstuen")
