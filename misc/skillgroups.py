#!/usr/bin/env python3.8
lines = []
import json
with open ("skills.txt","rt") as f:
    lines = f.readlines()
groups={}
for l in lines:
    x=l.strip().rsplit(",")
    if x[1] not in groups:
        groups[x[1]]=[]
    groups[x[1]].append(x[0])
s="\"attributes\":{"
for key,value in groups.items():
    s+="\""+key+"\":{"
    s+="\"value\":0,"
    s+="\"skills\":{"
    for v in value:
        s+="\""+v+"\":{"
        s+="\"name\":\""+v.replace("_"," ").title()+"\","
        s+="\"value\":null"
        s+="},"
    s=s[:-1]+"}"
    s+="},"
s=s[:-1]+"},"

print (s)
