import base64
import sys
import os

def reconstruct(input_file, output_path):
    try:
        with open(input_file, 'r') as f:
            b64_data = f.read().strip()
        
        # Remove data URL prefix if present
        if b64_data.startswith('data:image/png;base64,'):
            b64_data = b64_data.replace('data:image/png;base64,', '')
        
        img_data = base64.b64decode(b64_data)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'wb') as f:
            f.write(img_data)
        print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python reconstruct_single.py <input_b64_file> <output_png_path>")
        sys.exit(1)
    reconstruct(sys.argv[1], sys.argv[2])
