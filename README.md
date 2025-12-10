# framing-invoice-digitizer
Mid Automation Developer technical project \
by Erin Nie

## Setup:
### N8N
- import n8n OCR workflow.json to n8n 
##### Webhook Node:
- under options, (CORS) is set to * to allow traffic from all ips
- set the IP whitelist to the IP of the machine running the app for security
##### HTTP Request to OCR.space Node:
- should come preconfigured with an API key
##### Mistral Cloud Chat Model Node:
- may need API key 

### Client
- in line 26 change to url for newly imported n8n workflow
- start terminal and navigate to client root folder
- run the following commands
- `npm i`
- `npm run dev`
### Server
- start terminal and navigate to client root folder
- run the following commands
- `npm i`
- `npm run dev`

## Running the App:
- in a browser, open the locally hosted client (in my case it's http://localhost:5173/)
- make sure the n8n workflow is running 
- type an image URL into the image URL input, then click the Send button
    - make sure the image URL contains an image in the jpg or png format
- once there are one or more receipts saved in the backend, click the Download Report button to download a csv 

### Sample Receipt Urls
home depot receipts 
- https://i.pinimg.com/736x/c3/28/c8/c328c85c7676d65e30883a83578e7962.jpg 
- https://i.redd.it/g7nlrooxxwk41.jpg

costco receipts
- https://thewellplannedkitchen.com/wp-content/uploads/2016/05/Costco-Receipt-600x800.jpg
- https://preview.redd.it/why-is-tobacco-listed-on-top-of-my-receipt-v0-3dhna2akuuvc1.jpeg?auto=webp&s=f6143a72c8fcf439a3b7b18cf89811e699a173d1
