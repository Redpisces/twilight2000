#!/usr/bin/env python3.8
lines = {}
with open ("skills.txt","rt") as f:
    lines = f.readlines()
s = "\"skills\":{"
for l in lines:
    x=l.strip().rsplit(",")
#    print("\""+x[0]+"\": {")
#    print("\t\"attribute\": \""+x[1]+"\",")
#    print("\t\"value\": 0,")
#    print("\t},")
#print("}")
    s+="\""+x[0]+"\": {\"attribute\": \""+x[1]+"\",\"value\": 0},";
s=s[:-1]+"}";
print (s);
