#!/usr/bin/env python3.8
lines = {}
with open ("skills.txt","rt") as f:
    lines = f.readlines()

for l in lines:
    x=l.strip().rsplit(",")
    print("\""+x[0]+"\": {")
    print("\t\"print\": \""+x[0].replace('_',' ').title()+"\",")
    print("\t\"ability\": \""+x[1]+"\",")
    print("\t\"value\": 0,")
    print("\t\"trained\": 0")
    print("\t},")
print("}")
