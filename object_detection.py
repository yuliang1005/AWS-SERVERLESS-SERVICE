import base64
import json
import boto3 as boto3
import numpy as np
import os
import uuid
import time
import cv2
from functools import lru_cache

# construct the argument parse and parse the arguments
confthres = 0.3
nmsthres = 0.1
yolo_path = "yolo_tiny_configs"
s3 = boto3.client('s3')

def download_from_s3(bucket_name, object_key, local_path):

    s3.download_file(bucket_name, object_key, local_path)


def get_labels(labels_path):
    local_path = "/tmp/" + labels_path
    download_from_s3('5225ass2', 'yolo_tiny_configs/yolo_tiny_configs/' + labels_path, local_path)
    LABELS = open(local_path).read().strip().split("\n")
    return LABELS


@lru_cache(maxsize=1)
def get_model():
    nets = load_model(CFG, Weights)
    return nets


def get_weights(weights_path):
    local_path = "/tmp/" + weights_path
    download_from_s3('5225ass2', 'yolo_tiny_configs/yolo_tiny_configs/' + weights_path, local_path)
    return local_path


def get_config(config_path):
    local_path = "/tmp/" + config_path
    download_from_s3('5225ass2', 'yolo_tiny_configs/yolo_tiny_configs/' + config_path, local_path)
    return local_path


def load_model(configpath, weightspath):
    net = cv2.dnn.readNetFromDarknet(configpath, weightspath)
    return net


def do_prediction(image, net, LABELS):
    (H, W) = image.shape[:2]
    # determine only the *output* layer names that we need from YOLO
    ln = net.getLayerNames()
    ln = [ln[i - 1] for i in net.getUnconnectedOutLayers()]

    # construct a blob from the input image and then perform a forward
    # pass of the YOLO object detector, giving us our bounding boxes and
    # associated probabilities
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),
                                 swapRB=True, crop=False)
    net.setInput(blob)
    start = time.time()
    layerOutputs = net.forward(ln)
    # print(layerOutputs)
    end = time.time()

    # show timing information on YOLO
    # print("[INFO] YOLO took {:.6f} seconds".format(end - start))

    # initialize our lists of detected bounding boxes, confidences, and
    # class IDs, respectively
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:
        # loop over each of the detections
        for detection in output:
            # extract the class ID and confidence (i.e., probability) of
            # the current object detection
            scores = detection[5:]
            # print(scores)
            classID = np.argmax(scores)
            # print(classID)
            confidence = scores[classID]

            # filter out weak predictions by ensuring the detected
            # probability is greater than the minimum probability
            if confidence > confthres:
                # scale the bounding box coordinates back relative to the
                # size of the image, keeping in mind that YOLO actually
                # returns the center (x, y)-coordinates of the bounding
                # box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")

                # use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))

                # update our list of bounding box coordinates, confidences,
                # and class IDs
                boxes.append([x, y, int(width), int(height)])

                confidences.append(float(confidence))
                classIDs.append(classID)

    # apply non-maxima suppression to suppress weak, overlapping bounding boxes
    idxs = cv2.dnn.NMSBoxes(boxes, confidences, confthres,
                            nmsthres)

    # TODO Prepare the output as required to the assignment specification
    # ensure at least one detection exists
    if len(idxs) > 0:
        # loop over the indexes we are keeping
        for i in idxs.flatten():
            print("detected item:{}, accuracy:{}, X:{}, Y:{}, width:{}, height:{}".format(LABELS[classIDs[i]],
                                                                                          confidences[i],
                                                                                          boxes[i][0],
                                                                                          boxes[i][1],
                                                                                          boxes[i][2],
                                                                                          boxes[i][3]))

    detected_objects = []

    if len(idxs) > 0:
        for i in idxs.flatten():
            obj_data = {
                "label": LABELS[classIDs[i]],
                "accuracy": confidences[i],
                "rectangle": {
                    "height": boxes[i][3],
                    "left": boxes[i][0],
                    "top": boxes[i][1],
                    "width": boxes[i][2],
                },
            }
            detected_objects.append(obj_data)

    return detected_objects


labelsPath = "coco.names"
cfgpath = "yolov3-tiny.cfg"
wpath = "yolov3-tiny.weights"

Lables = get_labels(labelsPath)
CFG = get_config(cfgpath)
Weights = get_weights(wpath)
nets = get_model()


def lambda_handler(event, context):
    # Parsing the request body
    # body = json.loads(event['body'])
    body = event['body']
    # Parse image data and filename
    image_data = body['image']
    filename = body['filename']
    flag = body['flag']


    # The image data is base64 encoded, so we need to decode it
    image_base64_decoded = base64.b64decode(image_data)

    # generate a unique filename
    unique_filename = str(uuid.uuid4()) + '_' + filename

    # Upload image to S3
    if flag == "N":
        # s3.delete_object(Bucket='5225ass2', Key='image/' + unique_filename)
        object_url = "NOT SAVED"
    else:
        s3.put_object(Body=image_base64_decoded, Bucket='5225ass2', Key='image/' + unique_filename, ACL='public-read')
    
        # Create S3 URLs
        s3_url = f"s3://5225ass2/image/{unique_filename}"
        object_url = f"https://5225ass2.s3.amazonaws.com/image/{unique_filename}"


    image = np.frombuffer(image_base64_decoded, dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    # Get the model from the cache instead of reloading it every time
    nets = get_model()

    detected_objects = do_prediction(image, nets, Lables)
    labels = [obj['label'] for obj in detected_objects]
    



    # Returns the S3 URL and detected objects
    return {
        'statusCode': 200,
        'body': json.dumps({
            'object_url': object_url,
            'labels': labels
        })
    }
