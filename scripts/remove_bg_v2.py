import os
import shutil
from PIL import Image

def remove_background(input_path, output_path, mode='white', threshold=20):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
    
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        r, g, b, a = item
        if mode == 'white':
            # If all channels are above (255 - threshold), make transparent
            if r > (255 - threshold) and g > (255 - threshold) and b > (255 - threshold):
                new_data.append((r, g, b, 0))
            else:
                new_data.append(item)
        elif mode == 'black':
            # If all channels are below threshold, make transparent
            if r < threshold and g < threshold and b < threshold:
                new_data.append((r, g, b, 0))
            else:
                new_data.append(item)
    
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path} (mode: {mode}, threshold: {threshold})")

# Ensure assets dir exists
os.makedirs("public/assets/3d", exist_ok=True)

# Copy fresh from temp
shutil.copy("public/3d_temp/book.png", "public/assets/3d/book.png")
shutil.copy("public/3d_temp/laptop.png", "public/assets/3d/laptop.png")
shutil.copy("public/3d_temp/cap.png", "public/assets/3d/cap.png")

# Process
remove_background("public/assets/3d/book.png", "public/assets/3d/book.png", mode='white', threshold=30)
remove_background("public/assets/3d/laptop.png", "public/assets/3d/laptop.png", mode='white', threshold=30)
remove_background("public/assets/3d/cap.png", "public/assets/3d/cap.png", mode='white', threshold=30)
remove_background("public/assets/3d/trophy.png", "public/assets/3d/trophy.png", mode='black', threshold=40)
