# How I'll know it's improving

I want to measure whether the model finds the items that are actually visible, especially the small ones. A plausible-looking list isn't enough.

1. Run the pretrained detector first and save the model name, labels, thresholds, image IDs, and elapsed time.
2. Review boxes by hand. Keep separate counts for misses, duplicate detections, and wrong categories.
3. Evaluate public datasets within their published splits and subsets. Keep repeated views of my own drawers together. Never tune on the final test set.
4. Compare full-image detection with overlapping crops. Match predictions back to the original image before counting duplicates.
5. Add segmentation and then fine-tuning only when the baseline and reviewed labels are ready.

Report precision and recall at a stated box IoU threshold, plus missed items and duplicates per image. If a dataset only labels generic object instances, evaluate localization separately from category recognition. Masks need mask-based evaluation; the current box evaluator is not a mask AP implementation.

For measurements, compare ruler-based footprints with actual measured sizes and report error in centimetres. Leave height unknown unless it's measured. Large perspective changes, raised objects, and a ruler held above the surface make simple scaling unreliable.

No model results yet. The first download is only a data-loading check, not evidence of recognition accuracy.
