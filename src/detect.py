"""Pretrained baseline. Outputs pixel-coordinate boxes; no size or brand guesses."""
import argparse, json
from PIL import Image, ImageOps
import torch
from transformers import AutoProcessor, AutoModelForZeroShotObjectDetection

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('image')
    parser.add_argument('--labels', default='bottle,jar,tube,brush,comb,lipstick,compact,scissors,pen,hair clip')
    parser.add_argument('--threshold', type=float, default=0.3)
    parser.add_argument('--output', default='detections.json')
    args = parser.parse_args()
    model_id = 'IDEA-Research/grounding-dino-tiny'
    processor = AutoProcessor.from_pretrained(model_id)
    model = AutoModelForZeroShotObjectDetection.from_pretrained(model_id)
    model.eval()
    image = ImageOps.exif_transpose(Image.open(args.image)).convert('RGB')
    labels = [s.strip() for s in args.labels.split(',') if s.strip()]
    inputs = processor(images=image, text='. '.join(labels)+'.', return_tensors='pt')
    with torch.inference_mode():
        output = model(**inputs)
    result = processor.post_process_grounded_object_detection(output, inputs.input_ids, threshold=args.threshold, text_threshold=0.25, target_sizes=[(image.height,image.width)])[0]
    detections = [{'label':label,'score':float(score),'box':[float(v) for v in box]} for box,score,label in zip(result['boxes'],result['scores'],result.get('text_labels',result.get('labels')))]
    with open(args.output,'w') as f:
        json.dump({'schemaVersion':1,'model':model_id,'width':image.width,'height':image.height,'detections':detections,'reviewed':False},f,indent=2)
if __name__ == '__main__':
    main()
