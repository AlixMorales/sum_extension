"""Generate pixel-art PNG icons for the SumBot Chrome extension."""

from PIL import Image, ImageDraw

# Colour palette
GREEN      = (91, 203, 91)
LIGHT_BLUE = (135, 206, 235)
DARK_BROWN = (92, 61, 30)
LIGHT_BROWN= (196, 164, 108)
BG         = (26, 26, 46)

def draw_icon(size: int) -> Image.Image:
    """Draw a simple 8-bit 'S' (for SumBot) icon at the given pixel size."""
    # Work on a tiny 16x16 grid then scale up
    grid = 16
    img = Image.new("RGBA", (grid, grid), BG)
    draw = ImageDraw.Draw(img)

    # Outer border (dark brown)
    draw.rectangle([0, 0, 15, 15], outline=DARK_BROWN)
    draw.rectangle([1, 1, 14, 14], outline=LIGHT_BROWN)

    # Pixel "S" letter – drawn manually on the 16×16 grid
    s_pixels_green = [
        # Top bar
        (5,3),(6,3),(7,3),(8,3),(9,3),(10,3),
        (4,4),(5,4),
        (4,5),(5,5),
        # Middle bar
        (5,6),(6,6),(7,6),(8,6),(9,6),
        (9,7),(10,7),
        (9,8),(10,8),(11,8),
        # Bottom bar
        (10,9),(11,9),
        (5,10),(6,10),(7,10),(8,10),(9,10),(10,10),
    ]

    s_pixels_blue = [
        (11,3),(11,4),  # accent top-right
        (4,9),(4,10),   # accent bottom-left
        (3,4),(3,5),    # left edge accent
        (11,7),         # right edge accent
    ]

    for (x, y) in s_pixels_green:
        img.putpixel((x, y), GREEN)

    for (x, y) in s_pixels_blue:
        img.putpixel((x, y), LIGHT_BLUE)

    # Scale to target size using nearest-neighbour (keeps pixels sharp)
    return img.resize((size, size), Image.NEAREST)

if __name__ == "__main__":
    import os
    out_dir = os.path.join(os.path.dirname(__file__), "icons")
    os.makedirs(out_dir, exist_ok=True)

    for sz in (16, 48, 128):
        icon = draw_icon(sz)
        path = os.path.join(out_dir, f"icon{sz}.png")
        icon.save(path)
        print(f"Created {path}")
