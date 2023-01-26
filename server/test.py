# This file is used to verify your http server acts as expected
# Run it with `python3 test.py``

import requests
import base64
import requests
from PIL import Image
from io import BytesIO
import base64
import glob

import time
  
def string_to_pil(img_string):
    return Image.open(BytesIO(base64.b64decode(img_string,
         validate=True)))


trial_name = "cyborg-arm"
prompt = 'Give her a cyborg arm' # turn him into a cyborg. 

for input_path in glob.glob("data/input/venus*"):

    name = input_path.split("/")[-1].split(".")[0]

    print("trying for ", name)

    # convert img to base64
    with open(input_path, "rb") as image2string:
        base64_bytes  = base64.b64encode(image2string.read())

    # pass it as string for json
    base64_string = base64_bytes.decode('utf-8')

    model_inputs = {'prompt': prompt,
                    'image': base64_string,
                    'num_inference_steps': 10,
                    'image_guidance_scale': 1.5,
                    'prompt_guidance_scale': 7}

    s = time.time()
    res = requests.post('http://localhost:8000/pix2pix', json = model_inputs, 
    )

    #     files = {'image': img}
    print("responded with: ", res.status_code)

    output = res.json()
    e = time.time()

    print("completed in: ", round(e-s, 2))
    if 'modelOutputs' in output.keys():
        img = string_to_pil(output['modelOutputs'][0]['image-0'])
        img.save(f"data/output/{name}-{trial_name}.jpeg")
    else:
        print(output)
