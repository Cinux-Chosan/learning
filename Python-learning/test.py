import requests

r = requests.get('http://chosan.cn')

print(r.text)

print(r.history)