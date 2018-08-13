from sanic import Sanic
from sanic.response import json,text
from sanic.exceptions import NotFound

app = Sanic()

@app.route("/")
async def test(request):
    return json({"hello": "world"})

@app.route("/intro/<num:int>")
async def number(request,num):
    return json({"number":num})

@app.post("/json")
def post_json(request):
    return json({ "received": True, "message": request.json })

@app.exception(NotFound)
def ignore_404s(request, exception):
    return text("Sorry Man, doesn't work")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
