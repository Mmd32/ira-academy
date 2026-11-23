# Emblem as published before the clean-up

The 3D mark used in the home-page hero, exactly as it ran on the site.

- `emblem.glb` — the model (a photogrammetry scan)
- `emblem.png` — the flat fallback shown when the model cannot load

To go back to it:

    cp archive/emblem-original/emblem.glb archive/emblem-original/emblem.png public/media/

then rebuild and redeploy. The same state is tagged in git as `emblem-original`.
