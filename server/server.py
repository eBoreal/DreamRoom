import os
import banana_dev as banana
from dotenv import load_dotenv
from sanic import Sanic, response

# Env variables
load_dotenv()
api_key = os.getenv('BANANA_API_KEY')
model_key = os.getenv('BANANA_MODEL_KEY')


# Create the http server app
server = Sanic("DreamRoom")

# Healthchecks verify that the environment is correct on Banana Serverless
@server.route('/healthcheck', methods=["GET"])
def healthcheck(request):
    return response.json({"state": "healthy"}, status=200)

# Forward posto serverless-pix2pix inference endpoint
# Add middleware to check auth & credit
@server.route('/pix2pix', methods=["POST"]) 
def forward_to_inference(request):
    try:
        try:
            model_inputs = response.json.loads(request.json)
        except:
            model_inputs = request.json

        out = banana.run(api_key, model_key, model_inputs)
        return response.json(out, status=200)
    
    except Exception as e:
        response.json({'message': e}, status=500)


if __name__ == '__main__':
    server.run(host='0.0.0.0', port=8000, workers=1)