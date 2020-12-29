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
    s+="\n\t\""+key+"\":{"
    s+="\n\t\t\"value\":0,"
    s+="\n\t\t\"skills\":{"
    for v in value:
        s+="\n\t\t\t\""+v+"\":null,"
    s=s[:-1]+"\n\t\t},\"skill_groups\"=null"
    s+="\n\t},"
s=s[:-1]
s=''.join(s.split())#uncomment for minify
print (s)
