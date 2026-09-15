#!/usr/bin/env python3
"""
Script para descargar imágenes de Unsplash utilizadas en el sitio,
redimensionarlas y convertirlas a formato WebP optimizado en public/Images/
"""

import os
import ssl
import urllib.request
from PIL import Image

ssl._create_default_https_context = ssl._create_unverified_context

IMAGES_TO_DOWNLOAD = [
    {
        "name": "bg-servicios.webp",
        "url": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "max_width": 1920,
        "quality": 82
    },
    {
        "name": "bg-nosotros.webp",
        "url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "max_width": 1920,
        "quality": 82
    },
    {
        "name": "team-nosotros.webp",
        "url": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "max_width": 1200,
        "quality": 82
    },
    {
        "name": "hero-contacto.webp",
        "url": "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        "max_width": 1920,
        "quality": 82
    }
]

def main():
    target_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'Images')
    os.makedirs(target_dir, exist_ok=True)

    for item in IMAGES_TO_DOWNLOAD:
        out_path = os.path.join(target_dir, item["name"])
        temp_raw = out_path + ".tmp"
        
        print(f"Descargando {item['name']} desde Unsplash...")
        try:
            req = urllib.request.Request(
                item["url"], 
                headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
            )
            with urllib.request.urlopen(req) as response, open(temp_raw, 'wb') as out_file:
                out_file.write(response.read())

            # Convertir y optimizar con Pillow
            with Image.open(temp_raw) as img:
                img = img.convert('RGB')
                if img.width > item["max_width"]:
                    ratio = item["max_width"] / float(img.width)
                    new_height = int(float(img.height) * float(ratio))
                    img = img.resize((item["max_width"], new_height), Image.Resampling.LANCZOS)
                
                img.save(out_path, 'WEBP', quality=item["quality"], method=6)
                size_kb = os.path.getsize(out_path) / 1024
                print(f"✓ Guardado: {out_path} ({size_kb:.1f} KB)")

            if os.path.exists(temp_raw):
                os.remove(temp_raw)
        except Exception as e:
            print(f"Error procesando {item['name']}: {e}")
            if os.path.exists(temp_raw):
                os.remove(temp_raw)

if __name__ == '__main__':
    main()
