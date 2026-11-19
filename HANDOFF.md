# Continue here

Space Vision is separate from Drawer Studio. GitHub: https://github.com/lailaassy/space-vision.

Implemented: Grounding DINO runner (not executed), geometry/evaluation utilities, checksum-verified ARMBench sample downloader, COCO split importer. Seven Node tests pass. Five official sample images load; they have no labels. No training or detection accuracy results yet.

Next: set up a working Python environment and run the pretrained detector on the sample. Then obtain labeled ARMBench data and annotate the controlled makeup photos. Keep household photos and datasets out of Git. Read DATASETS.md for sources and EXPERIMENTS.md for evaluation rules.

The GitHub connector could not access lailaassy repositories; browser upload works. Local and browser-created commit histories differ. Reconcile histories before a future push; do not force-push.

Drawer Studio live site is unchanged. Its photo feature is in ../drawer-studio-items on feature/photo-items. Private API key stays in that repository's ignored .env. Never copy it here.
