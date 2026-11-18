# Data I'm starting with

I need photos where the objects overlap, not just isolated product shots. These are the closest useful datasets I've found so far. None replaces testing on actual drawers.

| Dataset | Why it fits | What to watch for |
| --- | --- | --- |
| [ARMBench](https://www.armbench.com/segmentation.html) | Crowded containers, repeated products, and instance masks. Mix-Object-Tote has 44,253 images. | Warehouse products look different from loose makeup and utensils. Keep the published subsets and splits separate. |
| [OCID](https://www.acin.tuwien.ac.at/en/vision-for-robotics/software-tools/object-clutter-indoor-dataset/) | Indoor clutter with RGB, depth, and object masks. | Related frames need to stay together. Confirm the dataset's usage terms before importing it. |
| [OSD](https://www.acin.tuwien.ac.at/vision-for-robotics/software-tools/osd/) | A smaller collection with stacked and occluded objects. | 111 entries; useful as an additional check, not a large training set. Usage terms still need checking. |
| [GraspNet](https://graspnet.net/) | 97,280 RGB-D images across 190 cluttered scenes. | Large downloads and a robotics focus. Its [download page](https://graspnet.net/datasets) specifies noncommercial terms; resolve the exact license before use. |

## First download: ARMBench

```sh
npm run data:sample
```

This fetches the official tiny archive, verifies its SHA-256, extracts five JPEGs, and writes `data/armbench/manifest.json`. It is a workflow sample with no ground-truth labels. Do not use its predictions as training labels without human review.

The full annotated release is available from [Amazon's dataset repository](https://huggingface.co/datasets/amazon/armbench-segmentation). It is about 18.5 GiB, so the sample command does not download it. Amazon provides COCO-format splits and per-image annotations. After downloading and extracting it, import one published split:

```sh
node src/import-coco.js path/to/train.json data/armbench/train.json train
```

The importer retains category IDs, bounding boxes, masks, crowd flags, and the supplied split. It does not invent category names or physical sizes. Paths in the manifest are relative to the dataset image directory. Import validation and test files separately; don't randomly repartition the release.

ARMBench is by Amazon.com, Inc., licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit: Mitash et al., *ARMBench: An object-centric benchmark dataset for robotic manipulation* (2023), [paper](https://arxiv.org/abs/2303.16382). Downloaded media is unchanged; the manifest and converted annotation structure are additions by this project.

## My photos and reference images

The household photos stay local. Related shots of the same items belong to the same scene group. The three web reference images show the kind of clutter I want to handle, but their original sources and reuse terms aren't known yet, so they aren't included in the training data or repository.
