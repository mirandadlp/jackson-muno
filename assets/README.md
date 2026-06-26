# /assets — image placeholders

Drop your grayscale architectural images here using these exact filenames so
the site picks them up automatically (referenced from `index.html`):

| File                   | Project / use                          |
| ---------------------- | -------------------------------------- |
| `project-01.jpg`                 | Garden Atria — gallery card                |
| `garden-atria-02.jpg`            | Garden Atria — section, model (tall)       |
| `garden-atria-03.jpg`            | Garden Atria — section, atrium             |
| `project-02.jpg`                 | Elevated Plaza — gallery card + slot 1      |
| `elevated-plaza-02.jpg`          | Elevated Plaza — slot 2                     |
| `elevated-plaza-03.jpg`          | Elevated Plaza — slot 3                     |
| `project-03.jpg`                 | Hydro-Filtration Dam — gallery card + slot 1|
| `hydro-filtration-dam-02.jpg`    | Hydro-Filtration Dam — slot 2              |
| `hydro-filtration-dam-03.jpg`    | Hydro-Filtration Dam — slot 3              |
| `project-04.jpg`                 | West Loop Theater — gallery card + slot 1   |
| `west-loop-theater-02.jpg`       | West Loop Theater — slot 2                 |
| `west-loop-theater-03.jpg`       | West Loop Theater — slot 3                 |
| `project-05.jpg`                 | Tunnel to Poble Espanyol — card + slot 1    |
| `tunnel-poble-espanyol-02.jpg`   | Tunnel to Poble Espanyol — slot 2          |
| `tunnel-poble-espanyol-03.jpg`   | Tunnel to Poble Espanyol — slot 3          |
| `project-06.jpg`                 | Sketches From Abroad — card + sketch 1      |
| `sketches-from-abroad-02.jpg`    | Sketches From Abroad — sketch 2            |
| `sketches-from-abroad-03.jpg`    | Sketches From Abroad — sketch 3            |
| `sketches-from-abroad-04.jpg`    | Sketches From Abroad — sketch 4            |

The six `project-0X.jpg` files currently here are **generated placeholders**
(grayscale architectural mock-ups). Regenerate them anytime with
`python3 make_placeholders.py` from the repo root, or just overwrite them with
real photography using the same filenames.

Notes
- Images are automatically rendered in black & white via a CSS `grayscale`
  filter, so colour originals are fine.
- Recommended aspect ratios: gallery cards use 3:4 (portrait); project grids
  mix 3:4 and 4:3. Supply images at least ~1200px on the long edge.
- Want different images per shot inside a project section? Edit the `src`
  attributes in `index.html` (each is marked with an `EDIT IMAGE` comment).
- Every project section now has independent image slots so each shot can
  be swapped for its own real photo:
  - Slot 1 of each section shares its `project-0X.jpg` file with that
    project's gallery card (overwrite it to update both).
  - Slots 2/3 (and sketches 2–4) each have their own slug-named file
    (`<project>-02.jpg`, `<project>-03.jpg`, …). Keep the filenames and
    overwrite in place to drop in real photos.
  - Garden Atria already holds real photography (`garden-atria-02/03.jpg`).
