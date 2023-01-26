# This file is used to verify your http server acts as expected
# Run it with `python3 test.py``
import os
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


prompt = "turn him into a cyborg"
num_inference_steps=20
image_guidance_scale=1.5
prompt_guidance_scale=10
num_images_per_prompt= 1

trial_name = f"cyborg-new-{num_inference_steps}-{image_guidance_scale}-{prompt_guidance_scale}"

save_folder = f"data/output/{trial_name}"
os.mkdir(save_folder)

for input_path in glob.glob("data/input/*512*"):

    name = input_path.split("/")[-1].split(".")[0]

    print("trying for ", name)

    # convert img to base64
    with open(input_path, "rb") as image2string:
        base64_bytes  = base64.b64encode(image2string.read())

    # pass it as string for json
    base64_string = base64_bytes.decode('utf-8')

    model_inputs = {'prompt': prompt,
                    'image': base64_string,
                    'num_inference_steps': num_inference_steps,
                    'image_guidance_scale': image_guidance_scale,
                    'prompt_guidance_scale': prompt_guidance_scale,
                    'num_images_per_prompt': num_images_per_prompt
                    }

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
        img.save(f"{save_folder}/{name}.jpeg")
    else:
        print(output)
