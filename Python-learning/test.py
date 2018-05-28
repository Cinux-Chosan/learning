#!/usr/bin/env python 
#coding:utf-8

import requests

r = requests.get("https://chosan.cn:3000/api/posts")

print(r.text)