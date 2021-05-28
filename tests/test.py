import unittest
from structexplainer import parse_format_string

class TestParseFormatString(unittest.TestCase):

    def test_first_character(self):
        self.assertEqual('foo'.upper(), 'FOO')

if __name__ == '__main__':
    unittest.main()
