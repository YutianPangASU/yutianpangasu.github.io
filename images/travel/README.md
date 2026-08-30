# Travel photos for /footprint/

One subfolder per park. A folder for every US national park already exists
here (named with the park slug, e.g. `big-bend`, `grand-canyon`); create new
folders for state parks as you visit them (lowercase, hyphenated, e.g.
`enchanted-rock`).

To show a park on the page:

1. Drop photos into its folder (jpg, jpeg, png, webp, or gif). Resize to
   roughly 1600px on the long edge first so the repo and page stay light.
   Photos sort by filename, so prefix numbers to control the order
   (`01-rim.jpg`, `02-sunset.jpg`).
2. Add the park to `_data/travel.yml` with a `slug` matching the folder
   name. Only parks listed there appear on the page; empty folders are
   ignored.

The `.gitkeep` files only keep the empty folders in git; delete one when
its folder gets real photos, or leave it, either is fine.
