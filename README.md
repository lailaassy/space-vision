# Space Vision

I started this while building Drawer Studio. I wanted to take a picture of my things and move them into a drawer layout, instead of adding every item by hand. The first version kept missing things in crowded photos, so I decided to make the image recognition its own project.

The idea is simple: take a photo of a drawer or a messy surface, find the individual items, and let someone check the list before organizing them. Getting that to work with stacked cutlery, tiny makeup products, and things covering each other is the part I'm working on now.

## Where it is right now

This is an early project. There is a Grounding DINO detection script, utilities for checking boxes and measuring detection results, and a ruler-based size estimate. The detector has not been run here yet, and I haven't trained a model or measured its accuracy.

I've also started testing the data setup with ARMBench's five-image sample. It has crowded containers of products, which makes it useful for checking that the image workflow works. Those five images don't include labels, so they aren't an accuracy benchmark. The full dataset does have annotations.

## What I'm trying next

- Start with an existing detector and see what it misses.
- Compare crowded public datasets with photos of actual drawers and makeup.
- Add object masks so the items have cleaner cutouts.
- Use corrected labels to fine-tune a model, then compare it with the original.
- Bring the reviewed items back into Drawer Studio.

For sizing, I'm starting with a ruler placed flat beside the items in an overhead photo. That can give an approximate footprint, but it won't tell me an item's height or reveal anything completely hidden.

## Try the current pieces

With Node 22 or newer:

```sh
npm test
npm run data:sample
```

The sample command downloads about 1.6 MB from Amazon's official Hugging Face dataset and creates a local image manifest. Photos and downloaded data stay out of Git.

For the pretrained detector, use Python 3.10 or newer:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python src/detect.py path/to/photo.jpg --output detections.json
```

The first run downloads the model. The Python environment still needs an end-to-end check; the Node tests cover the data and geometry utilities.

See [datasets](DATASETS.md) for sources, labels, and how to import an annotated split. [Experiment notes](EXPERIMENTS.md) explain how I'll compare results without putting near-identical photos on both sides of a test.

Built alongside [Drawer Studio](https://github.com/lailaassy/drawer-studio).
