# /assets — image placeholders

Drop your grayscale architectural images here using these exact filenames so
the site picks them up automatically (referenced from `index.html`):

| File                   | Project / use                          |
| ---------------------- | -------------------------------------- |
| `project-01.jpg`       | Garden Atria — gallery card            |
| `garden-atria-01.jpg`  | Garden Atria — section, model (tall)   |
| `garden-atria-02.jpg`  | Garden Atria — section, atrium         |
| `project-02.jpg`       | Elevated Plaza                         |
| `project-03.jpg`       | Hydro-Filtration Dam                   |
| `project-04.jpg`       | West Loop Theater                      |
| `project-05.jpg`       | Tunnel to Poble Espanyol               |
| `project-06.jpg`       | Sketches From Abroad                   |

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
- The Garden Atria section uses two independent placeholders
  (`garden-atria-01.jpg` = model, `garden-atria-02.jpg` = atrium) so each
  shot can be swapped for its own real photo. Keep the filenames and
  overwrite in place.
