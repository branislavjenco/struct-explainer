import json

def read_from_json_file(filename):
    result = None
    with open(filename) as f:
        result = json.load(f)
    return result

byte_order_size_alignment_lut = read_from_json_file("byte_order_size_alignment.json")
format_lut = read_from_json_file("format.json")


def parse_byte_order_size_alignment(char):
    if char not in byte_order_size_alignment_lut.keys():
        char = "@"
    return byte_order_size_alignment_lut[char]


def parse_format_string(string):
    result = {
        "byte_order_size_alignment": parse_byte_order_size_alignment(string[0]),
        "characters": []
    }





 
