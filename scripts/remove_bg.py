import os
from PIL import Image

def remove_background(input_path, output_path, mode='white'):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
    
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # mode 'white': remove near-white pixels
        if mode == 'white':
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        # mode 'black': remove near-black pixels
        elif mode == 'black':
            if item[0] < 15 and item[1] < 15 and item[2] < 15:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path}")

# Ensure output directory exists
os.makedirs("public/assets/3d", exist_ok=True)

# Process icons
remove_background("public/assets/3d/book.png", "public/assets/3d/book.png", mode='white')
remove_background("public/assets/3d/laptop.png", "public/assets/3d/laptop.png", mode='white')
remove_background("public/assets/3d/cap.png", "public/assets/3d/cap.png", mode='white')
remove_background("public/assets/3d/trophy.png", "public/assets/3d/trophy.png", mode='black')
